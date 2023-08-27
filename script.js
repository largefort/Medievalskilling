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

function detectPlatform() {
    const userAgent = navigator.userAgent;
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent)) return "Mobile Device";
    if (/webOS|Windows Phone/.test(userAgent)) return "Web Browser";
    if (/Windows NT|Macintosh|Linux/.test(userAgent)) return "PC";
    return "Unknown Device";
}

function clickCastle() {
    coins++;
    castleClicks++;
    goldCoinsEarned++;
    updateUI();
}

function buyUpgrade(type) {
    let cost = 0;
    switch (type) {
        case "knight":
            cost = 10;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                upgradesOwned++;
                goldCoinsEarned += cost;
            }
            break;
        case "archer":
            cost = 25;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                upgradesOwned++;
                goldCoinsEarned += cost;
            }
            break;
        case "wizard":
            cost = 50;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                upgradesOwned++;
                goldCoinsEarned += cost;
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
    document.getElementById("woodcutting-level").textContent = `Woodcutting Level: ${woodcuttingLevel}`;
    document.getElementById("mining-level").textContent = `Mining Level: ${miningLevel}`;
    document.getElementById("game-start-time").textContent = `Game Started: ${new Date(gameStartTime).toLocaleString()}`;
    document.getElementById("castle-clicks").textContent = `Castle Clicks: ${castleClicks}`;
    document.getElementById("upgrades-owned").textContent = `Upgrades Owned: ${upgradesOwned}`;
    document.getElementById("gold-coins-earned").textContent = `Gold Coins Earned: ${goldCoinsEarned}`;
    document.getElementById("platform").textContent = `Platform: ${platform}`;
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
    goldCoinsEarned += totalPassiveIncome;
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
