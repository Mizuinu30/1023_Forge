// Backend connection for chatbot to OpenAI API GPT-3.5-Turbo model
// Fuctionality: Open a constant conversation in the terminal between user and AI Dungeon Master until exited by user.
// Input: User input
// Output: AI Dungeon Master response
// Author: 1023_Forge (Hector J. Vazquez)
// Date: 01/15/2024
import { config } from "dotenv";
import readline from 'readline';
import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Load environment variables from .env file
config();

// Set up OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    organization: process.env.RoboBard,
});

// Function to create a connection to the MySQL server
async function createConnection() {
  return mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
  });
}

// Create an Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Array of keywords and their added values
const keywords = [
  { keyword: 'create', addValue: ' as a Dungeon Master' },
  { keyword: 'write', addValue: ' as a fantasy author' },
  { keyword: 'describe', addValue: ' as a story teller' },
  { keyword: 'story', addValue: ' as a fantasy story' },
  { keyword: 'character', addValue: ' sheet' },
  { keyword: 'PC', addValue: ' character sheet' },
  { keyword: 'NPC', addValue: ' character sheet' },
  { keyword: 'monster', addValue: ' sheet' },
];

// Handle POST requests to /message
app.post('/message', async (req, res) => {
  let userInput = req.body.message;

   // Check for keywords and modify input
  for (let i = 0; i < keywords.length; i++) {
    if (userInput.includes(keywords[i].keyword)) {
      // Only append addValue if it doesn't already exist in userInput
      if (!userInput.includes(keywords[i].addValue)) {
        userInput += keywords[i].addValue;
      }
    }
  }

       // Add default value
  userInput += ' in 5e format';

  // Add user message to messages array
  const messages = [{
    role: "user",
    content: userInput
  }];

  // Log the user input
  console.log('Modified User input:\n', messages[0]);

  // Wait for response from OpenAI
  const response = await chat("Player", messages);

  // Send response back to frontend
  res.json({ message: response });
});

// Start the server
app.listen(3000, () => console.log('Server listening on port 3000'));

// Set up readline for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Setup chatbot conversation by providing a player name and an array of messages
const askQuestion = (playerName, question, messages) => {
// Ask user for input
    rl.question(question, async (message) => {
// Exit if user types "exit"
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

// Add user message to messages array
      messages.push({
        role: "user",
        content: message
      });

// wait for response from OpenAI
      await chat(playerName, messages);
    });
  }

// Chat with OpenAI
const chat = async (playerName, messages=[]) => {
  let assistantMessage = '';
// If there are no messages, print initial input
// Otherwise, continue conversation with player name and messages
  const question = messages.length === 0 ?
    `\nWhat do you want to say to the Dungeon Master, ${playerName}? (type "exit" to quit)\n >` :
    `\n${playerName}, your turn: `;

// If there are messages, send them to OpenAI to get a response
  if (messages.length > 0) {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

// Print response from OpenAI
      assistantMessage = response['choices'][0]['message']['content'];
      console.log(`\nDungeon Master: ${assistantMessage}`);

// Add response to messages array
      messages.push({
        role: "assistant",
        content: assistantMessage
      });
    }

    askQuestion(playerName, question, messages);
    return assistantMessage;
  };

// Start chatbot conversation
chat("Player");

  // Function to create a user
export async function createUser(username, password, email) {
  const id = uuidv4();

  // Hash the password with a cost factor of 10
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)';

  try {
      const [result] = await pool.execute(sql, [id, username, hashedPassword, email]);
      console.log(`User ${username} created with ID: ${id}`);
  } catch (err) {
      console.error('Error creating user:', err);
  } finally {
      await pool.end();
  }
}

// Function to update a user
export async function updateUserById(id, username, password) {
  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?';

  try {
      await pool.execute(sql, [username, hashedPassword, id]);
      console.log(`User with ID ${id} updated.`);
  } catch (err) {
      console.error('Error updating user:', err);
  } finally {
      await pool.end();
  }
}

// Function to update a user by username(***FORBIDDEN***)
export async function updateUserByUsername(username, newUsername, newPassword) {
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const sql = 'UPDATE users SET username = ?, password = ? WHERE username = ?';

  try {
      await pool.execute(sql, [newUsername, hashedPassword, username]);
      console.log(`User with username ${username} updated.`);
  } catch (err) {
      console.error('Error updating user:', err);
  } finally {
      await pool.end();
  }
}

// Function to update a user by email(***FORBIDDEN***)
export async function updateUserByEmail(email, newUsername, newPassword) {
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const sql = 'UPDATE users SET username = ?, password = ? WHERE email = ?';

  try {
      await pool.execute(sql, [newUsername, hashedPassword, email]);
      console.log(`User with email ${email} updated.`);
  } catch (err) {
      console.error('Error updating user:', err);
  } finally {
      await pool.end();
  }
}

