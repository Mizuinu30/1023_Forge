document.addEventListener('DOMContentLoaded', () => {
  const campaignNameElement = document.getElementById('campaignName');
  const userNameElement = document.getElementById('userName');
  const loginButton = document.getElementById('loginButton');
  const homeButton = document.getElementById('homeButton');
  const characterDataElement = document.getElementById('characterData');
  const campaignInfoElement = document.getElementById('campaignInfo');
  const chatLogElement = document.getElementById('chatLog');

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

document.getElementById('toggleCharacterDataButton').addEventListener('click', function() {
  var section = document.getElementById('characterData');
  if (section.style.display === 'none') {
      section.style.display = 'block';
  } else {
      section.style.display = 'none';
  }
});

document.getElementById('toggleCampaignInfoButton').addEventListener('click', function() {
  var section = document.getElementById('campaignInfo');
  if (section.style.display === 'none') {
      section.style.display = 'block';
  } else {
      section.style.display = 'none';
  }
});

document.getElementById('sendButton').addEventListener('click', function() {
  var userInput = document.getElementById('userInput').value;
  var chatLog = document.getElementById('chatLog');

  // Display user input
  chatLog.innerHTML += '<p>User: ' + userInput + '</p>';

  // Send user input to OpenAI and get response
  fetch('https://api.openai.com/v4/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
      },
      body: JSON.stringify({
          prompt: userInput,
          max_tokens: 60
      })
  })
  .then(response => response.json())
  .then(data => {
      // Display OpenAI response
      chatLog.innerHTML += '<p>AI: ' + data.choices[0].text + '</p>';
  });

  // Clear user input
  document.getElementById('userInput').value = '';
});