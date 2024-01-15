///Backend connection for chatbot to OpenAI API GPT-3.5-Turbo model
//Fuctionality: Open a constant conversation in the terminal between user and AI Dungeon Master until closed by user.
//Input: User input
//Output: AI Dungeon Master response
//Author: 1023_Forge (Hector J. Vazquez)
//Date: 01/15/2024
import { config } from "dotenv";
import readline from 'readline';
import OpenAI from "openai";

config();

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

// Set up chat function that allows for user input in terminal
const chat = async (messages=[]) => {
    rl.question('What do you want to say to the Dungeon Master? (type "exit" to quit) ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      // Add the user's message to the conversation history
      messages.push({
        role: "user",
        content: message
      });

      // Generate the AI Dungeon Master's response
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // Change 'engine' to 'model'
        messages: messages,  // Pass the entire conversation history
      });

      // Print the AI Dungeon Master's response
      const assistantMessage = response['choices'][0]['message']['content'];
      console.log(`\nDungeon Master: ${assistantMessage}`);

      // Add the AI Dungeon Master's response to the conversation history
      messages.push({
        role: "assistant",
        content: assistantMessage
      });

      // Continue the conversation
      chat(messages);
    });
  };

  chat();//Start chat function