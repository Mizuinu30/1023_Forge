import { config } from "dotenv";
import readline from 'readline';
import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from '/home/juansilva/1023_Forge/database/logChatMessage.js';
const { logChatMessage } = pkg;

config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.ORGANIZATION,
});
console.log(process.env.OPENAI_API_KEY); // This should print your API key


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/message', async (req, res) => {
  const userInput = req.body.message;
  await logChatMessage('User', userInput, 'user'); // Log user message

  const messages = [{ role: "user", content: userInput }];
  const response = await chat("Player", messages);

  res.json({ message: response });
});

app.listen(3000, () => console.log('Server listening on port 3000'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const chat = async (playerName, messages = []) => {
  let assistantMessage = '';
  const question = messages.length === 0 ?
    `\nWhat do you want to say to the Dungeon Master, ${playerName}? (type "exit" to quit)\n >` :
    `\n${playerName}, your turn: `;

  if (messages.length > 0) {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    assistantMessage = response.choices[0].message.content;
    console.log(`\nDungeon Master: ${assistantMessage}`);

    messages.push({ role: "assistant", content: assistantMessage });
    await logChatMessage('Dungeon Master', assistantMessage, 'assistant'); // Log AI response
  }

  askQuestion(playerName, question, messages);
};

const askQuestion = (playerName, question, messages) => {
  rl.question(question, async (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      await logChatMessage(playerName, 'Conversation ended by user', 'user');
      rl.close();
      return;
    }

    messages.push({ role: "user", content: userInput });
    await logChatMessage(playerName, userInput, 'user'); // Log subsequent user messages

    await chat(playerName, messages);
  });
};

chat("Player");
