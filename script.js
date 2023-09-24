let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
const counter = document.getElementById("counter");
const touchNumber = document.getElementById("touch-number");

var db;
var request = indexedDB.open("MedievalClickerDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const store = db.createObjectStore("gameState", { keyPath: "id" });
  store.createIndex("value", "value", { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
  loadGame();
};

request.onerror = function (event) {
  console.error("Error opening database:", event);
};

function clickCastle(event) {
  let touchValue = 1 + knightCount + archerCount * 2 + wizardCount * 5;
  coins += touchValue;
  updateCounter();
  showTouchNumber(event, touchValue);
}

function updateCounter() {
  counter.textContent = `Gold coins: ${coins}`;
}

function showTouchNumber(event, touchValue) {
  touchNumber.textContent = `+${touchValue}`;
  touchNumber.style.opacity = "1";
  touchNumber.style.transform = "translate(-50%, -60%)";

  if (event && event.touches) {
    touchNumber.style.left = `${event.touches[0].clientX - touchNumber.clientWidth / 2}px`;
    touchNumber.style.top = `${event.touches[0].clientY - touchNumber.clientHeight}px`;
  }

  gsap.fromTo(
    touchNumber,
    {
      opacity: 1,
      y: 1,
    },
    {
      opacity: 0,
      y: -30,
      duration: 0.5,
      onComplete: function () {
        touchNumber.style.opacity = "0";
      },
    }
  );
}

function startAutoIncome(type, income) {
  setInterval(function () {
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
  store.put({ id: "lastSavedTime", value: Date.now() });
}

function loadGame() {
  const tx = db.transaction("gameState", "readonly");
  const store = tx.objectStore("gameState");

  store.get("coins").onsuccess = function (event) {
    coins = event.target.result?.value || 0;
    updateCounter();
  };

  store.get("knightCount").onsuccess = function (event) {
    knightCount = event.target.result?.value || 0;
    document.getElementById("knight-count").textContent = knightCount;
    startAutoIncome("knight", knightCount);
  };

  store.get("archerCount").onsuccess = function (event) {
    archerCount = event.target.result?.value || 0;
    document.getElementById("archer-count").textContent = archerCount;
    startAutoIncome("archer", archerCount * 2);
  };

  store.get("wizardCount").onsuccess = function (event) {
    wizardCount = event.target.result?.value || 0;
    document.getElementById("wizard-count").textContent = wizardCount;
    startAutoIncome("wizard", wizardCount * 5);
  };

  store.get("lastSavedTime").onsuccess = function (event) {
    const lastSavedTime = event.target.result?.value || Date.now();
    const timeDifference = Date.now() - lastSavedTime;
    const offlineEarnings =
      Math.floor(timeDifference / 1000) * (knightCount + archerCount * 2 + wizardCount * 5);
    coins += offlineEarnings;
    updateCounter();
  };

  startAutoSave();
}

function startAutoSave() {
  setInterval(function () {
    saveGame();
  }, 2000);
}

document.getElementById("castle").addEventListener("touchstart", (event) => {
  clickCastle(event);
  animateCastle();
  event.preventDefault();
}, false);

function animateCastle() {
  const castle = document.getElementById("castle");
  gsap.to(castle, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
  });
}

function buyUpgrade(type) {
  let cost = 0;
  switch (type) {
    case "knight":
      cost = 10 * (knightCount + 1);
      if (coins >= cost) {
        coins -= cost;
        knightCount++;
        document.getElementById("knight-count").textContent = knightCount;
        startAutoIncome("knight", 1);
      }
      break;
    case "archer":
      cost = 20 * (archerCount + 1);
      if (coins >= cost) {
        coins -= cost;
        archerCount++;
        document.getElementById("archer-count").textContent = archerCount;
        startAutoIncome("archer", 2);
      }
      break;
    case "wizard":
      cost = 50 * (wizardCount + 1);
      if (coins >= cost) {
        coins -= cost;
        wizardCount++;
        document.getElementById("wizard-count").textContent = wizardCount;
        startAutoIncome("wizard", 5);
      }
      break;
  }
  updateCounter();
      }
