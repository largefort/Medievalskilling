let goldCoins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let passiveIncomeInterval;

// Open or create an IndexedDB database for game progress
const request = indexedDB.open('medieval_clicker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('progress', { keyPath: 'id' });
};

request.onsuccess = function(event) {
    const db = event.target.result;

    // Load game progress from IndexedDB
    const transaction = db.transaction('progress', 'readonly');
    const objectStore = transaction.objectStore('progress');
    const request = objectStore.get(1);

    request.onsuccess = function(event) {
        const savedData = event.target.result;
        if (savedData) {
            goldCoins = savedData.goldCoins || 0;
            knightCount = savedData.knightCount || 0;
            archerCount = savedData.archerCount || 0;
            wizardCount = savedData.wizardCount || 0;
            woodcuttingLevel = savedData.woodcuttingLevel || 1;
            miningLevel = savedData.miningLevel || 1;
            updateDisplay();
        }
    };
};

request.onerror = function(event) {
    console.error("IndexedDB error: " + event.target.errorCode);
};

function saveGameProgress() {
    // Save game progress to IndexedDB
    const db = request.result;
    const transaction = db.transaction('progress', 'readwrite');
    const objectStore = transaction.objectStore('progress');
    const data = {
        id: 1,
        goldCoins,
        knightCount,
        archerCount,
        wizardCount,
        woodcuttingLevel,
        miningLevel
    };
    objectStore.put(data);
}

function startPassiveIncome() {
    passiveIncomeInterval = setInterval(function() {
        const passiveIncome = (knightCount * 2 + archerCount * 5 + wizardCount * 10);
        goldCoins += passiveIncome;
        updateDisplay();
    }, 5000); // Passive income every 5 seconds (adjust as needed)
}

function stopPassiveIncome() {
    clearInterval(passiveIncomeInterval);
}

function clickCastle() {
    goldCoins += 1;
    updateDisplay();
}

function handleSkillingClick(skillType) {
    if (skillType === 'woodcutting') {
        goldCoins += woodcuttingLevel;
    } else if (skillType === 'mining') {
        goldCoins += miningLevel;
    }
    updateDisplay();
}

function buyUpgrade(upgradeType) {
    let upgradeCost = 0;

    if (upgradeType === 'knight') {
        upgradeCost = 10;
        if (goldCoins >= upgradeCost) {
            goldCoins -= upgradeCost;
            knightCount += 1;
        }
    } else if (upgradeType === 'archer') {
        upgradeCost = 25;
        if (goldCoins >= upgradeCost) {
            goldCoins -= upgradeCost;
            archerCount += 1;
        }
    } else if (upgradeType === 'wizard') {
        upgradeCost = 50;
        if (goldCoins >= upgradeCost) {
            goldCoins -= upgradeCost;
            wizardCount += 1;
        }
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('counter').textContent = 'Gold coins: ' + goldCoins;
    document.getElementById('knight-count').textContent = knightCount;
    document.getElementById('archer-count').textContent = archerCount;
    document.getElementById('wizard-count').textContent = wizardCount;
    document.getElementById('woodcutting-level').textContent = woodcuttingLevel;
    document.getElementById('mining-level').textContent = miningLevel;
}

function initializeGame() {
    updateDisplay();
    startPassiveIncome();
}

// Save game progress periodically
setInterval(saveGameProgress, 1000); // Save progress every 30 seconds (adjust as needed)

$(document).ready(function () {
    initializeGame();
});
