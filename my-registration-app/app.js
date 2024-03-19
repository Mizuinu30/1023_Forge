const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Assume you have this file setup as shown later
const cors = require('cors');
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

app.use(cors());

// Using auth routes
app.use(authRoutes);

app.use(express.json()); // for parsing application/json

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
