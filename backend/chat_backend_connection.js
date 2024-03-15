// Backend connection for chatbot to OpenAI API GPT-3.5-Turbo model
// Fuctionality: Open a constant conversation in the terminal between user and AI Dungeon Master until exited by user.
// Input: User input
// Output: AI Dungeon Master response
// Author: 1023_Forge (Hector J. Vazquez)
// Date: 01/15/2024
import { config } from "dotenv";
//require('dotenv').config();
import readline from 'readline';
import OpenAI from "openai";
import express from 'express';
//const cors = require('cors');
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';

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

// Use CORS and body-parser middleware
app.use(cors());
app.use(bodyParser.json());

// Handle POST requests to /message
app.post('/message', async (req, res) => {
  const userInput = req.body.message;

  // Add user message to messages array
  const messages = [{
    role: "user",
    content: userInput
  }];

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
