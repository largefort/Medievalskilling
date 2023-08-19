var coins = 0;
var knightCount = 0;
var archerCount = 0;
var wizardCount = 0;
var counter = document.getElementById("counter");

function clickCastle() {
    coins += 1;
    updateCounter();
}

function updateCounter() {
    counter.textContent = "Gold coins: " + coins;
}

function buyUpgrade(type) {
    var cost = 0;
    switch (type) {
        case 'knight':
            cost = parseInt(document.getElementById("knight-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
                document.getElementById("knight-count").textContent = knightCount;
                startAutoIncome('knight', 1);
                document.getElementById("knight-cost").textContent = cost * 1.2;
            }
            break;
        case 'archer':
            cost = parseInt(document.getElementById("archer-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
                document.getElementById("archer-count").textContent = archerCount;
                startAutoIncome('archer', 2);
                document.getElementById("archer-cost").textContent = cost * 1.2;
            }
            break;
        case 'wizard':
            cost = parseInt(document.getElementById("wizard-cost").textContent);
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
                document.getElementById("wizard-count").textContent = wizardCount;
                startAutoIncome('wizard', 5);
                document.getElementById("wizard-cost").textContent = cost * 1.2;
            }
            break;
    }
    updateCounter();
}

function startAutoIncome(type, income) {
    setInterval(function() {
        coins += income;
        updateCounter();
    }, 1000);
}
