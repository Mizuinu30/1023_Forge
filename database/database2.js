#!/usr/bin/nodejs

// Import necessary packages
import 'dotenv/config'; // Ensure your .env file is configured with DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME
import mysql from 'mysql2/promise';

// Function to create a connection to the MySQL server
async function createConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

// Function to log chat messages to the database
export async function logChatMessage(userId, message, role = 'user') {
    const conn = await createConnection();
    const query = `
        INSERT INTO ChatLog (userId, message, role)
        VALUES (?, ?, ?);
    `;
    await conn.execute(query, [userId, message, role]);
    await conn.end();
}

async function main() {
    const conn = await createConnection();

    console.log(`${process.env.DB_USER} connected to ${process.env.DB_HOST}`);
    console.log('Connected to the MySQL server.');

    // SQL statements for table creation
    const tableCreationStatements = [
        `
        CREATE TABLE IF NOT EXISTS CharacterInformation (
            Login_key INT AUTO_INCREMENT PRIMARY KEY,
            UserName VARCHAR(255),
            password VARCHAR(255),
            email VARCHAR(255),
            user_id_uuid VARCHAR(255),
            table_id VARCHAR(255)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS table_id (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            player_character VARCHAR(255),
            campaign_name VARCHAR(255),
            chatgpt VARCHAR(255),
            non_player_character VARCHAR(255),
            campaign_uuid CHAR(36),
            login_key VARCHAR(255)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS campaign (
            campaign_id INT AUTO_INCREMENT PRIMARY KEY,
            campaign_name VARCHAR(255),
            campaign_uuid CHAR(36),
            login_key VARCHAR(255),
            lore VARCHAR(255),
            story VARCHAR(255),
            quest VARCHAR(255)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS non_player_character (
            non_player_character_id INT AUTO_INCREMENT PRIMARY KEY,
            non_player_character_name VARCHAR(255),
            non_player_character_uuid CHAR(36),
            login_key VARCHAR(255),
            lore VARCHAR(255),
            story VARCHAR(255),
            quest VARCHAR(255)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            salt VARCHAR(255) NOT NULL,
            PRIMARY KEY (user_id)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS user_info (
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            address VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS item (
            item_id INT AUTO_INCREMENT PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            item_description TEXT,
            item_type VARCHAR(255),
            item_value DECIMAL(10,2),
            item_weight DECIMAL(10,2),
            character_key INT,
            FOREIGN KEY (character_key) REFERENCES CharacterInformation(Login_key) ON DELETE SET NULL
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS ChatLog (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId VARCHAR(255),
            message TEXT,
            role ENUM('user', 'ai') NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `
    ];

    // Execute table creation commands
    for (const sql of tableCreationStatements) {
        await conn.query(sql);
    }
    console.log("Tables created successfully.");

    // Close the connection when done
    await conn.end();
    console.log('MySQL connection closed.');
}

// Execute the main function and catch any errors
main().catch(console.error);
