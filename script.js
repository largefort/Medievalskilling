let coins = 0;
let deniers = 0; // Add a new variable for Deniers
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladinCount = 0;
let passiveIncome = 0;
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
        deniers, // Update the saved Deniers count
        knightCount,
        archerCount,
        wizardCount,
        woodcuttingLevel,
        miningLevel,
        paladinCount,
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
            deniers = savedState.deniers; // Update the loaded Deniers count
            knightCount = savedState.knightCount;
            archerCount = savedState.archerCount;
            wizardCount = savedState.wizardCount;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;
            paladinCount = savedState.paladinCount;

            updateUI();
        }
    };
}

initializeDB();

function updateUI() {
    document.getElementById("counter").textContent = `Deniers: ${deniers}`; // Update the displayed Deniers count
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("paladin-count").textContent = paladinCount;

    updatePassiveIncome();
}

function clickCastle() {
    deniers++;
    saveGameData();
    updateUI();
}

function buyUpgrade(type) {
    switch (type) {
        case "knight":
            if (deniers >= 10) { // Adjust the currency check to Deniers
                deniers -= 10;
                knightCount++;
                updatePassiveIncome();
            }
            break;
        case "archer":
            if (deniers >= 25) { // Adjust the currency check to Deniers
                deniers -= 25;
                archerCount++;
                updatePassiveIncome();
            }
            break;
        case "wizard":
            if (deniers >= 50) { // Adjust the currency check to Deniers
                deniers -= 50;
                wizardCount++;
                updatePassiveIncome();
            }
            break;
        case "paladin":
            if (deniers >= 100) { // Adjust the currency check to Deniers
                deniers -= 100;
                paladinCount++;
                updatePassiveIncome();
            }
            break;
    }
    saveGameData();
    updateUI();
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
    const totalPassiveIncome = (knightCount + archerCount + wizardCount + paladinCount) * 1; // Adjust the income rate as needed
    passiveIncome = totalPassiveIncome;

    setTimeout(updatePassiveIncome, 1000); // Update every second (adjust as needed)
}

function earnPassiveIncome() {
    deniers += passiveIncome; // Adjust the currency when earning passive income
    saveGameData();
    updateUI();
}

setInterval(earnPassiveIncome, 5);
