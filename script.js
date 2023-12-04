let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladinCount = 0;
let mercenaryCount = 0;
let passiveIncome = 0;
let totalClicks = 0;
let totalCoinsEarned = 0;
let totalUpgradesPurchased = 0;
let highestCoinsHeld = 0;
let totalKnightsRecruited = 0;
let totalArchersRecruited = 0;
let totalWizardsRecruited = 0;
let totalPaladinsRecruited = 0;
let totalMercenariesRecruited = 0;
let totalResourcesGathered = 0;
let totalSkillsUpgraded = 0;
let db;
let lastSaveTime = Date.now();

const clickSound = new Audio("click-sound.mp3");

// Function to initialize the IndexedDB
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

// Function to save game data to IndexedDB
function saveGameData() {
    const gameState = {
        coins, knightCount, archerCount, wizardCount, woodcuttingLevel, miningLevel,
        paladinCount, mercenaryCount, passiveIncome, totalClicks, totalCoinsEarned,
        totalUpgradesPurchased, highestCoinsHeld, totalKnightsRecruited, totalArchersRecruited,
        totalWizardsRecruited, totalPaladinsRecruited, totalMercenariesRecruited,
        totalResourcesGathered, totalSkillsUpgraded, lastSaveTime: Date.now()
    };
    const transaction = db.transaction(["gameState"], "readwrite");
    const store = transaction.objectStore("gameState");
    store.put(gameState, "currentGameState");
}

// Function to load game data from IndexedDB
function loadGameData() {
    const transaction = db.transaction(["gameState"], "readonly");
    const store = transaction.objectStore("gameState");
    const request = store.get("currentGameState");
    request.onsuccess = function (event) {
        if (request.result) {
            const savedState = request.result;
            // Update game variables from the loaded state
            coins = savedState.coins;
            knightCount = savedState.knightCount;
            archerCount = savedState.archerCount;
            wizardCount = savedState.wizardCount;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;
            paladinCount = savedState.paladinCount;
            mercenaryCount = savedState.mercenaryCount;
            totalClicks = savedState.totalClicks;
            totalCoinsEarned = savedState.totalCoinsEarned;
            totalUpgradesPurchased = savedState.totalUpgradesPurchased;
            highestCoinsHeld = savedState.highestCoinsHeld;
            totalKnightsRecruited = savedState.totalKnightsRecruited;
            totalArchersRecruited = savedState.totalArchersRecruited;
            totalWizardsRecruited = savedState.totalWizardsRecruited;
            totalPaladinsRecruited = savedState.totalPaladinsRecruited;
            totalMercenariesRecruited = savedState.totalMercenariesRecruited;
            totalResourcesGathered = savedState.totalResourcesGathered;
            totalSkillsUpgraded = savedState.totalSkillsUpgraded;
            lastSaveTime = savedState.lastSaveTime;
            // Update the game UI
            updateUI();
            updatePassiveIncome();
        }
    };
}

// Initialize the IndexedDB
initializeDB();

// Function to toggle background music
function toggleMusic() {
    const medievalThemeAudio = document.getElementById("medievaltheme");
    medievalThemeAudio.paused ? medievalThemeAudio.play() : medievalThemeAudio.pause();
}

// Function to toggle sound effects
function toggleSoundEffects() {
    const clickSoundAudio = document.getElementById("click-sound");
    clickSoundAudio.muted = !clickSoundAudio.muted;
}

// Event listeners for music and sound effects toggles
document.getElementById("toggle-music").addEventListener("change", toggleMusic);
document.getElementById("toggle-sfx").addEventListener("change", toggleSoundEffects);

// Function to format numbers in a compact format (e.g., 1K, 1M, 1B, 1T)
function compactNumberFormat(num) {
    if (num < 1000) return num;
    if (num >= 1000 && num < 1000000) return (num / 1000).toFixed(1) + "K";
    if (num >= 1000000 && num < 1000000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000000000 && num < 1000000000000) return (num / 1000000000).toFixed(1) + "B";
    return (num / 1000000000000).toFixed(1) + "T";
}

// Function to update the game UI
function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("paladin-count").textContent = paladinCount;
    document.getElementById("mercenary-count").textContent = mercenaryCount;
    updateStatsUI();
}

