// user login

const express = require('express'); // Express.js a web application framework for Node.js
const passport = require('passport'); // Passport.js an authentication middleware for Node.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // bcrypt a password hashing function

// User model
const User = require('./models/User');

// Configure Passport.js
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      // Compare passwords using bcrypt
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }
));

// Express.js routes
const app = express();

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);
