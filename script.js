 var coins = 0;
var knightCount = 0;
var archerCount = 0;
var wizardCount = 0;
var counter = document.getElementById("counter");

var db;
var request = indexedDB.open("MedievalClickerDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("gameState", { keyPath: "id" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadGame();
};

request.onerror = function(event) {
    console.error("Error opening database:", event);
};

function clickCastle() {
    coins += 1;
    updateCounter();
}

function updateCounter() {
    counter.textContent = "Gold coins: " + formatCoins(coins);
}

function formatCoins(number) {
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "ODc", "NDc", "Vi"];
    let suffixNum = Math.floor(("" + number).length / 3);
    let shortValue = parseFloat((suffixNum !== 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(3));
    return shortValue + suffixes[suffixNum];
}

function buyUpgrade(type) {
    var cost = 0;
    switch (type) {
        case 'knight':
            cost = parseInt(document.getElementById("knight-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                document.getElementById("knight-count").textContent = knightCount;
                startAutoIncome('knight', 1);
                document.getElementById("knight-cost").textContent = Math.floor(cost * 1.2);
            }
            break;
        case 'archer':
            cost = parseInt(document.getElementById("archer-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                document.getElementById("archer-count").textContent = archerCount;
                startAutoIncome('archer', 2);
                document.getElementById("archer-cost").textContent = Math.floor(cost * 1.2);
            }
            break;
        case 'wizard':
            cost = parseInt(document.getElementById("wizard-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                document.getElementById("wizard-count").textContent = wizardCount;
                startAutoIncome('wizard', 5);
                document.getElementById("wizard-cost").textContent = Math.floor(cost * 1.2);
            }
            break;
    }
    updateCounter();
    saveGame();
}

function startAutoIncome(type, income) {
    setInterval(function() {
        coins += income;
        updateCounter();
        saveGame();
    }, 1000);
}

function saveGame() {
    var transaction = db.transaction(["gameState"], "readwrite");
    var store = transaction.objectStore("gameState");
    store.put({ id: 1, coins: coins, knightCount: knightCount, archerCount: archerCount, wizardCount: wizardCount });
}

function loadGame() {
    var transaction = db.transaction(["gameState"], "readonly");
    var store = transaction.objectStore("gameState");
    var request = store.get(1);

    request.onsuccess = function(event) {
        if (request.result) {
            coins = request.result.coins;
            knightCount = request.result.knightCount;
            archerCount = request.result.archerCount;
            wizardCount = request.result.wizardCount;
            updateCounter();
            document.getElementById("knight-count").textContent = knightCount;
            document.getElementById("archer-count").textContent = archerCount;
            document.getElementById("wizard-count").textContent = wizardCount;
        }
    };
}

function startAutoSave() {
    setInterval(function() {
        saveGame();
    }, 2000);
}
