#!/usr/bin/env node
// Import necessary modules
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Create a MySQL connection using environment variables
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('Connected to the MySQL server.');

    // Function to get campaigns
    const getCampaigns = async () => {
      const [results] = await conn.query('SELECT * FROM campaign');
      return results;
    };

    // Use the function and log results
    const campaigns = await getCampaigns();
    console.log(campaigns);

    // Close the connection when your app stops
    await conn.end();
  } catch (err) {
    console.error('Error connecting to MySQL: ' + err.message);
  }
}

main();

