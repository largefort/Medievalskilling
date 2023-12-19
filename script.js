let coins = 0;
let knightCount = 0;
let archerCount = 0;
let wizardCount = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladinCount = 0;
let passiveIncome = 0;
let db;
let lastSaveTime = Date.now();
let antialiasingEnabled = true;
let shadowEnabled = true;
let graphicsQuality = "high"; // Default graphics quality

document.write(`
<audio id="upgradeSound">
    <source src="upgradesound.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
`);

const clickSound = new Audio("click-sound.mp3");

function disableFingerZooming() {
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });
}

disableFingerZooming();

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
        coins,
        knightCount,
        archerCount,
        wizardCount,
        woodcuttingLevel,
        miningLevel,
        paladinCount,
        lastSaveTime: Date.now(),
        antialiasingEnabled,
        shadowEnabled,
        graphicsQuality,
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
            lastSaveTime = savedState.lastSaveTime;
            antialiasingEnabled = savedState.antialiasingEnabled;
            shadowEnabled = savedState.shadowEnabled;
            graphicsQuality = savedState.graphicsQuality;

            updateGraphicsSettingsUI();
            updateUI();
        }
    };
}

initializeDB();

function toggleMusic() {
    const medievalThemeAudio = document.getElementById("medievaltheme");
    if (medievalThemeAudio.paused) {
        medievalThemeAudio.play();
    } else {
        medievalThemeAudio.pause();
    }
}

function toggleSoundEffects() {
    const clickSoundAudio = document.getElementById("click-sound");
    const upgradeSoundAudio = document.getElementById("upgradeSound");

    clickSoundAudio.muted = !clickSoundAudio.muted;
    upgradeSoundAudio.muted = !upgradeSoundAudio.muted;
}

document.getElementById("toggle-music").addEventListener("change", toggleMusic);
document.getElementById("toggle-sfx").addEventListener("change", toggleSoundEffects);

function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function updateUI() {
    document.getElementById("counter").textContent = `Gold coins: ${compactNumberFormat(coins)}`;
    document.getElementById("knight-count").textContent = knightCount;
    document.getElementById("archer-count").textContent = archerCount;
    document.getElementById("wizard-count").textContent = wizardCount;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("paladin-count").textContent = paladinCount;

    updatePassiveIncome();
}

function clickCastle() {
    coins++;
    saveGameData();
    updateUI();

    clickSound.play();
}

function buyUpgrade(type) {
    let cost = 0;
    let upgradeCount;

    switch (type) {
        case "knight":
            cost = 10;
            upgradeCount = knightCount;
            if (coins >= cost) {
                coins -= cost;
                knightCount++;
            }
            break;
        case "archer":
            cost = 25;
            upgradeCount = archerCount;
            if (coins >= cost) {
                coins -= cost;
                archerCount++;
            }
            break;
        case "wizard":
            cost = 50;
            upgradeCount = wizardCount;
            if (coins >= cost) {
                coins -= cost;
                wizardCount++;
            }
            break;
        case "paladin":
            cost = 100;
            upgradeCount = paladinCount;
            if (coins >= cost) {
                coins -= cost;
                paladinCount++;
            }
            break;
    }

    if (cost > 0) {
        const upgradeSound = document.getElementById("upgradeSound");
        upgradeSound.play();
    }

    saveGameData();
    updateUI();
}

function compactNumberFormat(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
    return +(num / 1e12).toFixed(1) + "T";
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

function updatePassiveIncome() {
    const knightIncomeRate = 1;
    const archerIncomeRate = 2;
    const wizardIncomeRate = 4;
    const paladinIncomeRate = 8;

    const totalPassiveIncome = (knightCount * knightIncomeRate + archerCount * archerIncomeRate + wizardCount * wizardIncomeRate + paladinCount * paladinIncomeRate);
    passiveIncome = totalPassiveIncome;
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

function toggleAntialiasing() {
    antialiasingEnabled = !antialiasingEnabled;
    saveGameData();
    updateGraphicsSettingsUI();
}

function toggleShadows() {
    shadowEnabled = !shadowEnabled;
    saveGameData();
    updateGraphicsSettingsUI();
}

function setGraphicsQuality(quality) {
    graphicsQuality = quality;
    saveGameData();
    updateGraphicsSettingsUI();
}

function updateGraphicsSettingsUI() {
    const antialiasingToggle = document.getElementById("antialiasing-toggle");
    const shadowsToggle = document.getElementById("shadows-toggle");
    const graphicsQualitySelect = document.getElementById("graphics-quality-select");

    antialiasingToggle.checked = antialiasingEnabled;
    shadowsToggle.checked = shadowEnabled;
    graphicsQualitySelect.value = graphicsQuality;
}

document.getElementById("antialiasing-toggle").addEventListener("change", toggleAntialiasing);
document.getElementById("shadows-toggle").addEventListener("change", toggleShadows);
document.getElementById("graphics-quality-select").addEventListener("change", function (e) {
    setGraphicsQuality(e.target.value);
});
LaggedAPI.init('lagdev_4255', 'ca-pub-4695170235902689');
//
//pause game / music before calling:
//
LaggedAPI.APIAds.show(function() {

  //
  // ad is finished, unpause game/music
  //

console.log("ad completed");

});
var boardinfo={};
boardinfo.score=SCORE_VAR;
boardinfo.board=medievalclicker_hsbdltp;

LaggedAPI.Scores.save(boardinfo, function(response) {
if(response.success) {
console.log('high score saved')
}else {
console.log(response.errormsg);
}
});
var api_awards=[];
api_awards.push(medievalclicker_rrgau001 - bought one knight in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
var api_awards=[];
api_awards.push(medievalclicker_rrgau002 - bought one archer in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
var api_awards=[];
api_awards.push(medievalclicker_rrgau003 - bought one wizard in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
var api_awards=[];
api_awards.push(medievalclicker_rrgau004 - bought one paladin in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
