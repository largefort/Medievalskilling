let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;

const counter = document.getElementById("counter");
const touchNumber = document.createElement("div");
touchNumber.setAttribute("id", "touch-number");
touchNumber.style.position = "absolute";
touchNumber.style.fontSize = "18px";
touchNumber.style.fontWeight = "bold";
touchNumber.style.color = "#FFD700";
document.body.appendChild(touchNumber);

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
        console.error("Error fetching game data:", event);
    };
    request.onsuccess = function(event) {
        if (request.result) {
            coins = request.result.coins;
            knightCount = request.result.knightCount;
            archerCount = request.result.archerCount;
            wizardCount = request.result.wizardCount;
            woodcuttingLevel = request.result.woodcuttingLevel;
            miningLevel = request.result.miningLevel;
            updateCounter();
        }
    };
}

function clickCastle(event) {
    let touchValue = 1 + knightCount + archerCount * 2 + wizardCount * 5;
    coins += touchValue;
    updateCounter();
    showTouchNumber(touchValue, event);
    saveGameData();
}

function updateCounter() {
    counter.textContent = `Gold coins: ${coins}`;
}

function showTouchNumber(touchValue, event) {
    touchNumber.textContent = `+${touchValue}`;
    touchNumber.style.opacity = "1";
    touchNumber.style.left = `${event.pageX}px`;
    touchNumber.style.top = `${event.pageY}px`;

    setTimeout(() => {
        touchNumber.style.opacity = "0";
    }, 500);
}

function handleSkillingClick(skill) {
    if (skill === 'woodcutting') {
        coins += woodcuttingLevel;
        woodcuttingLevel++;
        document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    } else if (skill === 'mining') {
        coins += miningLevel * 2;
        miningLevel++;
        document.getElementById("mining-level").textContent = miningLevel;
    }
    updateCounter();
    saveGameData();
}

function buyUpgrade(type) {
    let cost = 0;
    switch (type) {
        case 'knight':
            cost = 10 * (knightCount + 1);
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                document.getElementById("knight-count").textContent = knightCount;
            }
            break;
        case 'archer':
            cost = 20 * (archerCount + 1);
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                document.getElementById("archer-count").textContent = archerCount;
            }
            break;
        case 'wizard':
            cost = 50 * (wizardCount + 1);
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                document.getElementById("wizard-count").textContent = wizardCount;
            }
            break;
    }
    updateCounter();
    saveGameData();
}
