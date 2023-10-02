let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

// Array to store unlocked achievements
let achievements = [];

// Function to disable finger zooming
function disableFingerZooming() {
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });
}

// Function to disable swipe-to-refresh on mobile
function disableSwipeToRefresh() {
    let touchStartY = 0;

    document.body.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.body.addEventListener('touchmove', function (e) {
        const touchY = e.touches[0].clientY;
        const touchMoveDistance = touchY - touchStartY;

        // Check if the user is trying to refresh with a swipe
        if (touchMoveDistance > 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

disableFingerZooming();
disableSwipeToRefresh();

function initializeDB() {
    const request = indexedDB.open("MedievalClickerDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('gameState')) {
            db.createObjectStore('gameState');
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadGameData();
    };

    request.onerror = function (event) {
        console.log("Error opening DB", event);
    };
}

function saveGameData() {
    const gameState = {
        coins,
        knightCount,
        archerCount,
        wizardCount,
        woodcuttingLevel,
        miningLevel,
        achievements, // Save unlocked achievements
    };

    const transaction = db.transaction(["gameState"], "readwrite");
    const store = transaction.objectStore("gameState");
    store.put(gameState, "currentGameState");
}

function loadGameData() {
    const transaction = db.transaction(["gameState"], "readonly");
    const store = transaction.objectStore("gameState");
    const request = store.get("currentGameState");
    request.onsuccess = function (event) {
        if (request.result) {
            const savedState = request.result;

            coins = savedState.coins;
            knightCount = savedState.knightCount;
            archerCount = savedState.archerCount;
            wizardCount = savedState.wizardCount;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;
            achievements = savedState.achievements; // Load unlocked achievements

            updateUI();
            updateAchievementsUI(); // Update achievements UI
        }
    };
}

initializeDB();

function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
}

function unlockAchievement(achievementName) {
    if (!achievements.includes(achievementName)) {
        achievements.push(achievementName);
        saveGameData();
        updateAchievementsUI();
    }
}

function updateAchievementsUI() {
    const achievementsContainer = document.getElementById("achievements-container");
    achievementsContainer.innerHTML = ""; // Clear previous achievements

    for (let i = 0; i < medievalAchievements.length; i++) {
        const achievement = medievalAchievements[i];
        const achievementDiv = document.createElement("div");
        achievementDiv.textContent = achievement;
        achievementDiv.classList.add("achievement");

        if (achievements.includes(achievement)) {
            achievementDiv.classList.add("unlocked");
        }

        achievementsContainer.appendChild(achievementDiv);
    }
}

const medievalAchievements = [
    "Peasant's First Coin",
    "Apprentice Knight",
    "Bowman Initiate",
    "Novice Wizard",
    "Lumberjack",
    "Rookie Miner",
    // Add more achievements here
    "Mastering the Bow",
    "Wielding the Sword",
    "Champion of the Realm",
    "Dragon Slayer",
    "King's Favorite",
    "Legendary Hero",
    "Loyal Knight",
    "Royal Archer",
    "Wizard's Apprentice",
    "Fabled Warrior",
    "Sword of the King",
    "Guardian of the Castle",
    "Master of Spells",
    "Conqueror of Mountains",
    "Treasure Hunter",
    "Champion of the People",
    "Defender of the Realm",
    "King's Right Hand",
    "Heroic Knight",
    "Elite Archer",
    "Sorcerer Supreme",
    "Legendary Champion",
    "Excalibur Bearer",
    "Keeper of the Gate",
    "Wizardry Master",
    "Mountain King",
    "Golden Hoarder",
    "Medieval Legend",
    "Royal Favor",
    "Knight Commander",
    "Sharpshooter",
    "Master Wizard",
    "Fearless Adventurer",
    "Castle Protector",
    "Magic Scholar",
    "Lumber King",
    "Mine Tycoon",
    "Unstoppable Force",
    "Majestic Sovereign",
    "Ultimate Wizard",
    "Medieval Conqueror",
];

// Function to handle clicking on the Castle
function clickCastle() {
    coins++;
    unlockAchievement("Peasant's First Coin");
    saveGameData();
    updateUI();
}

// Function to buy upgrades
function buyUpgrade(type, cost) {
    switch (type) {
        case "knight":
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                unlockAchievement("Apprentice Knight");
            }
            break;
        case "archer":
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                unlockAchievement("Bowman Initiate");
            }
            break;
        case "wizard":
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                unlockAchievement("Novice Wizard");
            }
            break;
    }
    saveGameData();
    updateUI();
}

// Function to handle skilling clicks
function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            if (woodcuttingLevel >= 10) {
                unlockAchievement("Lumberjack");
            }
            break;
        case "mining":
            miningLevel++;
            if (miningLevel >= 10) {
                unlockAchievement("Rookie Miner");
            }
            break;
    }
    saveGameData();
    updateUI();
}

// Function to update passive income
function updatePassiveIncome() {
    let totalPassiveIncome = knightCount + archerCount * 2 + wizardCount * 5;

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

// Function to start passive income
function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
