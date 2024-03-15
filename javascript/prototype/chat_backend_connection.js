///Backend connection for chatbot to OpenAI API GPT-3.5-Turbo model
//Fuctionality: Open a constant conversation in the terminal between user and AI Dungeon Master until exited by user.
//Input: User input
//Output: AI Dungeon Master response
//Author: 1023_Forge (Hector J. Vazquez)
//Date: 01/15/2024
//Modified: 03/06/2024 (Nadja)
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import axios from 'axios';
import readline from 'readline';
import OpenAI from 'openai';
import cors from 'cors';

// Load environment variables
dotenvConfig();

const app = express();
// enable CORS for the frontend server, assuming it's running on localhost:
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies

app.options('/message', cors()); // enable pre-flight request for POST request to /message

app.post('/message', cors(), async (req, res) => {
  console.log('Received a request at /message');

  const userInput = req.body.message;
  console.log('User input:', userInput);

  try {
    // Send user input to OpenAI and get response
    console.log('OpenAI API Key:', process.env.OPENAI_API_KEY)
    const openaiResponse = await axios.post('https://api.openai.com/v4/engines/davinci-codex/completions', {
      prompt: userInput,
      max_tokens: 60 // can be deleted or # can be adjusted
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }

    });

    console.log('Received response from OpenAI:', openaiResponse.data);

    // Send AI response back to frontend
    res.json({ message: openaiResponse.data.choices[0].text });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));

// Set up OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    organization: process.env.RoboBard,
});

// Set up readline for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Keywords and corresponding roles
const keywords = {
  'write': 'fantasy author',
  'create': '5E format',
  'story': 'storyteller',
  'npc': 'character sheet'
};

// Setup chatbot conversation by providing a player name and an array of messages
const askQuestion = (playerName, question, messages) => {
// Ask user for input
    rl.question(question, async (message) => {
// Check for keywords in user input and modify role accordingly
      let role = 'user';
      for (let keyword in keywords) {
        if (message.includes(keyword)) {
          role = keywords[keyword];
        }
      }

// Add user message to messages array
      messages.push({
        role: "user",
        content: message
      });
// Exit if user types "exit"
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

//wait for response from OpenAI
      await chat(playerName, messages);
    });
  }

// Chat with OpenAI
  const chat = async (playerName, messages=[]) => {
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
      }).catch(error => {
        console.error('An error occured', error);
      });

// Print response from OpenAI
      const assistantMessage = response['choices'][0]['message']['content'];
      console.log(`\nDungeon Master: ${assistantMessage}`);

// Add response to messages array
      messages.push({
        role: "assistant",
        content: assistantMessage
      });
    }


    askQuestion(playerName, question, messages);
  };

// Start chatbot conversation
  chat("Player");