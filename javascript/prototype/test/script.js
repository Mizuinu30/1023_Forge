document.addEventListener('DOMContentLoaded', () => {
  const campaignNameElement = document.getElementById('campaignName');
  const userNameElement = document.getElementById('userName');
  const loginButton = document.getElementById('loginButton');
  const npcPcDataElement = document.getElementById('npcPcData');
  const campaignInfoElement = document.getElementById('campaignInfo');
  const chatLogElement = document.getElementById('chatLog');

  // Placeholder data for demonstration
  const npcs = ['Alaric the Wise', 'Thalia the Swift', 'Brom the Stalwart'];
  const pcs = ['Eldon the Bold', 'Mira of Moonbrook', 'Garak the Shadow'];
  const campaigns = ['The Quest for the Lost Chalice', 'The Siege of Stormhaven', 'The Dragon of Ice Spire Peak'];

  // Function to render lists of NPCs, PCs, and campaigns
  function renderList(element, items) {
    element.innerHTML = items.map(item => `<div class="list-item">${item}</div>`).join('');
  }

  // Event listener for the login button
  loginButton.addEventListener('click', () => {
    // Placeholder for login functionality
    alert('Login functionality not implemented yet.');
  });

  // Render the placeholder data
  renderList(npcPcDataElement, npcs.concat(pcs));
  renderList(campaignInfoElement, campaigns);

  // Placeholder for the chat log
  chatLogElement.textContent = 'Welcome to the D&D Campaign Manager. Select a campaign to start!';
});

// Function to toggle sidebars
function toggleSidebar(sidebarId, mainActiveClass) {
  const sidebar = document.getElementById(sidebarId);
  sidebar.classList.toggle('active');

  const mainContent = document.getElementById('mainContent');
  mainContent.classList.toggle(mainActiveClass);
}

// Event listeners for the buttons
document.getElementById('toggleCharacterData').addEventListener('click', function() {
  toggleSidebar('characterData', 'active-main-left');
});

document.getElementById('toggleCampaignData').addEventListener('click', function() {
  toggleSidebar('campaignData', 'active-main-right');
});

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');

  loginButton.addEventListener('click', () => {
    // For now, we just log to the console
    console.log('Login button clicked');
    // Here you would typically open a login modal or redirect to a login page
  });

  // Other JavaScript code...
});
