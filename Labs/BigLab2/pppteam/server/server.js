'use strict';
const express = require('express');
const morgan = require('morgan');
const taskDAO = require('./taskDAO');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./userDAO'); // module for accessing the users in the DB
const PORT = 3001;

passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                done(null, false, { message: 'Incorrect username/password' });
            done(null, user);
        }).catch((err) => console.error(err));
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'not authenticated' });
};

// set up the session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/tasks', isLoggedIn, (req, res) => {
    taskDAO.listAllTasks(req.user.id).then((tasks) => res.json(tasks)).catch((error) => res.status(500).json(error));
});

app.get('/api/tasks:filter/:filter', isLoggedIn, (req, res) => {
    //N.B. /api/tasks:filter IS JUST THE API URL, NOT A PARAMETRIC PATH !!! THE PARAMETRIC PART IS ONLY /:filter!
    if (!(req.params.filter in taskDAO.filters)) {
        res.sendStatus(404);    // equivalent to res.status(404).send('Not Found')
    }
    else
        taskDAO.listFiltered(req.params.filter, req.user.id).then((tasks) => res.json(tasks)).catch((error) => res.status(500).json(error));
});

app.get('/api/tasks/:id', isLoggedIn, (req, res) => {
    taskDAO.getTaskById(req.params.id, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.post('/api/tasks', isLoggedIn, (req, res) => {
    taskDAO.createTask({
        description: req.body.description, important: req.body.important, private: req.body.private,
        deadline: req.body.deadline, completed: req.body.completed, user: req.user.id
    }).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.put('/api/tasks/:id', isLoggedIn, (req, res) => {
    taskDAO.updateTask({
        id: req.params.id, description: req.body.description, important: req.body.important, private: req.body.private,
        deadline: req.body.deadline, completed: req.body.completed, user: req.user.id
    }).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.patch('/api/tasks/:id', isLoggedIn, (req, res) => {
    taskDAO.markTask({ id: req.body.id, completed: req.body.v, user: req.user.id }).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.delete('/api/tasks/:id', isLoggedIn, (req, res) => {
    taskDAO.deleteTask({ id: req.params.id, user: req.user.id }).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

// login
app.post('/api/login', function (req, res, next) {
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

app.delete('/api/logout/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/login/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });
});

app.use(function (req, res, next) {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));