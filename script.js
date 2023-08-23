let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;

const counter = document.getElementById("counter");

const touchNumber = document.createElement("div");
touchNumber.setAttribute("id", "touch-number");
touchNumber.style.position = "absolute";
touchNumber.style.fontSize = "18px";
touchNumber.style.fontWeight = "bold";
touchNumber.style.color = "#FFD700";
document.body.appendChild(touchNumber);

function clickCastle() {
    let touchValue = 1 + knightCount + archerCount * 2 + wizardCount * 5;
    coins += touchValue;
    updateCounter();
    showTouchNumber(touchValue);
}

function updateCounter() {
    counter.textContent = `Gold coins: ${coins}`;
}

function showTouchNumber(touchValue) {
    touchNumber.textContent = `+${touchValue}`;
    touchNumber.style.opacity = "1";
    setTimeout(() => {
        touchNumber.style.opacity = "0";
    }, 500);
}

function handleSkillingClick(skill) {
    if (skill === 'woodcutting') {
        coins += woodcuttingLevel;
        woodcuttingLevel++;
        document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    } else if (skill === 'mining') {
        coins += miningLevel * 2;
        miningLevel++;
        document.getElementById("mining-level").textContent = miningLevel;
    }
    updateCounter();
}

function buyUpgrade(type) {
    let cost = 0;
    switch (type) {
        case 'knight':
            cost = 10 * (knightCount + 1);
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                document.getElementById("knight-count").textContent = knightCount;
            }
            break;
        case 'archer':
            cost = 20 * (archerCount + 1);
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                document.getElementById("archer-count").textContent = archerCount;
            }
            break;
        case 'wizard':
            cost = 50 * (wizardCount + 1);
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                document.getElementById("wizard-count").textContent = wizardCount;
            }
            break;
    }
    updateCounter();
}

// You can further extend this to save skilling levels, load them and implement additional game logic.
