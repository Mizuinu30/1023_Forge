const bcrypt = require('bcrypt');
const pool = require('../db'); // Ensure this is your configured database pool
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
//const { logConversation } = require('../database');

exports.getpstart = (req, res) => {
    res.render('pstart', { title: '1023_FORGE' });
};


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
exports.postRegister = (req, res) => {
    const { username, email, password } = req.body;
    const userId = uuidv4(); // Generate a new UUID for the user

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        const query = 'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)';

        pool.query(query, [userId, username, email, hash], (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error registering new user');
                return;
            }
            alert('Login functionality not implemented yet.');
            res.redirect('/login'); // Redirect to the login page after successful registration
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
=
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

exports.getCampaignManager = (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        res.render('campaignmanager', {
            title: 'Campaign Manager',
            user: req.session.user
        });
    }
};

// Chatbot controller
exports.chatController = async (req, res) => {
    let userInput = req.body.message;
    console.log('Body received:', req.body);

// Check if message is empty
    if (!userInput) {
        return res.status(400).send({ error: 'message is required' });
      };

let modifiedInput = userInput;

// Array of keywords and their added values
const keywords = [
    { keyword: 'create', addValue: ' as a Dungeon Master' },
    { keyword: 'write', addValue: ' as a fantasy author' },
    { keyword: 'describe', addValue: ' as a story teller' },
    { keyword: 'story', addValue: ' as a fantasy story' },
    { keyword: 'character', addValue: ' sheet' },
    { keyword: 'PC', addValue: ' character sheet' },
    { keyword: 'NPC', addValue: ' character sheet' },
    { keyword: 'monster', addValue: ' sheet' },
  ];

// Check for keywords and modify input
keywords.forEach(({ keyword, addValue }) => {
    if (userInput.includes(keyword) && !userInput.includes(addValue)) {
        modifiedInput += addValue;
    }
});

// Add default value
  modifiedInput += ' in 5e format';

// Log the user input
  console.log('Modified User input:\n', modifiedInput);

  try {
    // Assuming using OpenAI's GPT-3
    const gptResponse = await openai.chat.completions.create({
        messages: [{ role: 'user', content: modifiedInput }],
        model: 'gpt-3.5-turbo',
    });

    // Immediately log the full response to inspect its structure
    //console.log("Full API response:", JSON.stringify(gptResponse, null, 2));

    // Print response from OpenAI
    const assistantMessage = gptResponse.choices[0].message.content;
    console.log('AI response:', assistantMessage);

    // Send response back to frontend
    res.json({ message: assistantMessage });
} catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).send({ error: 'Error processing chat request.' });
}};

exports.getAboutUS = (req, res) => {
    res.render('aboutus', { title: 'About Us' })};

