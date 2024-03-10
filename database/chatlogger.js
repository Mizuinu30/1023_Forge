// Import necessary packages
require('dotenv').config();
const mysql = require('mysql2/promise');
const readline = require('readline');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create a connection to the MySQL server
async function createConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

// Function to log a chat message
async function logChatMessage(userId, message, role = 'user') {
    const conn = await createConnection();
    const query = `
        INSERT INTO ChatLog (userId, message, role)
        VALUES (?, ?, ?);
    `;
    await conn.execute(query, [userId, message, role]);
    await conn.end();
}

// Function to prompt user and log chat message
function promptAndLogChatMessage() {
    rl.question('Enter user ID: ', (userId) => {
        rl.question('Enter message: ', (message) => {
            rl.question('Enter role (user/admin): ', async (role) => {
                await logChatMessage(userId, message, role);
                console.log('Chat message logged successfully.');
                rl.close(); // Close the readline interface
            });
        });
    });
}

promptAndLogChatMessage();
