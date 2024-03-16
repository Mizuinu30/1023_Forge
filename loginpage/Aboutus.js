document.getElementById('toggleButton-Alistair').addEventListener('click', function() {
  var textBox = document.getElementById('team-member-card-Hector');
  if (textBox.style.display === 'none') {
    textBox.style.display = 'block';
  } else {
    textBox.style.display = 'none';
  }
});