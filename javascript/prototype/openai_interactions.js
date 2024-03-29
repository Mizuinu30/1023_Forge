// create prompt functions that search user input
// for specific keywords, and add more appropriate prompts
// openai_interactions.js

const { askQuestion, chat } = require('./chat_backend_connection');
const readline = require('readline');

// Keywords and corresponding roles
const keywords = {
  'write': 'fantasy author',
  'create': '5E format',
  'story': 'storyteller',
  'npc': 'character sheet'
};

// Setup chatbot conversation by providing a player name and an array of messages
function askQuestionWithKeywords(playerName, question, messages) {
  // Ask user for input
  readline.question(question, async (message) => {
    // Check for keywords in user input and modify role accordingly
    let role = 'user';
    for (let keyword in keywords) {
      if (message.includes(keyword)) {
        role = keywords[keyword];
      }
    }

    // Add user message to messages array
    messages.push({
      role: role,
      content: message
    });
  });
}