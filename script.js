let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let farmerCount = 0;
let builderCount = 0;
let merchantCount = 0;
let db;

const counter = document.getElementById("counter");

// Initialize the database
function initializeDB() {
    const request = indexedDB.open("MedievalClickerDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('gameState')) {
            db.createObjectStore('gameState');
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadGameData();
    };

    request.onerror = function(event) {
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
        farmerCount,
        builderCount,
        merchantCount
    };

    const transaction = db.transaction(["gameState"], "readwrite");
    const store = transaction.objectStore("gameState");
    store.put(gameState, "currentGameState");
}

function loadGameData() {
    const transaction = db.transaction(["gameState"], "readonly");
    const store = transaction.objectStore("gameState");
    const request = store.get("currentGameState");
    request.onsuccess = function(event) {
        if (request.result) {
            const savedState = request.result;

            coins = savedState.coins;
            knightCount = savedState.knightCount;
            archerCount = savedState.archerCount;
            wizardCount = savedState.wizardCount;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;
            farmerCount = savedState.farmerCount;
            builderCount = savedState.builderCount;
            merchantCount = savedState.merchantCount;

            updateUI();
        }
    };
}

initializeDB();

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

function hireResident(type) {
    switch (type) {
        case "farmer":
            if (coins >= 5) {
                coins -= 5;
                farmerCount++;
            }
            break;
        case "builder":
            if (coins >= 10) {
                coins -= 10;
                builderCount++;
            }
            break;
        case "merchant":
            if (coins >= 15) {
                coins -= 15;
                merchantCount++;
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

    // Update UI for residents
    document.getElementById("farmer-count").textContent = farmerCount;
    document.getElementById("builder-count").textContent = builderCount;
    document.getElementById("merchant-count").textContent = merchantCount;
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
    totalPassiveIncome += farmerCount;
    totalPassiveIncome += builderCount * 2;
    totalPassiveIncome += merchantCount * 3;

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
