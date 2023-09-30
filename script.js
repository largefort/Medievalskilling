let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

let enhancedMedievalMode = false;

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

function toggleEnhancedMedievalMode() {
    enhancedMedievalMode = !enhancedMedievalMode;

    if (enhancedMedievalMode) {
        applyEnhancedMedievalCSS();
    } else {
        removeEnhancedMedievalCSS();
    }

    saveEnhancedMedievalMode();
}

function applyEnhancedMedievalCSS() {
    document.body.style.backgroundColor = "darkolivegreen";
}

function removeEnhancedMedievalCSS() {
    document.body.style.backgroundColor = "#8a5c2e";
}

function saveEnhancedMedievalMode() {
    localStorage.setItem("enhancedMedievalMode", enhancedMedievalMode);
}

function loadEnhancedMedievalMode() {
    const savedEnhancedMedievalMode = localStorage.getItem("enhancedMedievalMode");
    if (savedEnhancedMedievalMode === "true") {
        enhancedMedievalMode = true;
        document.getElementById("enhanced-medieval-checkbox").checked = true;
        applyEnhancedMedievalCSS();
    }
}

loadEnhancedMedievalMode();

document.getElementById("enhanced-medieval-checkbox").addEventListener("change", toggleEnhancedMedievalMode);

function updateUI() {
    if (enhancedMedievalMode) {
        document.body.style.backgroundColor = "darkolivegreen";
    } else {
        document.body.style.backgroundColor = "#8a5c2e";
    }
}

updateUI();

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
