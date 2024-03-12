import { config } from 'dotenv';
import mysql from 'mysql2';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
config();

// Create a connection pool
const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// Function to create a user
async function createUser(username, password, email) {

    // Generate a random UUID
    const id = uuidv4();

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Combine the salt and the password, and hash the result
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');

    const sql = 'INSERT INTO users (id, username, password, salt, email) VALUES (?, ?, ?, ?, ?)';

    try {
        const [result] = await pool.execute(sql, [id, username, hashedPassword, salt, email]);
        console.log(`User ${username} created with ID: ${result.insertId}`);
    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        await pool.end();
    }
}

// Function to update a user
async function updateUserById(id, username, password) {
    // Generate a new random salt
    const salt = crypto.randomBytes(64).toString('hex');

    // Combine the new salt and the new password, and hash the result
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');

    const sql = 'UPDATE users SET username = ?, password = ?, salt = ? WHERE id = ?';

    try {
        await pool.execute(sql, [username, hashedPassword, salt, id]);
        console.log(`User with ID ${id} updated.`);
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await pool.end();
    }
}

// Function to update a user by username(***FORBIDDEN***)
async function updateUserByUsername(username, newUsername, newPassword) {
    // Generate a new random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Combine the new salt and the new password, and hash the result
    const hashedPassword = crypto.createHash('sha256').update(newPassword + salt).digest('hex');

    const sql = 'UPDATE users SET username = ?, password = ?, salt = ? WHERE username = ?';

    try {
        await pool.execute(sql, [newUsername, hashedPassword, salt, username]);
        console.log(`User with username ${username} updated.`);
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await pool.end();
    }
}

// Function to update a user by email(***FORBIDDEN***)
async function updateUserByEmail(email, newUsername, newPassword) {
    // Generate a new random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Combine the new salt and the new password, and hash the result
    const hashedPassword = crypto.createHash('sha256').update(newPassword + salt).digest('hex');

    const sql = 'UPDATE users SET username = ?, password = ?, salt = ? WHERE email = ?';

    try {
        await pool.execute(sql, [newUsername, hashedPassword, salt, email]);
        console.log(`User with email ${email} updated.`);
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await pool.end();
    }
}

// Function to get all users
async function getUsers() {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    } catch (err) {
        console.error('Error getting users:', err);
    } finally {
        await pool.end();
    }
}

// Function to get a user by ID
async function getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';

    try {
        const [rows] = await pool.query(sql, [id]);
        return rows;
    } catch (err) {
        console.error('Error getting user:', err);
    } finally {
        await pool.end();
    }
}

// Function to get a user by username
async function getUserByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';

    try {
        const [rows] = await pool.execute(sql, [username]);
        if (rows.length > 0) {
            console.log(`User found: ${rows[0].username}`);
            return rows[0];
        } else {
            console.log('No user found with that username.');
            return null;
        }
    } catch (err) {
        console.error('Error getting user:', err);
    } finally {
        await pool.end();
    }
}

// Function to get a user by email
async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';

    try {
        const [rows] = await pool.execute(sql, [email]);
        if (rows.length > 0) {
            console.log(`User found: ${rows[0].email}`);
            return rows[0];
        } else {
            console.log('No user found with that email.');
            return null;
        }
    } catch (err) {
        console.error('Error getting user:', err);
    } finally {
        await pool.end();
    }
}

// Function to delete a user by ID
async function deleteUserById(id) {
    const sql = 'DELETE FROM users WHERE id = ?';

    try {
        await pool.execute(sql, [id]);
        console.log(`User with ID ${id} deleted.`);
    } catch (err) {
        console.error('Error deleting user:', err);
    } finally {
        await pool.end();
    }
}

// Function to delete a user by username(***FORBIDDEN***)
async function deleteUserByUsername(username) {
    const sql = 'DELETE FROM users WHERE username = ?';

    try {
        await pool.execute(sql, [username]);
        console.log(`User with username ${username} deleted.`);
    } catch (err) {
        console.error('Error deleting user:', err);
    } finally {
        await pool.end();
    }
}
// Function to delete a user by email(***FORBIDDEN***)
async function deleteUserByEmail(email) {
    const sql = 'DELETE FROM users WHERE email = ?';

    try {
        await pool.execute(sql, [email]);
        console.log(`User with email ${email} deleted.`);
    } catch (err) {
        console.error('Error deleting user:', err);
    } finally {
        await pool.end();
    }
}
// Function to delete all users(***FORBIDDEN***)
async function deleteAllUsers() {
    const sql = 'DELETE FROM users';

    try {
        await pool.execute(sql);
        console.log('All users deleted.');
    } catch (err) {
        console.error('Error deleting all users:', err);
    } finally {
        await pool.end();
    }
}

// Function to get all characters
async function getCharacters() {
    try {
        const [rows] = await pool.query('SELECT * FROM characters');
        return rows;
    } catch (err) {
        console.error('Error getting characters:', err);
    } finally {
        await pool.end();
    }
}


// Function to get a character by ID
async function getCharacterById(id) {
    const sql = 'SELECT * FROM characters WHERE id = ?';

    try {
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    } catch (err) {
        console.error('Error getting character:', err);
    } finally {
        await pool.end();
    }
}

// Function to create a character
async function createCharacter(campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception) {
    const sql = `
        INSERT INTO characters (campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception];

    try {
        const [result] = await pool.execute(sql, params);
        console.log(`Character ${name} created in campaign ${campaign_id} with ID: ${result.insertId}`);
    } catch (err) {
        console.error('Error creating character:', err);
    } finally {
        await pool.end();
    }
}

// Function to update a character
async function updateCharacter(name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception) {
    const sql = `
        UPDATE characters
        SET player = ?, ac = ?, speed = ?, max_hp = ?, current_hp = ?, level = ?, initiative = ?, conditions = ?, save_dc = ?, passive_perception = ?
        WHERE campaign_id = ? AND name = ?
    `;

    const params = [player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, campaign_id, name];

    try {
        await pool.execute(sql, params);
        console.log(`Character ${name} in campaign ${campaign_id} updated.`);
    } catch (err) {
        console.error('Error updating character:', err);
    } finally {
        await pool.end();
    }
}

// Function to delete a character by ID
async function deleteCharacterById(id) {
    const sql = 'DELETE FROM characters WHERE id = ?';

    try {
        await pool.execute(sql, [id]);
        console.log(`Character with ID ${id} deleted.`);
    } catch (err) {
        console.error('Error deleting character:', err);
    } finally {
        await pool.end();
    }
}

// Function to delete all characters
async function deleteAllCharacters() {
    const sql = 'DELETE FROM characters';

    try {
        await pool.execute(sql);
        console.log('All characters deleted.');
    } catch (err) {
        console.error('Error deleting all characters:', err);
    } finally {
        await pool.end();
    }
}

// Sample usage
const result = await deleteUserById('f0319a47-51a1-4559-9507-049c6590bd83');
console.log(result)
