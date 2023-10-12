let deniers = 0; // Deniers are a medieval currency
let florins = 0; // Florins were a gold coin used in the medieval era
let ducats = 0;  // Ducats were a popular currency in medieval Europe
let knights = 0;
let archers = 0;
let wizards = 0;
let woodcuttingLevel = 1;
let miningLevel = 1;
let paladins = 0;
let medievalKingdomIncome = 0;
let medievalKingdom;

function disableFingerZooming() {
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });
}

disableFingerZooming();

function establishMedievalKingdom() {
    const quest = indexedDB.open("MedievalKingdomDB", 1);

    quest.onupgradeneeded = function (event) {
        medievalKingdom = event.target.result;
        if (!medievalKingdom.objectStoreNames.contains('kingdomState')) {
            medievalKingdom.createObjectStore('kingdomState');
        }
    };

    quest.onsuccess = function (event) {
        medievalKingdom = event.target.result;
        retrieveKingdomData();
    };

    quest.onerror = function (event) {
        console.log("Error while establishing the Kingdom", event);
    };
}

function saveKingdomData() {
    const kingdomState = {
        deniers,
        florins,
        ducats,
        knights,
        archers,
        wizards,
        woodcuttingLevel,
        miningLevel,
        paladins,
    };

    const transaction = medievalKingdom.transaction(["kingdomState"], "readwrite");
    const store = transaction.objectStore("kingdomState");
    store.put(kingdomState, "currentKingdomState");
}

function retrieveKingdomData() {
    const transaction = medievalKingdom.transaction(["kingdomState"], "readonly");
    const store = transaction.objectStore("kingdomState");
    const quest = store.get("currentKingdomState");
    quest.onsuccess = function (event) {
        if (quest.result) {
            const savedState = quest.result;

            deniers = savedState.deniers;
            florins = savedState.florins;
            ducats = savedState.ducats;
            knights = savedState.knights;
            archers = savedState.archers;
            wizards = savedState.wizards;
            woodcuttingLevel = savedState.woodcuttingLevel;
            miningLevel = savedState.miningLevel;
            paladins = savedState.paladins;

            updateMedievalUI();
        }
    };
}

establishMedievalKingdom();

function updateMedievalUI() {
    document.getElementById("deniers-counter").textContent = `Deniers: ${medievalNumberFormat(deniers)}`;
    document.getElementById("florins-counter").textContent = `Florins: ${medievalNumberFormat(florins)}`;
    document.getElementById("ducats-counter").textContent = `Ducats: ${medievalNumberFormat(ducats)}`;
    document.getElementById("knights-count").textContent = knights;
    document.getElementById("archers-count").textContent = archers;
    document.getElementById("wizards-count").textContent = wizards;
    document.getElementById("woodcutting-level").textContent = woodcuttingLevel;
    document.getElementById("mining-level").textContent = miningLevel;
    document.getElementById("paladins-count").textContent = paladins;

    updateKingdomIncome();
}

function conquerCastle() {
    deniers++;
    saveKingdomData();
    updateMedievalUI();
}

function recruitArmy(type) {
    switch (type) {
        case "knight":
            if (deniers >= 10) {
                deniers -= 10;
                knights++;
                updateKingdomIncome(); // Update income when recruiting Knights
            }
            break;
        case "archer":
            if (deniers >= 25) {
                deniers -= 25;
                archers++;
                updateKingdomIncome(); // Update income when recruiting Archers
            }
            break;
        case "wizard":
            if (deniers >= 50) {
                deniers -= 50;
                wizards++;
                updateKingdomIncome(); // Update income when recruiting Wizards
            }
            break;
        case "paladin":
            if (deniers >= 100) {
                deniers -= 100;
                paladins++;
                updateKingdomIncome(); // Update income when recruiting Paladins
            }
            break;
    }
    saveKingdomData();
    updateMedievalUI();
}

function medievalNumberFormat(num) {
    if (num < 1e3) return num;
    if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
    if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
    if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
    return +(num / 1e12).toFixed(1) + "T";
}

function improveSkills(skill) {
    switch (skill) {
        case "woodcutting":
            woodcuttingLevel++;
            break;
        case "mining":
            miningLevel++;
            break;
    }
    saveKingdomData();
    updateMedievalUI();
}

function updateKingdomIncome() {
    const totalKingdomIncome = (knights + archers + wizards + paladins) * 1; // Adjust the income rate as needed
    medievalKingdomIncome = totalKingdomIncome;
}

function collectIncome() {
    deniers += medievalKingdomIncome;
    saveKingdomData();
    updateMedievalUI();
}

setInterval(collectIncome, 1000);
