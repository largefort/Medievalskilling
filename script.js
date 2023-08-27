let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let farmerCount = 0;
let builderCount = 0;
let merchantCount = 0;

const counter = document.getElementById("counter");

function clickCastle() {
    coins++;
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
    updateUI();
}

function hireResident(type) {
    switch (type) {
        case "farmer":
            if (coins >= 5) {
                coins -= 5;
                farmerCount++;
            }
            break;
        case "builder":
            if (coins >= 10) {
                coins -= 10;
                builderCount++;
            }
            break;
        case "merchant":
            if (coins >= 15) {
                coins -= 15;
                merchantCount++;
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

    // Update UI for residents
    document.getElementById("farmer-count").textContent = farmerCount;
    document.getElementById("builder-count").textContent = builderCount;
    document.getElementById("merchant-count").textContent = merchantCount;
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
    totalPassiveIncome += farmerCount;
    totalPassiveIncome += builderCount * 2;
    totalPassiveIncome += merchantCount * 3;

    coins += totalPassiveIncome;
    updateUI();
}

function startPassiveIncome() {
    setInterval(updatePassiveIncome, 1000);
}

startPassiveIncome();
