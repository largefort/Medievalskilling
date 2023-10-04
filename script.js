let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

// Function to disable finger zooming
function disableFingerZooming() {
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });
}

// Function to disable swipe-to-refresh on mobile
function disableSwipeToRefresh() {
    let touchStartY = 0;

    document.body.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.body.addEventListener('touchmove', function (e) {
        const touchY = e.touches[0].clientY;
        const touchMoveDistance = touchY - touchStartY;

        // Check if the user is trying to refresh with a swipe
        if (touchMoveDistance > 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

disableFingerZooming();
disableSwipeToRefresh();

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
        startPassiveIncome(); // Start passive income after loading game data
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
    unlockAchievement("Peasant's First Coin");
    saveGameData();
    updateUI();
}

function buyUpgrade(type, cost) {
    switch (type) {
        case "knight":
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                unlockAchievement("Apprentice Knight");
            }
            break;
        case "archer":
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                unlockAchievement("Bowman Initiate");
            }
            break;
        case "wizard":
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                unlockAchievement("Novice Wizard");
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
            if (woodcuttingLevel >= 10) {
                unlockAchievement("Lumberjack");
            }
            break;
        case "mining":
            miningLevel++;
            if (miningLevel >= 10) {
                unlockAchievement("Rookie Miner");
            }
            break;
    }
    saveGameData();
    updateUI();
}

// Passive income function
function updatePassiveIncome() {
    let totalPassiveIncome = knightCount + archerCount * 2 + wizardCount * 5;

    coins += totalPassiveIncome;
    saveGameData();
    updateUI();
}

// Start passive income timer
function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

// Event listeners for the game buttons
document.getElementById("castle").addEventListener("click", clickCastle);
document.getElementById("knight-upgrade").addEventListener("click", () => buyUpgrade("knight", 10));
document.getElementById("archer-upgrade").addEventListener("click", () => buyUpgrade("archer", 25));
document.getElementById("wizard-upgrade").addEventListener("click", () => buyUpgrade("wizard", 50));
document.getElementById("woodcutting-button").addEventListener("click", () => handleSkillingClick("woodcutting"));
document.getElementById("mining-button").addEventListener("click", () => handleSkillingClick("mining"));
