let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
const counter = document.getElementById("counter");
const touchNumber = document.getElementById("touch-number");

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
  startAutoSave();
  startAutoIncome('knight', knightCount);
  startAutoIncome('archer', archerCount * 2);
  startAutoIncome('wizard', wizardCount * 5);
};

request.onerror = function(event) {
  console.error("Error opening database:", event);
};

function clickCastle(event) {
  coins += 1;
  updateCounter();
  showTouchNumber(event);
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

function showTouchNumber(event) {
  touchNumber.textContent = "+1";
  touchNumber.style.opacity = "1";
  touchNumber.style.transform = "translateY(-50%)";

  if (event && event.touches) {
    touchNumber.style.left = `${event.touches[0].pageX}px`;
    touchNumber.style.top = `${event.touches[0].pageY}px`;
  }

  setTimeout(function() {
    touchNumber.style.opacity = "0";
    touchNumber.style.transform = "translateY(-60%)";
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
  };
  store.get("archerCount").onsuccess = function(event) {
    archerCount = event.target.result?.value || 0;
    document.getElementById("archer-count").textContent = archerCount;
  };
  store.get("wizardCount").onsuccess = function(event) {
    wizardCount = event.target.result?.value || 0;
    document.getElementById("wizard-count").textContent = wizardCount;
  };
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
