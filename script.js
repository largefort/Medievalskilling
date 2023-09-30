let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

// Initialize enhanced CSS mode
let enhancedCSSMode = false;

// Initialize the database
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

            updateUI();
        }
    };
}

initializeDB();

// Function to toggle enhanced CSS mode
function toggleEnhancedCSSMode() {
    enhancedCSSMode = !enhancedCSSMode;

    // Apply enhanced CSS styles if the checkbox is checked
    if (enhancedCSSMode) {
        applyEnhancedCSS();
    } else {
        removeEnhancedCSS();
    }

    // Save the state of the checkbox
    saveEnhancedCSSMode();
}

// Function to apply enhanced CSS styles
function applyEnhancedCSS() {
    // Add or modify your enhanced CSS styles here
    // For example, you can change background colors or fonts
    document.body.style.backgroundColor = "darkslategray";
}

// Function to remove enhanced CSS styles
function removeEnhancedCSS() {
    // Remove any enhanced CSS styles you added in applyEnhancedCSS()
    document.body.style.backgroundColor = "#8a5c2e"; // Restore the original background color
}

// Function to save the state of the enhanced CSS checkbox
function saveEnhancedCSSMode() {
    localStorage.setItem("enhancedCSSMode", enhancedCSSMode);
}

// Function to load the state of the enhanced CSS checkbox
function loadEnhancedCSSMode() {
    const savedEnhancedCSSMode = localStorage.getItem("enhancedCSSMode");
    if (savedEnhancedCSSMode === "true") {
        enhancedCSSMode = true;
        document.getElementById("enhanced-css-checkbox").checked = true;
        applyEnhancedCSS();
    }
}

// Add an event listener to the checkbox to toggle enhanced CSS mode
document.getElementById("enhanced-css-checkbox").addEventListener("change", toggleEnhancedCSSMode);

function clickCastle() {
    coins++;
    saveGameData();
    updateUI();
}

function buyUpgrade(type) {
    switch (type) {
        case "knight":
            if (coins >= 10) {
                coins -= 10;
                knightCount++;
            }
            break;
        case "archer":
            if (coins >= 25) {
                coins -= 25;
                archerCount++;
            }
            break;
        case "wizard":
            if (coins >= 50) {
                coins -= 50;
                wizardCount++;
            }
            break;
    }
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

function updateUI() {
    counter.textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
}

function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            break;
        case "mining":
            miningLevel++;
            break;
    }
    saveGameData();
    updateUI();
}

function updatePassiveIncome() {
    let totalPassiveIncome = knightCount + archerCount * 2 + wizardCount * 5;

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
