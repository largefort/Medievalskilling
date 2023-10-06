let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

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

function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
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

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();

function calculateOfflineProgress() {
    const lastSavedTimestamp = localStorage.getItem('lastSavedTimestamp');

    if (lastSavedTimestamp) {
        const currentTime = new Date().getTime();
        const elapsedMilliseconds = currentTime - parseInt(lastSavedTimestamp);

        const offlineCoinsEarned = Math.floor(elapsedMilliseconds / 1000);
        const offlineWoodcuttingGains = Math.floor(elapsedMilliseconds / 20000);
        const offlineMiningGains = Math.floor(elapsedMilliseconds / 30000);

        document.getElementById("offlineGoldEarned").textContent = offlineCoinsEarned;
        document.getElementById("offlineWoodcuttingLevel").textContent = offlineWoodcuttingGains;
        document.getElementById("offlineMiningLevel").textContent = offlineMiningGains;

        document.getElementById("offlineModal").style.display = "block";
    }
}

window.addEventListener('online', () => {
    calculateOfflineProgress();
});

window.addEventListener('offline', () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('lastSavedTimestamp', currentTime);
});

// Function to detect Android device specs and show compatibility notification
function detectAndroidDeviceSpecs() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("android")) {
        const isLowEndDevice = /* Add your criteria to determine low-end devices */;

        if (isLowEndDevice) {
            // Display the compatibility notification modal
            document.getElementById("compatibilityModal").style.display = "block";
        }
    }
}

// Call the detectAndroidDeviceSpecs function when the page loads
window.onload = function () {
    detectAndroidDeviceSpecs();
};

// Function to close the compatibility notification modal
function closeCompatibilityNotification() {
    document.getElementById("compatibilityModal").style.display = "none";
}
