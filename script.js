let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladinCount = 0;
let passiveIncome = 0;
let db;
let lastSaveTime = Date.now(); // Initialize lastSaveTime with the current time

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
            paladinCount = savedState.paladinCount;
            lastSaveTime = savedState.lastSaveTime; // Update the last save time

            updateUI();
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
    document.getElementById("paladin-count").textContent = paladinCount;

    updatePassiveIncome();
}

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
                updatePassiveIncome(); // Update passive income when buying Knights
            }
            break;
        case "archer":
            if (coins >= 25) {
                coins -= 25;
                archerCount++;
                updatePassiveIncome(); // Update passive income when buying Archers
            }
            break;
        case "wizard":
            if (coins >= 50) {
                coins -= 50;
                wizardCount++;
                updatePassiveIncome(); // Update passive income when buying Wizards
            }
            break;
        case "paladin":
            if (coins >= 100) {
                coins -= 100;
                paladinCount++;
                updatePassiveIncome(); // Update passive income when buying Paladins
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
    // Calculate passive income based on knights, archers, wizards, and paladins
    const totalPassiveIncome = (knightCount + archerCount + wizardCount + paladinCount) * 1; // Adjust the income rate as needed
    passiveIncome = totalPassiveIncome;
}

function earnPassiveIncome() {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastSaveTime;
    const offlinePassiveIncome = Math.floor((knightCount + archerCount + wizardCount + paladinCount) * 1 * (timeDifference / 1000));

    coins += offlinePassiveIncome;
    lastSaveTime = currentTime; // Update the last save time

    saveGameData();
    updateUI();
}

setInterval(earnPassiveIncome, 1000);
