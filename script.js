let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;

let gameStartTime = Date.now();
let castleClicks = 0;
let upgradesOwned = 0;
let goldCoinsEarned = 0;
let platform = detectPlatform();

const counter = document.getElementById("counter");

function detectPlatform() {
    const userAgent = navigator.userAgent;
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent)) return "Mobile Device";
    if (/webOS|Windows Phone/.test(userAgent)) return "Web Browser";
    return "PC";
}

function clickCastle() {
    coins++;
    castleClicks++;
    goldCoinsEarned++;
    updateUI();
}

function buyUpgrade(type) {
    switch (type) {
        case "knight":
            if (coins >= 10) {
                coins -= 10;
                knightCount++;
                upgradesOwned++;
            }
            break;
        case "archer":
            if (coins >= 25) {
                coins -= 25;
                archerCount++;
                upgradesOwned++;
            }
            break;
        case "wizard":
            if (coins >= 50) {
                coins -= 50;
                wizardCount++;
                upgradesOwned++;
            }
            break;
    }
    updateUI();
}

function compactNumberFormat(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
    return +(num / 1e12).toFixed(1) + "T";
}

function updateUI() {
    counter.textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("game-start-time").textContent = new Date(gameStartTime).toLocaleString();
    document.getElementById("castle-clicks").textContent = castleClicks;
    document.getElementById("upgrades-owned").textContent = upgradesOwned;
    document.getElementById("gold-coins-earned").textContent = goldCoinsEarned;
    document.getElementById("platform").textContent = platform;
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
    updateUI();
}

function updatePassiveIncome() {
    let totalPassiveIncome = knightCount + archerCount * 2 + wizardCount * 5;
    coins += totalPassiveIncome;
    goldCoinsEarned += totalPassiveIncome; // To update goldCoinsEarned with passive income as well.
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
