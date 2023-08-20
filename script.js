let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
const counter = document.getElementById("counter");
const touchNumber = document.createElement("div");
touchNumber.setAttribute("id", "touch-number");
touchNumber.style.position = "absolute";
touchNumber.style.fontSize = "18px";
touchNumber.style.fontWeight = "bold";
touchNumber.style.color = "#FFD700";
document.body.appendChild(touchNumber);

var db;
var request = indexedDB.open("MedievalClickerDB", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const store = db.createObjectStore("gameState", { keyPath: "id" });
  store.createIndex("value", "value", { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  loadGame();
};

request.onerror = function(event) {
  console.error("Error opening database:", event);
};

function clickCastle(event) {
  let coinsToAdd = 1 + (knightCount * 1) + (archerCount * 2) + (wizardCount * 5);
  coins += coinsToAdd;
  updateCounter();
  showTouchNumber(event, coinsToAdd);
}

function updateCounter() {
  counter.textContent = `Gold coins: ${formatNumber(coins)}`;
}

function formatNumber(num) {
  if (num < 1e3) return num;
  if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
  if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
  if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
  if (num >= 1e12) return +(num / 1e12).toFixed(1) + "T";
}

function showTouchNumber(event, coinsToAdd) {
  touchNumber.textContent = `+${coinsToAdd}`;
  touchNumber.style.opacity = "1";
  touchNumber.style.transform = "translateY(0%)";

  if (event && event.touches) {
    touchNumber.style.left = `${event.touches[0].clientX - touchNumber.clientWidth / 2}px`;
    touchNumber.style.top = `${event.touches[0].clientY - touchNumber.clientHeight}px`;
  }

  setTimeout(function() {
    touchNumber.style.opacity = "0";
    touchNumber.style.transform = "translateY(-10%)";
  }, 500);
}

function startAutoIncome(type, income) {
  setInterval(function() {
    coins += income;
    updateCounter();
  }, 1000);
}

function saveGame() {
  const tx = db.transaction("gameState", "readwrite");
  const store = tx.objectStore("gameState");
  store.put({ id: "coins", value: coins });
  store.put({ id: "knightCount", value: knightCount });
  store.put({ id: "archerCount", value: archerCount });
  store.put({ id: "wizardCount", value: wizardCount });
}

function loadGame() {
  const tx = db.transaction("gameState", "readonly");
  const store = tx.objectStore("gameState");
  store.get("coins").onsuccess = function(event) {
    coins = event.target.result?.value || 0;
    updateCounter();
  };
  store.get("knightCount").onsuccess = function(event) {
    knightCount = event.target.result?.value || 0;
    document.getElementById("knight-count").textContent = knightCount;
    startAutoIncome('knight', knightCount);
  };
  store.get("archerCount").onsuccess = function(event) {
    archerCount = event.target.result?.value || 0;
    document.getElementById("archer-count").textContent = archerCount;
    startAutoIncome('archer', archerCount * 2);
  };
  store.get("wizardCount").onsuccess = function(event) {
    wizardCount = event.target.result?.value || 0;
    document.getElementById("wizard-count").textContent = wizardCount;
    startAutoIncome('wizard', wizardCount * 5);
  };
  startAutoSave();
}

function startAutoSave() {
  setInterval(function() {
    saveGame();
  }, 2000);
}

document.getElementById("castle").addEventListener("touchstart", (event) => {
  clickCastle(event);
  event.preventDefault();
}, false);

function buyUpgrade(type) {
  let cost = 0;
  switch (type) {
    case 'knight':
      cost = Math.floor(10 * Math.pow(1.1, knightCount));
      if (coins >= cost) {
        coins -= cost;
        knightCount++;
        document.getElementById("knight-count").textContent = knightCount;
        startAutoIncome('knight', 1);
      }
      break;
    case 'archer':
      cost = Math.floor(20 * Math.pow(1.1, archerCount));
      if (coins >= cost) {
        coins -= cost;
        archerCount++;
        document.getElementById("archer-count").textContent = archerCount;
        startAutoIncome('archer', 2);
      }
      break;
    case 'wizard':
      cost = Math.floor(50 * Math.pow(1.1, wizardCount));
      if (coins >= cost) {
        coins -= cost;
        wizardCount++;
        document.getElementById("wizard-count").textContent = wizardCount;
        startAutoIncome('wizard', 5);
      }
      break;
  }
  updateCounter();
}
