const mysql = require('mysql');

// Create a connection to the MySQL server
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'mizuinu',
    password: ''
});

// Connect to the MySQL server
conn.connect((err) => {
    if (err) {
        return console.error('Error connecting to MySQL: ' + err.message);
    }

    console.log('Connected to the MySQL server.');

    // Create the database
    const databaseName = '1023_Forge';
    conn.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
        if (err) {
            return console.error('Failed to create database: ' + err.message);
        }

        // If no error, select the database
        conn.changeUser({database: databaseName}, (err) => {
            if (err) {
                return console.error('Failed to select database: ' + err.message);
            }

            // Define SQL statements for table creation
            const create_CharacterInformation = `
            CREATE TABLE IF NOT EXISTS CharacterInformation (
                Login_key INT AUTO_INCREMENT PRIMARY KEY,
                UserName VARCHAR(255),
                password VARCHAR(255),
                email VARCHAR(255),
                user_id_uuid VARCHAR(255),
                table_id VARCHAR(255)
            )
            `;
            const create_table_id = `
            CREATE TABLE IF NOT EXISTS table_id (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                player_character VARCHAR(255),
                campaign_name VARCHAR(255),
                chatgpt VARCHAR(255),
                non_player_character VARCHAR(255),
                campaign_uuid CHAR(36),
                login_key VARCHAR(255)
            )
            `;
            const create_campaign = `
            CREATE TABLE IF NOT EXISTS campaign (
                campaign_id INT AUTO_INCREMENT PRIMARY KEY,
                campaign_name VARCHAR(255),
                campaign_uuid CHAR(36),
                login_key VARCHAR(255),
                lore VARCHAR(255),
                story VARCHAR(255),
                quest VARCHAR(255)
            )
            `;
            const create_non_player_character = `
            CREATE TABLE IF NOT EXISTS non_player_character (
                non_player_character_id INT AUTO_INCREMENT PRIMARY KEY,
                non_player_character_name VARCHAR(255),
                non_player_character_uuid CHAR(36),
                login_key VARCHAR(255),
                lore VARCHAR(255),
                story VARCHAR(255),
                quest VARCHAR(255)
            )
            `;
            const create_users =`
            CREATE TABLE users (
                user_id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                salt VARCHAR(255) NOT NULL,
                PRIMARY KEY (user_id)
            )
            `;
            const create_user_info =`
            CREATE TABLE user_info (
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                address VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
            `;
            // Execute table creation commands
            conn.query(create_CharacterInformation);
            conn.query(create_table_id);
            conn.query(create_campaign);
            conn.query(create_non_player_character);
            conn.query(create_users);
            conn.query(create_user_info);
            console.log("Tables created successfully.");

            // Close the connection
            conn.end((err) => {
                if (err) {
                    return console.error('Error closing the connection: ' + err.message);
                }
                console.log('MySQL connection closed.');
            });
        });
    });
});
