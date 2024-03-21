// Function to fetch character data and display it
window.fetchCharacterData = function(characterName) {
  const characterDataElement = document.getElementById(`${characterName}-data`);

  // If the dropdown content is already visible, hide it and return
  if (characterDataElement.classList.contains('visible')) {
    characterDataElement.classList.remove('visible');
    return;
  }

  // Display a loading message
  characterDataElement.innerHTML = '<p>Loading...</p>';
  characterDataElement.classList.add('visible');

  fetch(`https://your-api-url/character-data/${characterName}`)
    .then(response => response.json())
    .then(data => {
      characterDataElement.innerHTML = `
        <p>Player: ${data.player || 'Player Name'}</p>
        <p>AC: ${data.ac || 'AC'}</p>
        <p>Speed: ${data.speed || 'Speed'}</p>
        <p>HP: ${data.hpCurrent || 'Current HP'}/${data.hpTotal || 'Total HP'}</p>
        <p>Level: ${data.level || 'Level'}</p>
        <p>Initiative: ${data.initiative || 'Initiative'}</p>
        <p>Conditions: ${data.conditions || 'Conditions'}</p>
        <p>Save DC: ${data.saveDc || 'Save DC'}</p>
        <p>Passive Perception: ${data.passivePerception || 'Passive Perception'}</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
      characterDataElement.innerHTML = `
        <p>Player: Player Name</p>
        <p>AC: AC</p>
        <p>Speed: Speed</p>
        <p>HP: Current HP/Total HP</p>
        <p>Level: Level</p>
        <p>Initiative: Initiative</p>
        <p>Conditions: Conditions</p>
        <p>Save DC: Save DC</p>
        <p>Passive Perception: Passive Perception</p>
      `;
    });
}

// Function to open the character edit modal
window.openCharacterEditModal = function(characterName) {
  // Get the modal and form elements
  const modal = document.getElementById('character-edit-modal');
  const form = document.getElementById('character-edit-form');

  // Fill the form with the current character data
  fetch(`https://your-api-url/character-data/${characterName}`)
    .then(response => response.json())
    .then(data => {
      form.elements['Player'].value = data.player || '';
      form.elements['AC'].value = data.player || '';
      form.elements['Speed'].value = data.player || '';
      form.elements['HP'].value = data.player || '';
      form.elements['Level'].value = data.player || '';
      form.elements['Initiative'].value = data.player || '';
      form.elements['Conditions'].value = data.player || '';
      form.elements['Save DC'].value = data.player || '';
      form.elements['Passive Perception'].value = data.player || '';
      // Repeat for all other fields...
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Show the modal
  modal.style.display = 'block';
}

// Function to save the character data and close the modal
window.saveCharacterData = function(event) {
  // Prevent the form from being submitted normally
  event.preventDefault();

  // Get the form and modal elements
  const form = document.getElementById('character-edit-form');
  const modal = document.getElementById('character-edit-modal');

  // Create an object with the new character data
  const characterData = {
    player: form.elements['player'].value,
    // Repeat for all other fields...
  };

  // Send a POST or PUT request to the server to update the character data
  fetch(`https://your-api-url/character-data/${characterName}`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(characterData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Hide the modal
  modal.style.display = 'none';
}

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
    element.innerHTML = items.map(item => `
      <div class="list-item">
        <button onclick="fetchCharacterData('${item}')">${item}</button>
        <button onclick="openCharacterEditModal('${item}')">+</button>
        <div id="${item}-data" class="dropdown-content"></div>
      </div>
    `).join('');
  }

  // Render the placeholder data
  renderList(characterDataElement, npcs.concat(pcs));

  // Render the placeholder data
  renderList(characterDataElement, npcs.concat(pcs));
  renderList(campaignInfoElement, campaigns);

  // Placeholder for the chat log
  chatLogElement.textContent = 'Welcome to the D&D Campaign Manager. Select a campaign to start!';
});

document.getElementById('exit-button').addEventListener('click', function() {
  document.getElementById('character-edit-modal').style.display = 'none';
});

document.getElementById('sendButton').addEventListener('click', async function() {
  console.log('Send button clicked');
  var userInputField = document.getElementById('userInput');
  var userInput = userInputField.value;


  // clear the user input field
  userInputField.value = '';

  console.log('User input:', userInput);
  var chatLog = document.getElementById('chatLog');

  // Scroll to the bottom of the chat log
  chatLog.scrollTop = chatLog.scrollHeight;

  // Display user input
  chatLog.innerHTML += '<p><strong>User:</strong> ' + userInput + '</p>';
  console.log('User input displayed', userInput);

  // Call the function to send the message to the server and display the AI response
  console.log('Before sendMessageToServer');
  await sendMessageToServer(userInput);
  console.log('After sendMessageToServer');
});

async function sendMessageToServer(userInput) {
  console.log('sendMessageToServer called with:', userInput);
  try {
    console.log('About to send fetch request');
    const requestBody = JSON.stringify({ message: userInput });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    })

    console.log('requestBody:', requestBody);
    console.log('Fetch request completed');

    if (!response.ok) {
      console.error('Fetch request failed:', response);
    }

    const data = await response.json();

    console.log('Received response:', data);

    // Now data.message contains the AI response. You can display this in your HTML.
    chatLog.innerHTML += '<p class="a1-response"><strong>4one: </strong>' + data.message + '</p>';
  } catch (error) {
    console.error('An error occurred:', error);
  }
  // Scroll to the bottom of the chat log
  chatLog.scrollTop = chatLog.scrollHeight;
}