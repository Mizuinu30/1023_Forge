const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: 'Mizuinu',
    host: 'localhost',
    password: 'Sadbut30@',
    database: '1023_Forge',
});


app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

        db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)"
        [username, password],
        (err, result) => {
            console.log(err);
        }
    );
});

app.post('/login', (req, res) => {
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
        if (err) {
            res.send({ err: err });
        }

        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "Wrong username/password combination!" });
        }
    }
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});