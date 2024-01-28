#!/usr/bin/env node
// Import necessary modules


import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mysql = require('mysql');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: '1023_Forge'
};

// Create a MySQL connection
const conn = mysql.createConnection(dbConfig);

conn.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Function to get campaigns
const getCampaigns = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM campaign', (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//close the connection when your app stops
conn.end();
