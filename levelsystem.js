// levelsystem.js

let currentLevel = 1;

// Function to initialize the level system
function initLevelSystem() {
  updateLevelDisplay();
}

// Function to increase the level
function increaseLevel() {
  currentLevel++;
  updateLevelDisplay();
}

// Function to update the level display on the screen
function updateLevelDisplay() {
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) {
    levelDisplay.textContent = `Level: ${currentLevel}`;
  }
}
