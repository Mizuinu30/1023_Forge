import express from 'express';
import mysql from 'mysql';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

config(); // Load environment variables

const app = express();
app.use(express.json()); // Parse JSON bodies

// Configure the database connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Helper function to get a connection from the pool
function getConnection() {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
}

// Helper function to perform a query
function queryDatabase(connection, query, parameters) {
  return new Promise((resolve, reject) => {
    connection.query(query, parameters, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// CREATE USER endpoint using async/await
app.post("/createUser", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const userId = uuidv4(); // Generate a unique ID for the new user
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the generated salt
    const connection = await getConnection();

    try {
      const sqlSearch = "SELECT * FROM users WHERE username = ?"; // Adjusted to the new table and column names
      const users = await queryDatabase(connection, sqlSearch, [username]);

      if (users.length !== 0) {
        console.log("User already exists");
        return res.status(409).send("User already exists");
      }

      // Adjusted to include uuid, email, and now the salt
      const sqlInsert = "INSERT INTO users (id, username, password, email, salt) VALUES (?, ?, ?, ?, ?)";
      await queryDatabase(connection, sqlInsert, [userId, username, hashedPassword, email, salt]);
      console.log("Created new User");
      res.status(201).send("User created");
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});


// LOGIN (AUTHENTICATE USER) endpoint using async/await
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await getConnection();

    try {
      const sqlSearch = "SELECT * FROM users WHERE username = ?"; // Adjusted to the new table name
      const result = await queryDatabase(connection, sqlSearch, [username]);

      if (result.length === 0) {
        console.log("User does not exist");
        return res.sendStatus(404);
      }

      const hashedPassword = result[0].password;
      const match = await bcrypt.compare(password, hashedPassword); // Compare passwords directly without adding salt

      if (match) {
        console.log("Login Successful");
        res.send(`${username} is logged in!`);
      } else {
        console.log("Password Incorrect");
        res.send("Password incorrect!");
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
