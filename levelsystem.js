// levelsystem.js

let currentLevel = 1;
let questsCompleted = 0;
const questsPerLevel = 3; // Number of quests to complete for each level up

// Function to initialize the level system
function initLevelSystem() {
  updateLevelDisplay();
}

// Function to increase the level
function increaseLevel() {
  currentLevel++;
  questsCompleted = 0; // Reset quests completed for the new level
  updateLevelDisplay();
}

// Function to update the level display on the screen
function updateLevelDisplay() {
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) {
    levelDisplay.textContent = `Level: ${currentLevel}`;
  }
}

// Function to handle completing quests and level up
function completeQuestAndLevelUp() {
  questsCompleted++;

  // Additional logic for quest completion, if needed
  console.log('Quest completed!');

  // Check if the player should level up
  if (questsCompleted === questsPerLevel) {
    increaseLevel();
    console.log('Level up!');
  }
}

// Replace this with your actual function or logic to check if a quest is completed
function isQuestCompleted() {
  // Replace this with your actual logic
  // For example, return true if the quest is completed, else return false
  return Math.random() < 0.5; // Simulated completion for demonstration
}

// Replace this with your actual function or logic to increase the level
function increaseLevel() {
  // Your actual logic to increase the level
  // For example, you might want to increase the level based on certain conditions
  // For now, let's assume a simple increase every 3 completed quests
  currentLevel++;
  questsCompleted = 0; // Reset quests completed for the new level
  updateLevelDisplay();
}
