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
let highestCoinsHeld = 0;
let totalKnightsRecruited = 0;
let totalArchersRecruited = 0;
let totalWizardsRecruited = 0;
let totalPaladinsRecruited = 0;
let totalMercenariesRecruited = 0;
let totalResourcesGathered = 0;
let totalSkillsUpgraded = 0;
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
        coins, knightCount, archerCount, wizardCount, woodcuttingLevel, miningLevel,
        paladinCount, mercenaryCount, passiveIncome, totalClicks, totalCoinsEarned,
        totalUpgradesPurchased, highestCoinsHeld, totalKnightsRecruited, totalArchersRecruited,
        totalWizardsRecruited, totalPaladinsRecruited, totalMercenariesRecruited,
        totalResourcesGathered, totalSkillsUpgraded, lastSaveTime: Date.now()
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
            highestCoinsHeld = savedState.highestCoinsHeld;
            totalKnightsRecruited = savedState.totalKnightsRecruited;
            totalArchersRecruited = savedState.totalArchersRecruited;
            totalWizardsRecruited = savedState.totalWizardsRecruited;
            totalPaladinsRecruited = savedState.totalPaladinsRecruited;
            totalMercenariesRecruited = savedState.totalMercenariesRecruited;
            totalResourcesGathered = savedState.totalResourcesGathered;
            totalSkillsUpgraded = savedState.totalSkillsUpgraded;
            lastSaveTime = savedState.lastSaveTime;
            updateUI();
            updatePassiveIncome();
        }
    };
}

initializeDB();

function toggleMusic() {
    const medievalThemeAudio = document.getElementById("medievaltheme");
    medievalThemeAudio.paused ? medievalThemeAudio.play() : medievalThemeAudio.pause();
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
    document.getElementById("highest-coins-held").textContent = `Highest Gold Coins Held: ${highestCoinsHeld}`;
    document.getElementById("total-knights-recruited").textContent = `Total Knights Recruited: ${totalKnightsRecruited}`;
    document.getElementById("total-archers-recruited").textContent = `Total Archers Recruited: ${totalArchersRecruited}`;
    document.getElementById("total-wizards-recruited").textContent = `Total Wizards Recruited: ${totalWizardsRecruited}`;
    document.getElementById("total-paladins-recruited").textContent = `Total Paladins Recruited: ${totalPaladinsRecruited}`;
    document.getElementById("total-mercenaries-recruited").textContent = `Total Mercenaries Recruited: ${totalMercenariesRecruited}`;
    document.getElementById("total-resources-gathered").textContent = `Total Resources Gathered: ${totalResourcesGathered}`;
    document.getElementById("total-skills-upgraded").textContent = `Total Skills Upgraded: ${totalSkillsUpgraded}`;
}

function clickCastle() {
    coins++;
    totalClicks++;
    totalCoinsEarned++;
    if (coins > highestCoinsHeld) {
        highestCoinsHeld = coins;
    }
    saveGameData();
    updateUI();
    clickSound.play();
}

function buyUpgrade(type) {
    let cost = 0;
    let purchased = false;
    switch (type) {
        case "knight":
            cost = 10;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                totalKnightsRecruited++;
                purchased = true;
            }
            break;
        case "archer":
            cost = 25;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                totalArchersRecruited++;
                purchased = true;
            }
            break;
        case "wizard":
            cost = 50;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                totalWizardsRecruited++;
                purchased = true;
            }
            break;
        case "paladin":
            cost = 100;
            if (coins >= cost) {
                coins -= cost;
                paladinCount++;
                totalPaladinsRecruited++;
                purchased = true;
            }
            break;
        case "mercenary":
            cost = 200;
            if (coins >= cost) {
                coins -= cost;
                mercenaryCount++;
                totalMercenariesRecruited++;
                purchased = true;
            }
            break;
    }
    if (purchased) {
        totalUpgradesPurchased++;
        updatePassiveIncome();
        saveGameData();
        updateUI();
    }
}

function handleSkillingClick(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            totalSkillsUpgraded++;
            totalResourcesGathered += woodcuttingLevel;
            break;
        case "mining":
            miningLevel++;
            totalSkillsUpgraded++;
            totalResourcesGathered += miningLevel;
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

    passiveIncome = (
        knightCount * knightIncomeRate +
        archerCount * archerIncomeRate +
        wizardCount * wizardIncomeRate +
        paladinCount * paladinIncomeRate +
        mercenaryCount * mercenaryIncomeRate
    );
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