// Function to get all users
export async function getUsers() {
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
export async function getUserById(id) {
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
export async function getUserByUsername(username) {
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
export async function getUserByEmail(email) {
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
export async function deleteUserById(id) {
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
export async function deleteUserByUsername(username) {
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
export async function deleteUserByEmail(email) {
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
export async function deleteAllUsers() {
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

// Create a new campaign
export async function createCampaign(name, user_id) {
  const sql = 'INSERT INTO campaigns (name, user_id) VALUES (?, ?)';
  const params = [name, user_id];

  try {
      const [result] = await pool.execute(sql, params);
      console.log(`Campaign ${name} created with ID: ${result.insertId}`);
  } catch (err) {
      console.error('Error creating campaign:', err);
  } finally {
      await pool.end();
  }
}

// Update a campaign by ID
export async function updateCampaignById(id, name) {
  const sql = 'UPDATE campaigns SET name = ? WHERE id = ?';

  try {
      await pool.execute(sql, [name, id]);
      console.log(`Campaign with ID ${id} updated.`);
  } catch (err) {
      console.error('Error updating campaign:', err);
  } finally {
      await pool.end();
  }
}

// Read a campaign by ID
export async function getCampaignById(id) {
  const sql = 'SELECT * FROM campaigns WHERE id = ?';

  try {
      const [rows] = await pool.execute(sql, [id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting campaign:', err);
  } finally {
      await pool.end();
  }
}

// Delete a campaign by ID
export async function deleteCampaignById(id) {
  const sql = 'DELETE FROM campaigns WHERE id = ?';

  try {
      await pool.execute(sql, [id]);
      console.log(`Campaign with ID ${id} deleted.`);
  } catch (err) {
      console.error('Error deleting campaign:', err);
  } finally {
      await pool.end();
  }
}

// Function to create a character
export async function createCharacter(campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, character_type="PC") {
  const sql = `
      INSERT INTO characters (campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, character_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, character_type];

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
export async function updateCharacter(campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, character_type="PC") {
  const sql = `
      UPDATE characters
      SET player = ?, ac = ?, speed = ?, max_hp = ?, current_hp = ?, level = ?, initiative = ?, conditions = ?, save_dc = ?, passive_perception = ?, character_type = ?
      WHERE campaign_id = ? AND name = ?
  `;

  const params = [player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception, character_type, campaign_id, name];

  try {
      await pool.execute(sql, params);
      console.log(`Character ${name} in campaign ${campaign_id} updated.`);
  } catch (err) {
      console.error('Error updating character:', err);
  } finally {
      await pool.end();
  }
}

// Function to get all characters
export async function getCharacters() {
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
export async function getCharacterById(id) {
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

// Function to get all characters for a campaign
export async function getCharactersByCampaignId(campaign_id) {
  const sql = 'SELECT * FROM characters WHERE campaign_id = ?';

  try {
      const [rows] = await pool.execute(sql, [campaign_id]);
      return rows;
  } catch (err) {
      console.error('Error getting characters:', err);
  } finally {
      await pool.end();
  }
}

// Function to delete a character by ID
export async function deleteCharacterById(id) {
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
export async function deleteAllCharacters() {
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

// Create a new quest
export async function createQuest(campaign_id, name, story) {
  const sql = 'INSERT INTO quests (campaign_id, name, story) VALUES (?, ?, ?)';
  const params = [campaign_id, name, story];

  try {
      const [result] = await pool.execute(sql, params);
      console.log(`Quest ${name} created with ID: ${result.insertId}`);
  } catch (err) {
      console.error('Error creating quest:', err);
  } finally {
      await pool.end();
  }
}

// Update a quest by ID
export async function updateQuestById(id, campaign_id, name, story) {
  const sql = 'UPDATE quests SET campaign_id = ?, name = ?, story = ? WHERE id = ?';

  try {
      await pool.execute(sql, [campaign_id, name, story, id]);
      console.log(`Quest with ID ${id} updated.`);
  } catch (err) {
      console.error('Error updating quest:', err);
  } finally {
      await pool.end();
  }
}

// Function to get all quests
export async function getAllQuests() {
  const sql = 'SELECT * FROM quests';

  try {
      const [rows] = await pool.execute(sql);
      console.log(rows);
  } catch (err) {
      console.error('Error getting quests:', err);
  } finally {
      await pool.end();
  }
}

// Read a quest by ID
export async function getQuestById(id) {
  const sql = 'SELECT * FROM quests WHERE id = ?';

  try {
      const [rows] = await pool.execute(sql, [id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting quest:', err);
  } finally {
      await pool.end();
  }
}

// Function to get all quests for a campaign
export async function getQuestsByCampaignId(campaign_id) {
  const sql = 'SELECT * FROM quests WHERE campaign_id = ?';

  try {
      const [rows] = await pool.execute(sql, [campaign_id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting quests:', err);
  } finally {
      await pool.end();
  }
}

// Delete a quest by ID
export async function deleteQuestById(id) {
  const sql = 'DELETE FROM quests WHERE id = ?';

  try {
      await pool.execute(sql, [id]);
      console.log(`Quest with ID ${id} deleted.`);
  } catch (err) {
      console.error('Error deleting quest:', err);
  } finally {
      await pool.end();
  }
}

// Create a new campaign_user
export async function createCampaignUser(user_id, campaign_id) {
  const sql = 'INSERT INTO campaign_users (user_id, campaign_id) VALUES (?, ?)';
  const params = [user_id, campaign_id];

  try {
      const [result] = await pool.execute(sql, params);
      console.log(`User ${user_id} added to campaign ${campaign_id}`);
  } catch (err) {
      console.error('Error creating campaign_user:', err);
  } finally {
      await pool.end();
  }
}

// Update a campaign_user's joined date
export async function updateCampaignUserJoinedDate(user_id, campaign_id, joined) {
  const sql = 'UPDATE campaign_users SET joined = ? WHERE user_id = ? AND campaign_id = ?';

  try {
      await pool.execute(sql, [joined, user_id, campaign_id]);
      console.log(`User ${user_id} in campaign ${campaign_id} had their joined date updated.`);
  } catch (err) {
      console.error('Error updating campaign_user:', err);
  } finally {
      await pool.end();
  }
}

// Read a campaign_user by user_id and campaign_id
export async function getCampaignUser(user_id, campaign_id) {
  const sql = 'SELECT * FROM campaign_users WHERE user_id = ? AND campaign_id = ?';

  try {
      const [rows] = await pool.execute(sql, [user_id, campaign_id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting campaign_user:', err);
  } finally {
      await pool.end();
  }
}

// Delete a campaign_user
export async function deleteCampaignUser(user_id, campaign_id) {
  const sql = 'DELETE FROM campaign_users WHERE user_id = ? AND campaign_id = ?';

  try {
      await pool.execute(sql, [user_id, campaign_id]);
      console.log(`User ${user_id} removed from campaign ${campaign_id}`);
  } catch (err) {
      console.error('Error deleting campaign_user:', err);
  } finally {
      await pool.end();
  }
}

// Create a new chatlog
export async function createChatlog(campaign_id, user_id, session_id, message, response) {
  const sql = 'INSERT INTO chatlogs (campaign_id, user_id, session_id, message, response) VALUES (?, ?, ?, ?, ?)';
  const params = [campaign_id, user_id, session_id, message, response];

  try {
      const [result] = await pool.execute(sql, params);
      console.log(`Chatlog created with ID: ${result.insertId}`);
  } catch (err) {
      console.error('Error creating chatlog:', err);
  } finally {
      await pool.end();
  }
}

// Update a chatlog by ID
export async function updateChatlogById(id, message, response) {
  const sql = 'UPDATE chatlogs SET message = ?, response = ? WHERE id = ?';

  try {
      await pool.execute(sql, [message, response, id]);
      console.log(`Chatlog with ID ${id} updated.`);
  } catch (err) {
      console.error('Error updating chatlog:', err);
  } finally {
      await pool.end();
  }
}

// Read a chatlog by ID
export async function getChatlogById(id) {
  const sql = 'SELECT * FROM chatlogs WHERE id = ?';

  try {
      const [rows] = await pool.execute(sql, [id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting chatlog:', err);
  } finally {
      await pool.end();
  }
}

// Function to get all chatlogs for a campaign
export async function getChatlogsByCampaignId(campaign_id) {
  const sql = 'SELECT * FROM chatlogs WHERE campaign_id = ? ORDER BY timestamp ASC';

  try {
      const [rows] = await pool.execute(sql, [campaign_id]);
      console.log(rows);
  } catch (err) {
      console.error('Error getting chatlogs:', err);
  } finally {
      await pool.end();
  }
}

// Delete a chatlog by ID
export async function deleteChatlogById(id) {
  const sql = 'DELETE FROM chatlogs WHERE id = ?';

  try {
      await pool.execute(sql, [id]);
      console.log(`Chatlog with ID ${id} deleted.`);
  } catch (err) {
      console.error('Error deleting chatlog:', err);
  } finally {
      await pool.end();
  }
}

// Function to delete all chatlogs for a campaign
export async function deleteChatlogsByCampaignId(campaign_id) {
  const sql = 'DELETE FROM chatlogs WHERE campaign_id = ?';

  try {
      await pool.execute(sql, [campaign_id]);
      console.log(`All chatlogs for campaign ${campaign_id} deleted.`);
  } catch (err) {
      console.error('Error deleting chatlogs:', err);
  } finally {
      await pool.end();
  }
}
