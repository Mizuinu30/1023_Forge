import { config } from 'dotenv';
import mysql from 'mysql2';

// Load environment variables from .env file
config();

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

async function getcharacters() {
    const [rows] = await pool.query('SELECT * FROM characters');
    return rows[0];
}

async function getcharacter(id) {
    const [rows] = await pool.query('SELECT * FROM characters WHERE id = ?', [id]);
    return rows[0];
}

// Function to create a new character
async function createCharacter(campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception) {
    const sql = `
        INSERT INTO characters (campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception];

    try {
        const [result] = await pool.execute(sql, params);
        console.log(`Character ${name} created with ID: ${result.insertId}`);
    } catch (err) {
        console.error('Error creating character:', err);
    }
}


const characters = await getcharacter(2);
console.log(characters)
