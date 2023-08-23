let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;

const counter = document.getElementById("counter");

let db;
const request = indexedDB.open("gameDB", 1);

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadGameData();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("gameData", { keyPath: "id" });
    objectStore.createIndex("coins", "coins", { unique: false });
    objectStore.createIndex("knightCount", "knightCount", { unique: false });
    objectStore.createIndex("archerCount", "archerCount", { unique: false });
    objectStore.createIndex("wizardCount", "wizardCount", { unique: false });
    objectStore.createIndex("woodcuttingLevel", "woodcuttingLevel", { unique: false });
    objectStore.createIndex("miningLevel", "miningLevel", { unique: false });
};

function saveGameData() {
    const gameData = {
        id: 1,
        coins: coins,
        knightCount: knightCount,
        archerCount: archerCount,
        wizardCount: wizardCount,
        woodcuttingLevel: woodcuttingLevel,
        miningLevel: miningLevel
    };
    const transaction = db.transaction(["gameData"], "readwrite");
    const objectStore = transaction.objectStore("gameData");
    const request = objectStore.put(gameData);
    request.onerror = function(event) {
        console.error("Error saving game data:", event);
    };
}

function loadGameData() {
    const transaction = db.transaction(["gameData"]);
    const objectStore = transaction.objectStore("gameData");
    const request = objectStore.get(1);
    request.onerror = function(event) {
        console.error("Error loading game data:", event);
    };
    request.onsuccess = function(event) {
        if (request.result) {
            coins = request.result.coins;
            knightCount = request.result.knightCount;
            archerCount = request.result.archerCount;
            wizardCount = request.result.wizardCount;
            woodcuttingLevel = request.result.woodcuttingLevel;
            miningLevel = request.result.miningLevel;
            updateUI();
        }
    };
}

function clickCastle() {
    coins++;
    updateUI();
    saveGameData();
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
    updateUI();
    saveGameData();
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
    updateUI();
    saveGameData();
}

function updatePassiveIncome() {
    let totalPassiveIncome = knightCount * 1 + archerCount * 2 + wizardCount * 5;
    coins += totalPassiveIncome;
    updateUI();
    saveGameData();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 5000);
}

startPassiveIncome();
window.addEventListener("beforeunload", saveGameData);
