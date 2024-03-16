const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Assume you have this file setup as shown later
const app = express();
const port = 3000;
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,//secret_key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // For HTTPS: set true
}));

// Using auth routes
app.use(authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
