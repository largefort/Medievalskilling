let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladinCount = 0;
let mercenaryCount = 0;
let passiveIncome = 0;
let totalClicks = 0;
let totalCoinsEarned = 0;
let totalUpgradesPurchased = 0;
let db;
let lastSaveTime = Date.now();

const clickSound = new Audio("click-sound.mp3");

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
        paladinCount,
        mercenaryCount,
        totalClicks,
        totalCoinsEarned,
        totalUpgradesPurchased,
        lastSaveTime: Date.now(),
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
            paladinCount = savedState.paladinCount;
            mercenaryCount = savedState.mercenaryCount;
            totalClicks = savedState.totalClicks;
            totalCoinsEarned = savedState.totalCoinsEarned;
            totalUpgradesPurchased = savedState.totalUpgradesPurchased;
            lastSaveTime = savedState.lastSaveTime;

            updateUI();
        }
    };
}

initializeDB();

function toggleMusic() {
    const medievalThemeAudio = document.getElementById("medievaltheme");
    if (medievalThemeAudio.paused) {
        medievalThemeAudio.play();
    } else {
        medievalThemeAudio.pause();
    }
}

function toggleSoundEffects() {
    const clickSoundAudio = document.getElementById("click-sound");
    const upgradeSoundAudio = document.getElementById("upgradesound");
    
    clickSoundAudio.muted = !clickSoundAudio.muted;
    upgradeSoundAudio.muted = !upgradeSoundAudio.muted;
}

document.getElementById("toggle-music").addEventListener("change", toggleMusic);
document.getElementById("toggle-sfx").addEventListener("change", toggleSoundEffects);

function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${coins}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("paladin-count").textContent = paladinCount;
    document.getElementById("mercenary-count").textContent = mercenaryCount;
    updateStatsUI();
}

function updateStatsUI() {
    document.getElementById("total-clicks").textContent = `Total Castle Clicks: ${totalClicks}`;
    document.getElementById("total-coins-earned").textContent = `Total Coins Earned: ${totalCoinsEarned}`;
    document.getElementById("total-upgrades-purchased").textContent = `Total Upgrades Purchased: ${totalUpgradesPurchased}`;
}

function clickCastle() {
    coins++;
    totalClicks++;
    totalCoinsEarned++;
    saveGameData();
    updateUI();
    clickSound.play();
}

function buyUpgrade(type) {
    let cost = 0;

    switch (type) {
        case "knight":
            cost = 10;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                totalUpgradesPurchased++;
            }
            break;
        case "archer":
            cost = 25;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                totalUpgradesPurchased++;
            }
            break;
        case "wizard":
            cost = 50;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                totalUpgradesPurchased++;
            }
            break;
        case "paladin":
            cost = 100;
            if (coins >= cost) {
                coins -= cost;
                paladinCount++;
                totalUpgradesPurchased++;
            }
            break;
        case "mercenary":
            cost = 200;
            if (coins >= cost) {
                coins -= cost;
                mercenaryCount++;
                totalUpgradesPurchased++;
            }
            break;
    }

    if (cost > 0 && coins >= cost) {
        saveGameData();
        updateUI();
    }
}

function compactNumberFormat(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 and num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 and num < 1e12) return +(num / 1e9).toFixed(1) + "B";
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
    const knightIncomeRate = 1;
    const archerIncomeRate = 2;
    const wizardIncomeRate = 4;
    const paladinIncomeRate = 8;
    const mercenaryIncomeRate = 16;

    const totalPassiveIncome = (
        knightCount * knightIncomeRate +
        archerCount * archerIncomeRate +
        wizardCount * wizardIncomeRate +
        paladinCount * paladinIncomeRate +
        mercenaryCount * mercenaryIncomeRate
    );
    passiveIncome = totalPassiveIncome;
}

function earnPassiveIncome() {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastSaveTime;
    const offlinePassiveIncome = Math.floor(passiveIncome * (timeDifference / 1000));

    coins += offlinePassiveIncome;
    lastSaveTime = currentTime;

    saveGameData();
    updateUI();
}

setInterval(earnPassiveIncome, 1000);
