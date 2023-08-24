let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let logs = 0;
let ores = 0;

const counter = document.getElementById("counter");
const logsCounter = document.getElementById("logs");
const oresCounter = document.getElementById("ores");

let db;
const request = indexedDB.open("gameDB", 2);

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
    objectStore.createIndex("logs", "logs", { unique: false });
    objectStore.createIndex("ores", "ores", { unique: false });
};

function saveGameData() {
    const gameData = {
        id: 1,
        coins: coins,
        knightCount: knightCount,
        archerCount: archerCount,
        wizardCount: wizardCount,
        woodcuttingLevel: woodcuttingLevel,
        miningLevel: miningLevel,
        logs: logs,
        ores: ores
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
            logs = request.result.logs;
            ores = request.result.ores;
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

function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            logs++;
            break;
        case "mining":
            ores++;
            break;
    }
    updateUI();
    saveGameData();
}

function updateUI() {
    counter.textContent = `Gold coins: ${formatNumber(coins)}`;
    logsCounter.textContent = `Logs: ${logs}`;
    oresCounter.textContent = `Ores: ${ores}`;
}

function formatNumber(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
    if (num >= 1e12) return +(num / 1e12).toFixed(1) + "T";
}

setInterval(() => {
    coins += knightCount; 
    coins += archerCount * 2; 
    coins += wizardCount * 5; 
    updateUI();
    saveGameData();
}, 1000);

window.addEventListener("beforeunload", saveGameData);