// Function to update the statistics in the UI
function updateStatsUI() {
    document.getElementById("total-clicks").textContent = `Total Castle Clicks: ${totalClicks}`;
    document.getElementById("total-coins-earned").textContent = `Total Coins Earned: ${compactNumberFormat(totalCoinsEarned)}`;
    document.getElementById("total-upgrades-purchased").textContent = `Total Upgrades Purchased: ${totalUpgradesPurchased}`;
    document.getElementById("highest-coins-held").textContent = `Highest Gold Coins Held: ${compactNumberFormat(highestCoinsHeld)}`;
    document.getElementById("total-knights-recruited").textContent = `Total Knights Recruited: ${totalKnightsRecruited}`;
    document.getElementById("total-archers-recruited").textContent = `Total Archers Recruited: ${totalArchersRecruited}`;
    document.getElementById("total-wizards-recruited").textContent = `Total Wizards Recruited: ${totalWizardsRecruited}`;
    document.getElementById("total-paladins-recruited").textContent = `Total Paladins Recruited: ${totalPaladinsRecruited}`;
    document.getElementById("total-mercenaries-recruited").textContent = `Total Mercenaries Recruited: ${totalMercenariesRecruited}`;
    document.getElementById("total-resources-gathered").textContent = `Total Resources Gathered: ${compactNumberFormat(totalResourcesGathered)}`;
    document.getElementById("total-skills-upgraded").textContent = `Total Skills Upgraded: ${totalSkillsUpgraded}`;
}

// Function to handle clicking the castle
function clickCastle() {
    coins++;
    totalClicks++;
    totalCoinsEarned++;
    if (coins > highestCoinsHeld) {
        highestCoinsHeld = coins;
    }
    saveGameData();
    updateUI();
    clickSound.play();
}

// Function to buy upgrades (knights, archers, wizards, etc.)
function buyUpgrade(type) {
    let cost = 0;
    let purchased = false;
    switch (type) {
        case "knight":
            cost = 10;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                totalKnightsRecruited++;
                purchased = true;
            }
            break;
        case "archer":
            cost = 25;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                totalArchersRecruited++;
                purchased = true;
            }
            break;
        case "wizard":
            cost = 50;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                totalWizardsRecruited++;
                purchased = true;
            }
            break;
        case "paladin":
            cost = 100;
            if (coins >= cost) {
                coins -= cost;
                paladinCount++;
                totalPaladinsRecruited++;
                purchased = true;
            }
            break;
        case "mercenary":
            cost = 200;
            if (coins >= cost) {
                coins -= cost;
                mercenaryCount++;
                totalMercenariesRecruited++;
                purchased = true;
            }
            break;
    }
    if (purchased) {
        totalUpgradesPurchased++;
        updatePassiveIncome();
        saveGameData();
        updateUI();
    }
}

// Function to handle skilling upgrades (woodcutting, mining, etc.)
function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            totalSkillsUpgraded++;
            totalResourcesGathered += woodcuttingLevel;
            break;
        case "mining":
            miningLevel++;
            totalSkillsUpgraded++;
            totalResourcesGathered += miningLevel;
            break;
    }
    saveGameData();
    updateUI();
}

// Function to update passive income based on recruited units
function updatePassiveIncome() {
    const knightIncomeRate = 1;
    const archerIncomeRate = 2;
    const wizardIncomeRate = 4;
    const paladinIncomeRate = 8;
    const mercenaryIncomeRate = 16;

    const totalPassiveIncome = (
        knightCount * knightIncomeRate +
        archerCount * archerIncomeRate +
        wizardCount * wizardIncomeRate +
        paladinCount * paladinIncomeRate +
        mercenaryCount * mercenaryIncomeRate
    );
    passiveIncome = totalPassiveIncome;
}

// Function to earn passive income when offline
function earnPassiveIncome() {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastSaveTime;
    const offlinePassiveIncome = Math.floor(passiveIncome * (timeDifference / 1000));

    coins += offlinePassiveIncome;
    lastSaveTime = currentTime;

    saveGameData();
    updateUI();
}

// Set up a timer to earn passive income when the game is closed
setInterval(earnPassiveIncome, 1000);
