let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let knightUpgradeLevel = 1;
let archerUpgradeLevel = 1;
let wizardUpgradeLevel = 1;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

// Function to disable finger zooming
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
        knightUpgradeLevel,
        archerUpgradeLevel,
        wizardUpgradeLevel,
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
            knightUpgradeLevel = savedState.knightUpgradeLevel;
            archerUpgradeLevel = savedState.archerUpgradeLevel;
            wizardUpgradeLevel = savedState.wizardUpgradeLevel;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;

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
    document.getElementById("knight-upgrade-level").textContent = knightUpgradeLevel;
    document.getElementById("archer-upgrade-level").textContent = archerUpgradeLevel;
    document.getElementById("wizard-upgrade-level").textContent = wizardUpgradeLevel;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
}

function clickCastle() {
    coins++;
    saveGameData();
    updateUI();
}

function buyUpgrade(type) {
    let upgradeCost = 0;
    let upgradeCount = 0;
    let upgradeLevel = 0;

    switch (type) {
        case "knight":
            upgradeCost = 10;
            upgradeCount = knightCount;
            upgradeLevel = knightUpgradeLevel;
            break;
        case "archer":
            upgradeCost = 25;
            upgradeCount = archerCount;
            upgradeLevel = archerUpgradeLevel;
            break;
        case "wizard":
            upgradeCost = 50;
            upgradeCount = wizardCount;
            upgradeLevel = wizardUpgradeLevel;
            break;
    }

    if (coins >= upgradeCost) {
        coins -= upgradeCost;
        upgradeCount++;
        upgradeLevel++;
        switch (type) {
            case "knight":
                knightCount = upgradeCount;
                knightUpgradeLevel = upgradeLevel;
                break;
            case "archer":
                archerCount = upgradeCount;
                archerUpgradeLevel = upgradeLevel;
                break;
            case "wizard":
                wizardCount = upgradeCount;
                wizardUpgradeLevel = upgradeLevel;
                break;
        }
        saveGameData();
        updateUI();
    }
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

// Function to calculate and update passive income
function updatePassiveIncome() {
    let totalPassiveIncome = knightCount * knightUpgradeLevel + archerCount * archerUpgradeLevel * 2 + wizardCount * wizardUpgradeLevel * 5;

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

// Function to start passive income updates at intervals (e.g., every second)
function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();

// Function to calculate and display offline progress details
function calculateOfflineProgress() {
    // Retrieve the last saved timestamp from localStorage
    const lastSavedTimestamp = localStorage.getItem('lastSavedTimestamp');

    if (lastSavedTimestamp) {
        const currentTime = new Date().getTime();
        const elapsedMilliseconds = currentTime - parseInt(lastSavedTimestamp);

        // Calculate progress based on elapsed time (adjust this calculation as needed)
        const offlineCoinsEarned = Math.floor(elapsedMilliseconds / 1000); // 1 coin per second
        const offlineWoodcuttingGains = Math.floor(elapsedMilliseconds / 20000); // 1 level every 20 seconds
        const offlineMiningGains = Math.floor(elapsedMilliseconds / 30000); // 1 level every 30 seconds

        // Display the offline progress details in the modal
        document.getElementById("offlineGoldEarned").textContent = offlineCoinsEarned;
        document.getElementById("offlineWoodcuttingLevel").textContent = offlineWoodcuttingGains;
        document.getElementById("offlineMiningLevel").textContent = offlineMiningGains;

        // Show the offline progress modal
        document.getElementById("offlineModal").style.display = "block";
    }
}

// Function to handle online/offline events
window.addEventListener('online', () => {
    // The device is now online, call the updateOfflineProgress function
    calculateOfflineProgress();
});

window.addEventListener('offline', () => {
    // The device is now offline, save the current timestamp
    const currentTime = new Date().getTime();
    localStorage.setItem('lastSavedTimestamp', currentTime);
});
