import { config } from "dotenv";
import readline from 'readline';
import OpenAI from "openai";

config();

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    organization: process.env.RoboBard,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const chat = async (messages=[]) => {
    rl.question('What do you want to say to the Dungeon Master? (type "exit" to quit) ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      messages.push({
        role: "user",
        content: message
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // Change 'engine' to 'model'
        messages: messages,  // Pass the entire conversation history
      });

      const assistantMessage = response['choices'][0]['message']['content'];
      console.log(`\nDungeon Master: ${assistantMessage}`);

      messages.push({
        role: "assistant",
        content: assistantMessage
      });

      chat(messages);  // Continue the conversation
    });
  };

  chat();