// Import necessary packages
//import 'dotenv/config';
//import mysql from 'mysql2/promise';
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

// Function to create a new character
async function createCharacter(userName, password, email, userIdUuid, tableId) {
    const conn = await createConnection();
    const query = `INSERT INTO CharacterInformation (UserName, password, email, user_id_uuid, table_id) VALUES (?, ?, ?, ?, ?);`;
    await conn.execute(query, [userName, password, email, userIdUuid, tableId]);
    await conn.end();
}

// Function to read all characters
async function readAllCharacters() {
    const conn = await createConnection();
    const [rows] = await conn.query('SELECT * FROM CharacterInformation;');
    await conn.end();
    return rows;
}

// Function to update a character's information
async function updateCharacter(loginKey, newUserName, newPassword, newEmail, newUserIdUuid, newTableId) {
    const conn = await createConnection();
    const query = `UPDATE CharacterInformation SET UserName = ?, password = ?, email = ?, user_id_uuid = ?, table_id = ? WHERE Login_key = ?;`;
    await conn.execute(query, [newUserName, newPassword, newEmail, newUserIdUuid, newTableId, loginKey]);
    await conn.end();
}

// Function to delete a character
async function deleteCharacter(loginKey) {
    const conn = await createConnection();
    const query = `DELETE FROM CharacterInformation WHERE Login_key = ?;`;
    await conn.execute(query, [loginKey]);
    await conn.end();
}

// Example usage
async function main() {
    try {
        // Create a new character
        await createCharacter('ExampleUser', 'ExamplePassword', 'example@example.com', 'uuid-1234', 'tableId-1');

        // Read all characters
        const characters = await readAllCharacters();
        console.log(characters);

        // Update a character's information
        await updateCharacter(1, 'NewUserName', 'NewPassword', 'newemail@example.com', 'new-uuid-1234', 'new-tableId-1');

        // Delete a character
        await deleteCharacter(1);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
