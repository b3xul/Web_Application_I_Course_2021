'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const taskDao = require('./task-dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    });
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

// init express
const app = new express(); // FIXME: should we use new?
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
};

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '- lorem ipsum dolor sit amet -',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/


// GET /api/tasks - handles also filter=? query parameter
app.get('/api/tasks',
  isLoggedIn,
  [], // filter check is done in task-dao, if no matching filter is found all tasks are returned
  (req, res) => {
    // get tasks that match optional filter in the query
    taskDao.listTasks(req.user.id, req.query.filter)
      .then(tasks => res.json(tasks))
      .catch(() => res.status(500).end());
  });

// GET /api/tasks/<id>
app.get('/api/tasks/:id',
  isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    try {
      const result = await taskDao.getTask(req.user.id, req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  });


// POST /api/tasks
app.post('/api/tasks',
  isLoggedIn,
  [
    check(['user']).isInt(),
    check('description').isLength({ min: 1, max: 160 }),
    check(['important', 'private', 'completed']).isBoolean(),
    check('deadline').isISO8601({ strict: true }).optional({ checkFalsy: true })
  ],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }


    const task = {
      description: req.body.description,
      important: req.body.important,
      private: req.body.private,
      deadline: req.body.deadline,
      completed: req.body.completed,
      user: req.user.id // WARN: user id in the req.body.user does not mean anything because the loggedIn user can change only its owns
    };

    try {
      const result = await taskDao.createTask(task);
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new task: ${err}.` });
    }
  });

// PUT /api/tasks/<id>
app.put('/api/tasks/:id',
  isLoggedIn,
  [
    check(['id', 'user']).isInt(),
    check('description').isLength({ min: 1, max: 160 }),
    check(['important', 'private', 'completed']).isBoolean(),
    check('deadline').isISO8601({ strict: true }).optional({ checkFalsy: true })
  ],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }


    if (req.body.id !== Number(req.params.id)) {  // Check if url and body id mismatch
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const task = {
      id: req.body.id,
      description: req.body.description,
      important: req.body.important,
      private: req.body.private,
      deadline: req.body.deadline,
      completed: req.body.completed,
      user: req.user.id // WARN: user id in the req.body.user does not mean anything because the loggedIn user can change only its owns
    };

    try {
      const result = await taskDao.updateTask(req.user.id, task.id, task);
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of task ${req.params.id}` });
    }

  });

// DELETE /api/tasks/<id>
app.delete('/api/tasks/:id',
  isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    try {
      await taskDao.deleteTask(req.user.id, req.params.id);
      res.status(200).json({});
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of task ${req.params.id}` });
    }
  });


/*** USER APIs ***/


// Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});



// Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

