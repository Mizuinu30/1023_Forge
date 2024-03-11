// Chat with OpenAI and log messages
const chat = async (playerName, messages=[]) => {
  let assistantMessage = '';

  // Continue conversation with player name and messages
  const question = messages.length === 0 ?
    `\nWhat do you want to say to the Dungeon Master, ${playerName}? (type "exit" to quit)\n >` :
    `\n${playerName}, your turn: `;

  // If there are messages, send them to OpenAI to get a response
  if (messages.length > 0) {
    // Log the last user message to the database
    const lastUserMessage = messages[messages.length - 1];
    await logChatMessage(playerName, lastUserMessage.content, lastUserMessage.role);

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

    // Log the assistant's response to the database
    await logChatMessage('Dungeon Master', assistantMessage, 'assistant');
  }

  askQuestion(playerName, question, messages);
  return assistantMessage;
};
