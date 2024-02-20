// quest.js

// Sample quest types
const questTypes = ['Retrieve', 'Defeat', 'Explore'];

// Sample quest rewards
const questRewards = ['Gold', 'Experience', 'Item'];

// Function to generate a random quest
function generateQuest() {
  const quest = {
    type: getRandomElement(questTypes),
    target: generateRandomTarget(),
    reward: getRandomElement(questRewards),
    amount: Math.floor(Math.random() * 10) + 1, // Random amount for the quest
  };

  displayQuest(quest);
}

// Function to display the generated quest
function displayQuest(quest) {
  const questList = document.getElementById('quest-list');

  const questItem = document.createElement('li');
  questItem.textContent = `${quest.type} ${quest.target} - Reward: ${quest.amount} ${quest.reward}`;
  questList.appendChild(questItem);
}

// Helper function to get a random element from an array
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Function to generate a random quest target based on quest type
function generateRandomTarget() {
  const questType = getRandomElement(questTypes);

  switch (questType) {
    case 'Retrieve':
      return 'Artifact';
    case 'Defeat':
      return 'Dragon';
    case 'Explore':
      return 'Cave';
    default:
      return 'Unknown';
  }
}
