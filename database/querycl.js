// Import necessary packages
require('dotenv').config();
const mysql = require('mysql2/promise');

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

// Function to read all chat messages
async function readAllChatMessages() {
    const conn = await createConnection();
    const [rows] = await conn.query('SELECT * FROM ChatLog;');
    await conn.end();
    return rows;
}

// Function to update a chat message's information
async function updateChatMessage(id, newMessage) {
    const conn = await createConnection();
    const query = `UPDATE ChatLog SET message = ? WHERE id = ?;`;
    await conn.execute(query, [newMessage, id]);
    await conn.end();
}

// Function to delete a chat message
async function deleteChatMessage(id) {
    const conn = await createConnection();
    const query = `DELETE FROM ChatLog WHERE id = ?;`;
    await conn.execute(query, [id]);
    await conn.end();
}

// Example usage
async function main() {
    try {
        // Log a new chat message
        await logChatMessage('123', 'Hello, World!', 'user');

        // Read all chat messages
        const chatMessages = await readAllChatMessages();
        console.log(chatMessages);

        // Update a chat message's information
        // Assume the ID of the message you want to update is 1
        await updateChatMessage(1, 'Hello, Universe!');

        // Delete a chat message
        // Assume the ID of the message you want to delete is 1
        await deleteChatMessage(1);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
