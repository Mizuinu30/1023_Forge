const bcrypt = require('bcrypt');
const pool = require('../db'); // Ensure this is your configured database pool
const { v4: uuidv4 } = require('uuid');


// Route handler to serve the start page
exports.getpstart = (req, res) => {
    res.render('pstart', { title: '1023_FORGE' });
};

// Route handler to serve the login page
exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login Page' });
};

// Route handler to serve the registration page
exports.getRegister = (req, res) => {
    res.render('register', { title: 'Register Page' });
};

// Route handler to serve the campaign manager page
exports.getCampaignManager = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userId = req.session.user.id;
        const query = `
            SELECT campaigns.id, campaigns.name, GROUP_CONCAT(characters.name SEPARATOR ', ') AS character_names
            FROM campaigns
            LEFT JOIN characters ON campaigns.id = characters.campaign_id
            JOIN campaign_users ON campaigns.id = campaign_users.campaign_id
            WHERE campaign_users.user_id = ?
            GROUP BY campaigns.id, campaigns.name
        `;
        const [campaigns] = await pool.query(query, [userId]);
        res.render('campaignmanager', {
            title: 'Campaign Manager',
            user: req.session.user,
            campaigns: campaigns
        });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).send('Server error');
    }
};

// Route handler to serve the About Us page
exports.getAboutUS = (req, res) => {
    res.render('aboutus', { title: 'About Us' });
};

// Implementation for user registration
exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Please provide username, email, and password.');
        }
        const salt = await bcrypt.genSalt(10);
        const userId = uuidv4();
        const hash = await bcrypt.hash(password, salt);
        const query = 'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)';
        await pool.query(query, [userId, username, email, hash]);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
};

// Implementation for user login
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Please provide email and password.');
        }
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await pool.query(query, [email]);
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = { id: user.id, username: user.username };
                res.redirect('/campaignmanager'); // Ensure you have a route handler for '/profile'
            } else {
                // Send a JSON response with a message
                res.send({ message: 'Login failed. Invalid email or password.' });
                console.log('it;s here 2');
            }
        } else {
            res.send({ message: 'Login failed. Invalid email or password.' });
            console.log('or here.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


// Route handler to log out the user
exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.status(500).send('Could not log out, please try again');
            } else {
                res.redirect('/login');
            }
        });
    }
};


