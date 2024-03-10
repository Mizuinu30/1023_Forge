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

// Function to create a new campaign
async function createCampaign(campaignName, campaignUuid, loginKey, lore, story, quest) {
    const conn = await createConnection();
    const query = `INSERT INTO campaign (campaign_name, campaign_uuid, login_key, lore, story, quest) VALUES (?, ?, ?, ?, ?, ?);`;
    await conn.execute(query, [campaignName, campaignUuid, loginKey, lore, story, quest]);
    await conn.end();
}

// Function to read all campaigns
async function readAllCampaigns() {
    const conn = await createConnection();
    const [rows] = await conn.query('SELECT * FROM campaign;');
    await conn.end();
    return rows;
}

// Function to update a campaign's information
async function updateCampaign(campaignId, newCampaignName, newCampaignUuid, newLoginKey, newLore, newStory, newQuest) {
    const conn = await createConnection();
    const query = `UPDATE campaign SET campaign_name = ?, campaign_uuid = ?, login_key = ?, lore = ?, story = ?, quest = ? WHERE campaign_id = ?;`;
    await conn.execute(query, [newCampaignName, newCampaignUuid, newLoginKey, newLore, newStory, newQuest, campaignId]);
    await conn.end();
}

// Function to delete a campaign
async function deleteCampaign(campaignId) {
    const conn = await createConnection();
    const query = `DELETE FROM campaign WHERE campaign_id = ?;`;
    await conn.execute(query, [campaignId]);
    await conn.end();
}

// Example usage
async function main() {
    try {
        // Create a new campaign
        await createCampaign('Epic Quest', 'uuid-5678', 'loginKey-1', 'Deep lore...', 'The story begins...', 'The first quest');

        // Read all campaigns
        const campaigns = await readAllCampaigns();
        console.log(campaigns);

        // Update a campaign's information
        await updateCampaign(1, 'New Epic Quest', 'new-uuid-5678', 'new-loginKey-1', 'Updated lore...', 'The story continues...', 'A new quest');

        // Delete a campaign
        await deleteCampaign(1);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
