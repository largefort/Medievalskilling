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

// Define an array of building names
const buildings = [
    "Farm",
    "Blacksmith",
    "Tavern",
    "Marketplace",
    "Stable",
    "Carpenter's Workshop",
    "Bakery",
    "Alchemist's Lab",
    "Armory",
    "Mage Tower",
    "Guardhouse",
    "Inn",
    "Chapel",
    "Library",
    "Tannery",
    "Barracks",
    "Granary",
    "Town Hall",
    "Workshop",
    "Apothecary",
    "Jousting Arena"
];

// Function to populate the "Build" tab with building names
function populateBuildTab() {
    const buildTab = document.getElementById("build-tab");

    for (let i = 0; i < buildings.length; i++) {
        const buildingName = buildings[i];
        const buildingDiv = document.createElement("div");
        buildingDiv.classList.add("upgrade");
        buildingDiv.textContent = buildingName;
        buildTab.appendChild(buildingDiv);
    }
}

populateBuildTab();

// Add event listeners for building upgrades
const buildingUpgrades = document.querySelectorAll("#build-tab .upgrade");
buildingUpgrades.forEach((upgrade, index) => {
    upgrade.addEventListener("click", () => {
        // Handle the building upgrade logic here
        if (coins >= (index + 1) * 100) {
            coins -= (index + 1) * 100;
            increaseBuildingLevel(buildings[index]);
        }
        saveGameData();
        updateUI();
    });
});

// Object to store building levels
const buildingLevels = {};

// Function to increase building level
function increaseBuildingLevel(buildingName) {
    if (!buildingLevels[buildingName]) {
        buildingLevels[buildingName] = 1;
    } else {
        buildingLevels[buildingName]++;
    }
    updateBuildingLevels();
}

// Function to update the UI with building levels
function updateBuildingLevels() {
    for (const buildingName in buildingLevels) {
        const buildingLevel = buildingLevels[buildingName];
        // Update the UI to display building levels
        document.getElementById(`${buildingName.toLowerCase()}-level`).textContent = buildingLevel;
    }
}

// Initialize the UI with building levels
updateBuildingLevels();
