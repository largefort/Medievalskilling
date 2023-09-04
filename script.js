let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let db;

const counter = document.getElementById("counter");
const newsTicker = document.getElementById("news-ticker");

const newsHeadlines = [
    "The kingdom celebrates a bountiful harvest!",
    "Knights embark on a quest to vanquish the dragon.",
    "Wizards report a mysterious magical disturbance in the forest.",
    "The royal jousting tournament concludes with a stunning victory.",
    "The village blacksmith forges legendary swords for the king's army.",
    "The queen hosts a grand feast in honor of visiting nobility.",
    "A new trade route is established, bringing exotic goods to the kingdom.",
    "A group of adventurers sets out to explore the haunted forest.",
    "Villagers rejoice as the plague that plagued the land is finally vanquished.",
    "Minstrels and bards entertain the court with tales of heroism and love.",
    "The kingdom's scholars uncover lost scrolls containing ancient knowledge.",
    "A mysterious knight in black armor challenges the kingdom's champion.",
    "The royal garden blooms with vibrant colors as spring arrives.",
    "A grand procession marks the crowning of a new king.",
    "The village fair showcases contests of strength and skill.",
    "The castle's dungeons hold dark secrets of the past.",
    "A comet streaks across the night sky, heralding an auspicious event.",
    "The kingdom's craftsmen create intricate tapestries to adorn the halls.",
    "A group of thieves is captured and sentenced to the stocks in the town square.",
    "The royal falconer trains a new hunting bird for the king's sport."
];

function initializeDB() {
    const request = indexedDB.open("MedievalClickerDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('gameState')) {
            db.createObjectStore('gameState');
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadGameData();
    };

    request.onerror = function(event) {
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
        miningLevel
    };

    const transaction = db.transaction(["gameState"], "readwrite");
    const store = transaction.objectStore("gameState");
    store.put(gameState, "currentGameState");
}

function loadGameData() {
    const transaction = db.transaction(["gameState"], "readonly");
    const store = transaction.objectStore("gameState");
    const request = store.get("currentGameState");
    request.onsuccess = function(event) {
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

function generateRandomNews() {
    const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
    return newsHeadlines[randomIndex];
}

function updateNewsTicker() {
    setInterval(function() {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.textContent = "[Medieval Times News] " + generateRandomNews();
        newsTicker.appendChild(newsItem);

        if (newsTicker.childElementCount > 20) {
            newsTicker.removeChild(newsTicker.children[0]);
        }
    }, 60000);
}

updateNewsTicker();

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
