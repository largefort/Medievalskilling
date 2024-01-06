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
    counter.textContent = `Gold coins: ${coins}`;
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

function updateUI() {
    counter.textContent = `Gold coins: ${coins}`;
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

window.addEventListener("beforeunload", saveGameData);
