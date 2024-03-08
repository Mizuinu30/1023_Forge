#!/usr/bin/nodejs

// Import necessary modules

//const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';
//const dotenv = require('dotenv');
import dotenv from 'dotenv';
//import logger from 'pino';
//const logger = require('pino')();
import pino from 'pino';
const logger = pino();

// Load environment variables
dotenv.config();
const openAI_API_Key = process.env.OpenAI_API_Key;

async function connectToDatabase() {
  try {
    // Database connection configuration
    const pool = mysql.createPool({
      connectionLimit: 5,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0
    });
    logger.info('Database connection pool created.');
    return pool;
  } catch (e) {
    logger.error('Error while creating connection pool:', e);
    throw e;
  }
}

async function executeQuery(pool, query, params) {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return rows;
  } catch (e) {
    logger.error(`Error: '${e}' occurred during query execution.`);
    return null;
  }
}

// Usage Example
(async () => {
  const pool = await connectToDatabase();
  const query = 'SELECT * FROM campaign WHERE id = ?';
  const result = await executeQuery(pool, query, [42]);
  if (result) {
    result.forEach(row => {
      console.log(row);
    });
  }
})();
