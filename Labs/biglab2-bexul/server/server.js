'use strict';
const express = require('express');
const morgan = require('morgan');
const session = require('express-session'); // session middleware

const passport = require('passport');
const passportLocal = require('passport-local');

const path = require('path');

const taskDAO = require('./taskDAO');
const userDAO = require('./userDAO');

// initialize and configure passport strategy that passport needs to do whenever it receives user and password to try to authenticate
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    userDAO.getUser(username, password).then(user => {
        // done (null) -> I could perform the authn check!
        if (user) // authn successful
            done(null, user);
        else // authn unsuccessful
            done(null, false, { message: 'Username or password wrong' });
    }).catch(err => { // catch db error -> I could perform the authn check!
        done(err);
    });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDAO.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const app = express();
const PORT = process.env.PORT || 3001;
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("./client/build"));

// custom middleware: check if a given request is coming from an authenticated user.
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
};


// initialize and configure HTTP sessions : from this point on, on every request registered to app, before being executed, will execute this middleware first: if a cookie is received it will try to unlock the session storage, and if I'm sending a response, thanks to this middleware I will automatically attach the same cookie that was received, or generate a new one if the request didn't have one. Since the cookie needs to store passport information, I must tell passport to use the session cookies generated using this middleware!
app.use(session({
    secret: 'secret task application pass phrase omg 11!!1',
    resave: false,
    saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/tasks', (req, res) => {
    if (req.isAuthenticated())  //without this, GET api/courses would be a public function 
        taskDAO.listAllTasks(req.user.id).then((tasks) => res.json(tasks)).catch((error) => res.status(500).json(error));
});

app.get('/api/tasks:filter/:selectedFilter', (req, res) => {
    //N.B. /api/tasks:filter IS JUST THE API URL, NOT A PARAMETRIC PATH !!! THE PARAMETRIC PART IS ONLY /:selectedFilter!
    console.log(req.params.selectedFilter);
    if (taskDAO.filters.get(req.params.selectedFilter, req.user.id) === undefined) {
        res.sendStatus(404);    // equivalent to res.status(404).send('Not Found')
    }
    else
        taskDAO.listFiltered(req.params.selectedFilter, req.user.id).then((tasks) => res.json(tasks)).catch((error) => res.status(500).json(error));
});

app.get('/api/tasks/:id', (req, res) => {
    taskDAO.getTaskById(req.params.id, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.post('/api/tasks', (req, res) => {
    console.log(req.body.deadline);
    //TODO: validation, expecially dates!
    taskDAO.createTask({
        description: req.body.description, important: req.body.important, private: req.body.private,
        deadline: req.body.deadline, completed: req.body.completed, user: req.body.user
    }, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.put('/api/tasks/:id', (req, res) => {
    //TODO: validation, expecially dates!
    taskDAO.updateTask({
        id: req.params.id, description: req.body.description, important: req.body.important, private: req.body.private,
        deadline: req.body.deadline, completed: req.body.completed, user: req.body.user
    }, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.patch('/api/tasks/:id', (req, res) => {
    //TODO: validation
    taskDAO.setCompleted({ id: req.params.id, completed: req.body.completed }, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

app.delete('/api/tasks/:id', (req, res) => {
    taskDAO.deleteTask({ id: req.params.id }, req.user.id).then((task) => res.json(task)).catch((error) => res.status(500).json(error));
});

/*** Users APIs ***/

// POST /sessions (POST /login)
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)  // db error in verification callback
            return next(err);
        if (!user) {  // authn failed
            // display wrong login messages
            return res.status(401).json(info); // info is the object containing the error message created inside the verification callback
        }
        // authn success
        // success, perform the login (in the alternative this is internally called by authenticate). It is the function that initializes the session!
        req.login(user, (err) => {
            if (err)  // ?
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDAO.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});
*/

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    //after big setup you can just use req.user and everything is ok!
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});

app.get("*", (req, res) => {
    res.redirect('index.html');
});

app.use(function (req, res, next) {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
