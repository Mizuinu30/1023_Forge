import express from 'express';
//import { Configuration, OpenAIApi } from 'openai';
import OpenAI from 'openai';
import 'dotenv/config';
import { logChatMessage } from '/home/juansilva/Documents/1023_Forge/database/database2.js'; // Adjust the path as necessary

const app = express();
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
  });
console.log(process.env.OpenAI_API_KEY);

async function getOpenAIResponse(message) {
    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo", // Change the model as per your OpenAI plan
        prompt: message,
        max_tokens: 150,
    });
    return response.data.choices[0].text.trim();
}

app.post('/message', async (req, res) => {
    const userInput = req.body.message;
    const userId = "exampleUserId"; // Ideally, this should be dynamically determined based on user authentication

    // Log the user's message to the database
    await logChatMessage(userId, userInput, 'user');

    // Get a response from the OpenAI API
    const response = await getOpenAIResponse(userInput);

    // Log the AI's response to the database
    await logChatMessage(userId, response, 'ai');

    // Send the response back to the client
    res.json({ message: response });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
