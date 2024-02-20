// levelsystem.js

let currentLevel = 1;
let experiencePoints = 0;
const xpPerClick = 10; // XP gained per click on the castle

// Function to initialize the level system
function initLevelSystem() {
  // Load saved data on initialization
  loadSavedData();
  updateLevelDisplay();
}

// Function to increase the level
function increaseLevel() {
  currentLevel++;
  saveData(); // Save data upon leveling up
  updateLevelDisplay();
}

// Function to update the level display on the screen
function updateLevelDisplay() {
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) {
    levelDisplay.textContent = `Level: ${currentLevel}`;
  }
}

// Function to handle XP gain and level up
function gainXP(xp) {
  experiencePoints += xp;

  // Check if the player should level up
  while (experiencePoints >= xpNeededForNextLevel()) {
    increaseLevel();
    console.log('Level up!');
  }

  saveData(); // Save data after gaining XP
}

// Function to calculate XP needed for the next level
function xpNeededForNextLevel() {
  // Adjust this formula based on your desired XP progression
  return currentLevel * 100; // Example: XP needed is 100 times the current level
}

// Function to handle clicking the castle and gaining XP
function clickCastle() {
  // Add any additional logic or effects related to clicking the castle here
  gainXP(xpPerClick);
  console.log('Clicked the castle! Gained XP.');
}

// Function to handle completing quests and gain XP
function completeQuestAndGainXP() {
  const xpFromQuest = 50; // Adjust the XP gained from quests as needed
  gainXP(xpFromQuest);
  console.log('Quest completed! Gained XP.');
}

// Function to save data to local storage
function saveData() {
  localStorage.setItem('currentLevel', currentLevel);
  localStorage.setItem('experiencePoints', experiencePoints);
}

// Function to load saved data from local storage
function loadSavedData() {
  const savedLevel = localStorage.getItem('currentLevel');
  const savedXP = localStorage.getItem('experiencePoints');

  if (savedLevel !== null) {
    currentLevel = parseInt(savedLevel, 10);
  }

  if (savedXP !== null) {
    experiencePoints = parseInt(savedXP, 10);
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
  currentLevel++;
  experiencePoints = 0; // Reset XP upon leveling up
  saveData(); // Save data upon leveling up
  updateLevelDisplay();
}

// Load saved data on script initialization
initLevelSystem();
