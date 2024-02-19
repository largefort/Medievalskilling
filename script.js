let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let fishingLevel = 1;
let charismaLevel = 1;
let paladinCount = 0;
let passiveIncome = 0;
let db;
let lastSaveTime = Date.now(); // Initialize lastSaveTime with the current time

// Add upgrade counters
let knightUpgradeCounter = 0;
let archerUpgradeCounter = 0;
let wizardUpgradeCounter = 0;
let paladinUpgradeCounter = 0;

// Add an HTML audio element for the upgrade sound
document.write(`
<audio id="upgradeSound">
    <source src="upgradesound.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
`);

// Preload the click sound
const clickSound = new Audio("click-sound.mp3");

// Function to update the gold coin counter in the Shop tab
function updateGoldCounterShop() {
    document.getElementById("gold-counter-shop").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
}

// Function to update the gold coin counter in the Skilling tab
function updateGoldCounterSkilling() {
    document.getElementById("gold-counter-skilling").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
}

// Function to update the upgrade counters on the buttons
function updateUpgradeCounters() {
    document.getElementById("knight-upgrade-count").textContent = knightUpgradeCounter;
    document.getElementById("archer-upgrade-count").textContent = archerUpgradeCounter;
    document.getElementById("wizard-upgrade-count").textContent = wizardUpgradeCounter;
    document.getElementById("paladin-upgrade-count").textContent = paladinUpgradeCounter;
}

function disableFingerZooming() {
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });
}

disableFingerZooming();

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
        paladinCount,
        lastSaveTime: Date.now(), // Update the last save time
        knightUpgradeCounter,
        archerUpgradeCounter,
        wizardUpgradeCounter,
        paladinUpgradeCounter,
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
            fishingLevel = savedState.fishingLevel;
            charismaLevel = savedState.charismaLevel;
            paladinCount = savedState.paladinCount;
            lastSaveTime = savedState.lastSaveTime; // Update the last save time

            // Retrieve upgrade counters from the saved game state
            knightUpgradeCounter = savedState.knightUpgradeCounter || 0;
            archerUpgradeCounter = savedState.archerUpgradeCounter || 0;
            wizardUpgradeCounter = savedState.wizardUpgradeCounter || 0;
            paladinUpgradeCounter = savedState.paladinUpgradeCounter || 0;

            updateUI();
        }
    };
}

initializeDB();

// Function to toggle music
function toggleMusic() {
    const medievalThemeAudio = document.getElementById("medievaltheme");
    if (medievalThemeAudio.paused) {
        medievalThemeAudio.play();
    } else {
        medievalThemeAudio.pause();
    }
}

// Function to toggle sound effects
function toggleSoundEffects() {
    const clickSoundAudio = document.getElementById("click-sound");
    const upgradeSoundAudio = document.getElementById("upgradeSound");

    clickSoundAudio.muted = !clickSoundAudio.muted;
    upgradeSoundAudio.muted = !upgradeSoundAudio.muted;
}

// Add event listeners to the checkboxes
document.getElementById("toggle-music").addEventListener("change", toggleMusic);
document.getElementById("toggle-sfx").addEventListener("change", toggleSoundEffects);

// Function to request fullscreen
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome and Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // Internet Explorer
        element.msRequestFullscreen();
    }
}

function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("fishing-level").textContent = fishingLevel;
    document.getElementById("charisma-level").textContent = charismaLevel;
    document.getElementById("paladin-count").textContent = paladinCount;

    // Update the upgrade counters on the buttons
    updateUpgradeCounters();

    updatePassiveIncome();
}

// Fixed the function declaration and added missing parts
function clickCastle(element) {
    coins++;
    saveGameData();
    updateUI();

    // Play the preloaded click sound
    clickSound.play();

    // Add 'animated' and 'heartBeat' classes to the castle image
    element.classList.add('animated', 'heartBeat');

    // Remove the 'animated' and 'heartBeat' classes after the animation completes
    element.addEventListener('animationend', function () {
        element.classList.remove('animated', 'heartBeat');
    });
}

function buyUpgrade(type) {
    let cost = 0;
    let upgradeCount;

    switch (type) {
        case "knight":
            cost = 10;
            upgradeCount = knightCount;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
            }
            break;
        case "archer":
            cost = 25;
            upgradeCount = archerCount;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
            }
            break;
        case "wizard":
            cost = 50;
            upgradeCount = wizardCount;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
            }
            break;
        case "paladin":
            cost = 100;
            upgradeCount = paladinCount;
            if (coins >= cost) {
                coins -= cost;
                paladinCount++;
            }
            break;
    }

    if (cost > 0) {
        // Update the upgrade counters
        switch (type) {
            case "knight":
                document.getElementById("knight-upgrade-count").textContent = ++knightUpgradeCounter;
                break;
            case "archer":
                document.getElementById("archer-upgrade-count").textContent = ++archerUpgradeCounter;
                break;
            case "wizard":
                document.getElementById("wizard-upgrade-count").textContent = ++wizardUpgradeCounter;
                break;
            case "paladin":
                document.getElementById("paladin-upgrade-count").textContent = ++paladinUpgradeCounter;
                break;
        }

        // Play the upgrade sound
        const upgradeSound = document.getElementById("upgradeSound");
        upgradeSound.play();
    }

    // Update the gold coin counter for Shop tab
    updateGoldCounterShop();

    saveGameData();
    updateUI();
}

function compactNumberFormat(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
    return +(num / 1e12).toFixed(1) + "T";
}

function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            break;
        case "mining":
            miningLevel++;
            break;
        case "fishing":
            fishingLevel++;
            break;
        case "charisma":
            charismaLevel++;
            break;
    }

    // Update the gold coin counter for Skilling tab
    updateGoldCounterSkilling();

    saveGameData();
    updateUI();
}

function updatePassiveIncome() {
    // Calculate passive income based on knights, archers, wizards, and paladins
    const knightIncomeRate = 1;   // Adjust the income rate for knights
    const archerIncomeRate = 2;   // Adjust the income rate for archers
    const wizardIncomeRate = 4;   // Adjust the income rate for wizards
    const paladinIncomeRate = 8;  // Adjust the income rate for paladins

    const totalPassiveIncome = (knightCount * knightIncomeRate + archerCount * archerIncomeRate + wizardCount * wizardIncomeRate + paladinCount * paladinIncomeRate);
    passiveIncome = totalPassiveIncome;
}

function earnPassiveIncome() {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastSaveTime;
    const offlinePassiveIncome = Math.floor(passiveIncome * (timeDifference / 1000));

    coins += offlinePassiveIncome;
    lastSaveTime = currentTime; // Update the last save time

    // Update the gold coin counters for both Shop and Skilling tabs
    updateGoldCounterShop();
    updateGoldCounterSkilling();

    saveGameData();
    updateUI();
}

setInterval(earnPassiveIncome, 1000);

// Call initUpgradeCounters at the end of your script
function initUpgradeCounters() {
    // Retrieve upgrade counters from the saved game state
    knightUpgradeCounter = savedState.knightUpgradeCounter || 0;
    archerUpgradeCounter = savedState.archerUpgradeCounter || 0;
    wizardUpgradeCounter = savedState.wizardUpgradeCounter || 0;
    paladinUpgradeCounter = savedState.paladinUpgradeCounter || 0;

    // Update the counters on the buttons
    updateUpgradeCounters();
}
