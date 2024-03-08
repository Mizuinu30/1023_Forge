document.addEventListener('DOMContentLoaded', () => {
  const campaignNameElement = document.getElementById('campaignName');
  const userNameElement = document.getElementById('userName');
  const loginButton = document.getElementById('loginButton');
  const homeButton = document.getElementById('homeButton');
  const characterDataElement = document.getElementById('characterData');
  const campaignInfoElement = document.getElementById('campaignInfo');
  const chatLogElement = document.getElementById('chatLog');
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');

  // Placeholder data for demonstration
  const npcs = ["Alistair the Wise", "Melody the Swift", "Sir Galahad the Stalwart", "Rook the Shadow"];
  const pcs = ["Eldric Lightshield", "Hillith of Moonbrook", "Lucian Blackthorn"];
  const campaigns = ["Moonwell's Curse", "The Quest for the Lost Chalice", "The Siege of Stormhaven", "The Dragon of Ice Spire Peak"];

  // Function to render lists of NPCs, PCs, and campaigns
  function renderList(element, items) {
    element.innerHTML = items.map(item => `<div class="list-item">${item}</div>`).join('');
  }

  // Event listener for the login button
  loginButton.addEventListener('click', () => {
    // Placeholder for login functionality
    alert('Login functionality not implemented yet.');
  });

  // Event listener for the Home button
  homeButton.addEventListener('click', () => {
    // Placeholder for login functionality
    alert('Home page not implemented yet.');
  });

  // Render the placeholder data
  renderList(characterDataElement, npcs.concat(pcs));
  renderList(campaignInfoElement, campaigns);

  // Placeholder for the chat log
  chatLogElement.textContent = 'Welcome to the D&D Campaign Manager. Select a campaign to start!';
});

document.getElementById('sendButton').addEventListener('click', async function() {
  console.log('Send button clicked');
  var userInputField = document.getElementById('userInput');
  var userInput = userInputField.value;

  // clear the user input field
  userInputField.value = '';

  console.log('User input:', userInput);
  var chatLog = document.getElementById('chatLog');

  // Display user input
  chatLog.innerHTML += '<p><strong>User:</strong> ' + userInput + '</p>';

  // Call the function to send the message to the server and display the AI response
  console.log('Before sendMessageToServer');
  await sendMessageToServer(userInput);
  console.log('After sendMessageToServer');
});

async function sendMessageToServer(userInput) {
  console.log('sendMessageToServer called with:', userInput);
  try {
    console.log('About to send fetch request');
    const response = await fetch('http://127.0.0.1:3000/message', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userInput }),
  });

  console.log('Fetch request completed');

  if (!response.ok) {
    console.error('Fetch request failed:', response);
  }

  const data = await response.json();

  console.log('Received response:', data);

  // Now data.message contains the AI response. You can display this in your HTML.
  const chatLog = document.getElementById('chatLog');
  chatLog.innerHTML += '<p><strong>AI:</strong> ' + data.message + '</p>';
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
