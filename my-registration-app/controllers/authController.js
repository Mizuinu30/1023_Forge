const bcrypt = require('bcrypt');
const pool = require('../db'); // Make sure you've set up this module to export your MySQL pool
const { v4: uuidv4 } = require('uuid');

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login Page' });
};

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Register Page' });
};

exports.postRegister = (req, res) => {
    const { username, email, password } = req.body;
    const salt = 10;
    const userId = uuidv4(); // Generate a new UUID for the user

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        const query = 'INSERT INTO users (id, username, email, password, salt) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [userId, username, email, hash, salt], (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error registering new user');
                return;
            }
            res.redirect('/login'); // Redirect to the login page after successful registration
        });
    });
};


exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';

    pool.query(query, [email], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
            return;
        }

        if (results.length > 0) {
            // Compare hashed password with the one stored in the database
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    // Passwords match
                    req.session.user = { id: results[0].id, username: results[0].username }; // Set user session
                    res.redirect('/profile'); // Redirect to the profile page or wherever you wish
                } else {
                    // Passwords don't match
                    res.send('Login failed. Invalid email or password.');
                }
            });
        } else {
            // No user found with that email
            res.send('Login failed. Invalid email or password.');
        }
    });
};

exports.logout = (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.status(500).send('Could not log out, please try again');
            } else {
                // The `res.redirect` could be to the login screen or wherever you want the user to go after logout.
                res.redirect('/login');
            }
        });
    }
};
exports.getProfile = (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        res.render('profile', {
            title: 'Profile Page',
            user: req.session.user
        });
    }
};