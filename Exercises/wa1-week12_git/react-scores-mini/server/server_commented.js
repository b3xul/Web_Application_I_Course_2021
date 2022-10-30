'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const session = require('express-session'); // session middleware

const passport = require('passport');
const passportLocal = require('passport-local');

const examDao = require('./exam-dao'); // module for accessing the exams in the DB
const userDao = require('./user-dao');



// initialize and configure passport strategy that passport needs to do whenever it receives user and password to try to authenticate
passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  userDao.getUser(username, password).then(user => {
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
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});



// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user.
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
};


// initialize and configure HTTP sessions : from this point on, on every request registered to app, before being executed, will execute this middleware first: if a cookie is received it will try to unlock the session storage, and if I'm sending a response, thanks to this middleware I will automatically attach the same cookie that was received, or generate a new one if the request didn't have one. Since the cookie needs to store passport information, I must tell passport to use the session cookies generated using this middleware!
app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

// Now passport is ready to store into the session storage created by the express-session middleware, all the information related to the current authenticated session 

/*** Courses/Exams APIs ***/


// GET /api/courses
app.get('/api/courses', (req, res) => {
  if (req.isAuthenticated())  //without this, GET api/courses would be a public function 
    examDao.listCourses()
      .then(courses => res.json(courses))
      .catch(() => res.status(500).end());
});

// GET /api/exams
app.get('/api/exams', isLoggedIn, async (req, res) => { // private function: middleware isLoggedIn!
  try {
    const exams = await examDao.listExams(req.user.id);
    res.json(exams);
  } catch (err) {
    res.status(500).end();
  }
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
      // this is coming from userDao.getUser()
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


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});