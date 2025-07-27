// --- Game Data ---
const seoul = {
    "Dobong-gu": ["Chang-dong", "Ssangmun-dong", "Banghak-dong", "Dobong-dong"],
"Dongdaemun-gu": ["Janghanpyeong-dong", "Cheongnyangni-dong", "Hoegi-dong", "Sinseol-dong", "Jeonnong-dong"],
"Dongjak-gu": ["Noryangjin-dong", "Sangdo-dong", "Heukseok-dong", "Sadang-dong", "Daebang-dong"],
"Eunpyeong-gu": ["Bulgwang-dong", "Eungam-dong", "Susaek-dong", "Galhyeon-dong", "Gupabal-dong"],
"Gangnam-gu": ["Dogok-dong", "Apgujeong-dong", "Cheongdam-dong", "Sinsa-dong", "Samseong-dong", "Nonhyeon-dong", "Yeoksam-dong"],
"Gangdong-gu": ["Cheonho-dong", "Gil-dong", "Sangil-dong", "Seongnae-dong", "Amsa-dong"],
"Gangbuk-gu": ["Mia-dong", "Beon-dong", "Suyu-dong", "Ui-dong"],
"Gangseo-gu": ["Balsan-dong", "Gayang-dong", "Deungchon-dong", "Hwagok-dong", "Magok-dong"],
"Geumcheon-gu": ["Gasan-dong", "Doksan-dong", "Siheung-dong"],
"Guro-gu": ["Guro-dong", "Garibong-dong", "Sindorim-dong", "Gaebong-dong", "Cheonwang-dong"],
"Gwanak-gu": ["Sillim-dong", "Bongcheon-dong", "Namhyeon-dong"],
"Gwangjin-gu": ["Jayang-dong", "Neung-dong", "Gwangjang-dong", "Guui-dong", "Hwayang-dong"],
"Jongno-gu": ["Jongno-1-ga", "Jongno-2-ga", "Jongno-3-ga", "Gye-dong", "Samcheong-dong", "Pyeongchang-dong", "Ihwa-dong"],
"Jung-gu": ["Myeong-dong", "Euljiro-1-ga", "Euljiro-2-ga", "Chungmuro-1-ga", "Hoehyeon-dong", "Sindang-dong"],
"Jungnang-gu": ["Myeonmok-dong", "Sangbong-dong", "Junghwa-dong", "Muk-dong", "Sinnae-dong"],
"Mapo-gu": ["Sangam-dong", "Yeonnam-dong", "Hapjeong-dong", "Seogyo-dong", "Gongdeok-dong", "Daeheung-dong"],
"Nowon-gu": ["Sanggye-dong", "Junggye-dong", "Hagye-dong", "Gongneung-dong"],
"Seocho-gu": ["Banpo-dong", "Seocho-dong", "Yangjae-dong", "Bangbae-dong", "Jamwon-dong"],
"Seongbuk-gu": ["Anam-dong", "Jeongneung-dong", "Donam-dong", "Samseon-dong", "Bomun-dong"],
"Seongdong-gu": ["Seongsu-dong", "Haengdang-dong", "Majang-dong", "Oksu-dong", "Geumho-dong"],
"Seodaemun-gu": ["Sinchon-dong", "Hongeun-dong", "Bukgajwa-dong", "Namgajwa-dong", "Yeonhui-dong"],
"Songpa-gu": ["Jamsil-dong", "Sincheon-dong", "Samjeon-dong", "Munjeong-dong", "Garak-dong", "Bangi-dong", "Ogeum-dong"],
"Yangcheon-gu": ["Mok-dong", "Sinjeong-dong", "Sinwol-dong"],
"Yeongdeungpo-gu": ["Yeouido-dong", "Dangsan-dong", "Mullae-dong", "Yeongdeungpo-dong", "Dorim-dong"],
"Yongsan-gu": ["Itaewon-dong", "Hannam-dong", "Huam-dong", "Ichon-dong", "Cheongpa-dong"]
};




function formatKoreanNumber(num) {
    const units = [
        { value: 1_0000_0000_0000, label: "조" }, // trillion (조)
        { value: 1_0000_0000, label: "억" },      // hundred million (억)
        { value: 1_0000, label: "만" },           // ten thousand (만)
    ];

    let result = "";
    for (let unit of units) {
        if (num >= unit.value) {
            const unitCount = Math.floor(num / unit.value);
            result += `${unitCount}${unit.label} `;
            num %= unit.value; // keep remaining for smaller units
        }
    }

    if (num > 0) {
        result += `${num.toLocaleString()}원`; // show remainder in 원
    }

    return result.trim();
}


const client = supabase.createClient(
  'https://ckkszepdwglhsmwhyyut.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNra3N6ZXBkd2dsaHNtd2h5eXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTgyMjUsImV4cCI6MjA2OTE5NDIyNX0.YvxK0XgK2rsGIawTv0MUUsCMYoV4LaF4MeGerkCuQAk'
);


async function submitScoreToLeaderboard(name) {
  const timeInSeconds = player.victoryTime ?? tickCount;

  const buildings = Object.values(player.properties);
  const totalFloors = buildings.reduce((sum, prop) => {
    return sum + (prop.building?.stories || 0);
  }, 0);

  const buildingCount = buildings.length;
  const avgFloors = buildingCount > 0 ? totalFloors / buildingCount : 0;

  const { error } = await client.from("Leaderboard").insert([
    {
      name,
      time: timeInSeconds,
      avgFloors: avgFloors
    }
  ]);

  if (error) {
    console.error("❌ Failed to submit score:", error);
    log("❌ Failed to submit score.");
  } else {
    log("✅ Score submitted to leaderboard!");
  }
}






const districtGrowth = {
    "Gangnam-gu": 0.15, "Seocho-gu": 0.145, "Mapo-gu": 0.14, "Yongsan-gu": 0.04,
    "Gangdong-gu":0.13, "Gangbuk-gu": 0.12
};

// Properties: dynamic shit
let properties = {};
for (const gu in seoul) {
    properties[gu] = {};
    const growth = districtGrowth[gu] || 0.02; // fallback growth rate
    const growthFactor = growth / 0.02; // 0.02 is base rate

    for (const dong of seoul[gu]) {
        // Scale base price according to growth
        let baseMin = 300_000_000 * growthFactor;
        let baseMax = 800_000_000 * growthFactor;
        let price = Math.floor(Math.random() * (baseMax - baseMin) + baseMin);

        properties[gu][dong] = {
            price,
            owner: null
        };
    }
}

let tickCount = 0;

function formatTime(ticks) {
    const hours = String(Math.floor(ticks / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((ticks % 3600) / 60)).padStart(2, '0');
    const seconds = String(ticks % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function updateClockDisplay() {
    const clockEl = document.getElementById("game-clock");
    if (clockEl) {
        clockEl.textContent = "Time: " + formatTime(tickCount);
    }
}



//player shit
let player = {
    cash: 140_078_000,
    properties: {
        "Dogok-dong": {
            district: "Gangnam-gu",
            purchasePrice: 500_000_000,
            building: null
        }
    },
    submittedScore: false,
    victoryTime: null,

    // ✅ New fields for tax event
    taxTicksLeft: 0,
    taxRate: 0
};

properties["Gangnam-gu"]["Dogok-dong"].owner = "Player";

// --- DOM shit ---
const statusEl = document.getElementById("player-status");
const logEl = document.getElementById("log");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalOptions = document.getElementById("modal-options");
const modalClose = document.getElementById("modal-close");

// --- UI Helping shit---
function log(message) {
    logEl.innerHTML += `<div>${message}</div>`;
    logEl.scrollTop = logEl.scrollHeight;
}



function updateStatus() {
    let html = `<div>Cash:<span style="color: lightgreen;"> ${formatKoreanNumber(player.cash)} KRW</span></div>`;
    html += "<div>Owned:</div>";

    if (Object.keys(player.properties).length === 0) {
        html += "<div>None</div>";
    } else {
        for (let dong in player.properties) {
            let info = player.properties[dong];
            let building = info.building;
            if (!building) continue;

            let condition = building.condition.toFixed(2);
            let color = condition > 70 ? "green" : condition > 40 ? "orange" : "red";
            let name = building.name || `${building.business} (${dong})`;
            let icon = getBusinessIcon(building.business);

            html += `
                <div style="cursor:pointer;" onclick="showBuildingDetails('${dong}')">
                    <span style="color:${color};">[${condition}%]</span> ${icon} ${name}
                </div>`;
        }
    }

    statusEl.innerHTML = html;
}


function showBuildingDetails(dong) {
    const prop = player.properties[dong];
    const building = prop.building;
    const landPrice = properties[prop.district][dong].price;

    showModal(`${building.name || "Unnamed"} – Details`, [
        `📍 ${dong} (${prop.district})`,
        `🏢 ${building.business}`,
        `🎨 ${building.exterior}`,
        `📐 ${building.stories} stories`,
        `💵 Bought at: ${formatKoreanNumber(prop.purchasePrice)} KRW`,
        `📈 Now: ${formatKoreanNumber(landPrice)} KRW`,
        `🏗️ Built at: ${formatKoreanNumber(building.constructionCost)} KRW`,
        `💰 Income: ${formatKoreanNumber(building.income)} KRW`,
        `🛠️ Renovations: ${building.renovations}`,
        "Close"
    ]);
}





function showModal(title, options, callback = null) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalOptions = document.getElementById("modal-options");

    console.log("Showing modal:", title, options);

    modalTitle.textContent = title;
    modalOptions.innerHTML = "";

    options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = typeof opt === "string" ? opt : opt.text;
        btn.onclick = () => {
            closeModal();
            if (typeof opt === "string" && callback) callback(index);
            else if (opt.onClick) opt.onClick();
        };
        modalOptions.appendChild(btn);
    });

    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}


let ticksSinceLastEvent = 0;
let nextEventIn = getNextEventDelay();

function getNextEventDelay() {
    const base = 15;
    const stdDev = 7;
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let gaussian = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    let delay = Math.round(base + stdDev * gaussian);
    return Math.min(30, Math.max(10, delay));
}


function triggerRandomEvent() {
    const weights = [4, 4, 5, 4, 3]; // Corresponds to: spike, drop, damage, tax, boost

    const eventFunc = pickWeighted(randomEvents, weights);
    if (eventFunc) {
        const message = eventFunc(); // Each event returns a string
        if (message) {
            log("📢 Event: " + message);
        }
        updateStatus();
        drawBuildings?.();
    }
}

const randomEvents = [
    priceSpikeEvent,
    priceDropEvent,
    buildingDamageEvent,
    taxDayEvent,
    incomeBoostEvent 
];



function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(arr, weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    const rand = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < arr.length; i++) {
        acc += weights[i];
        if (rand < acc) return arr[i];
    }
    return arr[arr.length - 1]; // Fallback
}




function taxDayEvent() {
    const taxRate = Math.min(0.01 + player.cash / 10_000_000_000, 0.5); // Max 20%
    player.taxPenaltyTicks = 15; //icks
    player.taxRate = taxRate;

    const msg = `💸 Tax Day! Paying ${Math.round(taxRate * 100)}% of income for 15 seconds.`;
    showEventPopup(msg);
    return msg;
}

function incomeBoostEvent() {
    const allBuildings = Object.values(player.properties)
        .map(p => p.building)
        .filter(b => b);

    if (allBuildings.length === 0) return null;

    const target = pickRandom(allBuildings);
    target.incomeBoostTicks = 15; // boost for 15 ticks

    const msg = `🚀 Income Boost! One of your buildings gets 2× income for 15 seconds!`;
    showEventPopup(msg);
    return msg;
}



function buildingDamageEvent() {
    const owned = Object.keys(player.properties).filter(d => player.properties[d].building);
    if (!owned.length) return;
    const dong = pickRandom(owned);
    const building = player.properties[dong].building;
    const damage = Math.floor(5 + Math.random() * 15);
    building.condition = Math.max(0, building.condition - damage);
    const msg = `⚠️ "${building.name}" in ${dong} was damaged! -${damage}% condition`
    showEventPopup(msg);
    flashDistrict(dong);  //the dong name
    return msg
}

function priceDropEvent() {
    const districts = Object.keys(properties);
    const dist = pickRandom(districts);
    const dongs = Object.keys(properties[dist]);
    const dong = pickRandom(dongs);
    properties[dist][dong].price = Math.floor(properties[dist][dong].price * 0.5);
    const msg = `${dong} prices dropped 📉 sharply!`;
    showEventPopup(msg);
    flashDistrict(dong);  //Use the dong name
    return msg
}

function priceSpikeEvent() {
    const districts = Object.keys(properties);
    const dist = pickRandom(districts);
    const dongs = Object.keys(properties[dist]);
    const dong = pickRandom(dongs);
    properties[dist][dong].price = Math.floor(properties[dist][dong].price * 1.5);
    const msg = `${dong} prices rose 📈 sharply!`;
    showEventPopup(msg);
    flashDistrict(dong);  // the dong name
    return msg;
}




function showEventPopup(text) {
    const popup = document.createElement("div");
    popup.textContent = text;
    popup.style.position = "fixed";
    popup.style.top = "30%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "rgba(255,255,255,0.1)";
    popup.style.color = "red";
    popup.style.padding = "20px";
    popup.style.fontSize = "25px";
    popup.style.border = "5px solid red";
    popup.style.borderRadius22px = "20px";
    popup.style.zIndex = 998;
    popup.style.opacity = "0";
    popup.style.transition = "opacity 0.5s ease";

    document.body.appendChild(popup);
    requestAnimationFrame(() => {
        popup.style.opacity = "1";
    });

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}





document.getElementById("modal-close").addEventListener("click", closeModal);


// --- Game Mechanic Shit ---
function updatePrices() {
    for (let gu in properties) {
        for (let dong in properties[gu]) {
            let change = (Math.random() * 0.1) - 0.05; // -5% to +5%
            properties[gu][dong].price = Math.max(50_000_000, Math.floor(properties[gu][dong].price * (1 + change)));
        }
    }

    // Check if player reached victory condition
    checkVictoryCondition();
}


let showIncomeLogs = true;

function toggleIncomeLog() {
  showIncomeLogs = !showIncomeLogs;
  log(`📣 Income logs are now ${showIncomeLogs ? "ON" : "OFF"}.`);
}





function generateIncome() {
    let total = 0;

    for (let dong in player.properties) {
        let prop = player.properties[dong];
        let building = prop.building;
        if (!building) continue;

        // Decay
        const decayRates = {
            "Brick": 1,
            "Windows": 0.5,
            "Steel & Glass": 0.25,
            "Titanium": 0.1
        };
        building.condition -= decayRates[building.exterior] || 1;
        if (building.condition < 0) building.condition = 0;

        // Income base on condition
        let baseIncome = building.income * (building.condition / 1000);

        // Apply tax penalty if any
        if (building.taxPenalty && building.taxPenalty > 0) {
            baseIncome *= (1 - building.taxPenalty); // e.g. 0.1 = -10%
            building.taxTicksRemaining = (building.taxTicksRemaining || 10) - 1;
            if (building.taxTicksRemaining <= 0) {
                building.taxPenalty = 0;
                building.taxTicksRemaining = 0;
            }
        }

        // Apply income boost if active
        if (building.incomeBoostTicks && building.incomeBoostTicks > 0) {
            baseIncome *= 1.5; // 50% boost
            building.incomeBoostTicks--;
        }

        let effectiveIncome = Math.floor(baseIncome);
        total += effectiveIncome;

        // Apply growth
        let growth = districtGrowth[prop.district] || 0.02;
        building.income = Math.floor(building.income * (1 + growth));

        // Show floating income
        if (building._drawPos && effectiveIncome > 0) {
            showFloatingIncome(building._drawPos.x, building._drawPos.y - building.stories * 3, effectiveIncome);
        }
    }

    player.cash += total;

    if (total > 0 && showIncomeLogs) {
        log(`💵 Earned ${formatKoreanNumber(total)} KRW from business.`);
    }

    updateStatus();
}
ticksSinceLastEvent++;
if (ticksSinceLastEvent >= nextEventIn) {
    triggerRandomEvent();                   // 🔁 Fire the random event
    ticksSinceLastEvent = 0;                // 🔁 Reset counter
    nextEventIn = getNextEventDelay();      // 🔁 Set a new randomized delay
}



function checkVictoryCondition() {
  if (player.cash >= 1_000_000_000_000_000_000_000 && !player.submittedScore) {
    if (player.victoryTime === null) {
      player.victoryTime = tickCount;
      console.log("✅ Victory time captured at", player.victoryTime);
    }
    document.getElementById('nameModal').classList.remove('hidden');
  }
}


function submitName() {
  const inputEl = document.getElementById('nameInput');
  if (!inputEl) return console.error("No input found!");

  const name = inputEl.value?.trim();
  if (!name) return alert("Please enter a name.");

  player.name = name;
  player.submittedScore = true;
  document.getElementById('nameModal').classList.add('hidden');
  log(`🎖️ Submitting score for ${name}...`);

  // 👇 Send to Supabase leaderboard
  submitScoreToLeaderboard(name);
}

window.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
});



async function loadLeaderboard() {
  const { data, error } = await client
    .from("Leaderboard")
    .select("*")
    .order("time", { ascending: true })
    .limit(200); // Top 200 entries

  const list = document.getElementById("leaderboardList");
  if (!list) return;

  list.innerHTML = ""; // Clear old list

  if (error) {
    console.error("Failed to load leaderboard:", error);
    list.innerHTML = "<li>⚠️ Failed to load leaderboard.</li>";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<li>No scores yet.</li>";
    return;
  }

  data.forEach((entry, index) => {
    const li = document.createElement("li");

    const avgFloors = entry.avgFloors?.toFixed(1) ?? "0.0";
    li.textContent = `${index + 1}. ${entry.name} - ${entry.time}s - Avg ${avgFloors} floors`;

    // 🏆 Color top 3
    if (index === 0) {
      li.style.color = "gold";
      li.style.fontWeight = "bold";
    } else if (index === 1) {
      li.style.color = "silver";
      li.style.fontWeight = "bold";
    } else if (index === 2) {
      li.style.color = "peru"; // bronze-ish
      li.style.fontWeight = "bold";
    }

    list.appendChild(li);
  });
}



setInterval(() => {
    tickCount++; //increase here once per second
    updateClockDisplay(); // updates HH:MM:SS using one

    generateIncome(); // income + decay

    ticksSinceLastEvent++;
    if (ticksSinceLastEvent >= nextEventIn) {
        triggerRandomEvent();
        ticksSinceLastEvent = 0;
        nextEventIn = getNextEventDelay();
    }
}, 1000); // 1 second = 1 tick



function flashDistrict(dong) {
    // Find the gu that contains this dong
    let gu = null;
    for (let district in properties) {
        if (dong in properties[district]) {
            gu = district;
            break;
        }
    }

    if (!gu) return;

    let el = document.querySelector(`[data-gu='${gu}']`);
    if (el) {
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 1300);
    }
}





function drawBuildings() {
    const layer = document.getElementById("building-layer");
    layer.innerHTML = ""; // Clear previous drawings

    for (const dong in player.properties) {
        const prop = player.properties[dong];
        if (!prop.building) continue;

        const gu = prop.district;
        const el = document.querySelector(`.district[data-gu='${gu}']`);
        if (!el) continue;

        const bbox = el.getBBox();

        // Store persistent random position inside the gu (middle 50%)
        if (!prop.building._drawPos) {
            prop.building._drawPos = {
                x: bbox.x + bbox.width * (0.25 + 0.5 * Math.random()),
                y: bbox.y + bbox.height * (0.25 + 0.5 * Math.random())
            };
        }

        const { x, y } = prop.building._drawPos;
        const height = prop.building.stories * 3;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 2);
        rect.setAttribute("y", y - height);
        rect.setAttribute("width", 4);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", "black");

        // ffffff
        rect.setAttribute("data-dong", dong);

        layer.appendChild(rect);
    }
}


function showFloatingIncome(x, y, amount) {
    const svg = document.querySelector("svg");
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y - 10; // Raise a bit above building
    const screenPos = pt.matrixTransform(svg.getScreenCTM());

    const el = document.createElement("div");
    el.textContent = `+${formatKoreanNumber(amount)}`;

    Object.assign(el.style, {
        position: "fixed", // fixed keeps it from affecting layout
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
        fontSize: "15px",
        fontWeight: "bold",
        color: "red",
        opacity: "1",
        transition: "all 1s ease-out",
        pointerEvents: "none",
        zIndex: "30", // ensure it appears on top
    });

    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = "translateY(-30px)";
        el.style.opacity = "0";
    });

    setTimeout(() => el.remove(), 1000);
}


// --- Action shit---
function buyProperty() {
    let districts = Object.keys(seoul);
    showModal("Choose a district", [...districts, "Cancel"], districtIndex => {
        if (districtIndex === districts.length) return;
        let gu = districts[districtIndex];
        let dongs = Object.keys(properties[gu]);
        let options = dongs.map(d => `${d} - ${formatKoreanNumber(properties[gu][d].price)} ${properties[gu][d].owner ? "(OWNED)" : ""}`);
        showModal(`Buy in ${gu}`, [...options, "Cancel"], dongIndex => {
            if (dongIndex === dongs.length) return;
            let dong = dongs[dongIndex];
            let price = properties[gu][dong].price;
            if (properties[gu][dong].owner) { log("Already owned."); return; }
            if (player.cash < price) { log("❌️Not enough cash️."); return; }
            player.cash -= price;
            player.properties[dong] = { district: gu, purchasePrice: price, building: null };
            properties[gu][dong].owner = "Player";
            log(`✅️Bought ${dong} in ${gu} for ${formatKoreanNumber(price)}.`);
            updateStatus();
            highlightOwnedDistricts();
        });
    });
}



function sellProperty() {
    let owned = Object.keys(player.properties);
    if (owned.length === 0) { log("❌️No properties to sell."); return; }
    let options = owned.map(dong => {
        let gu = player.properties[dong].district;
        let base = properties[gu][dong].price;
        let building = player.properties[dong].building;
        let buildingValue = building ? Math.floor(building.constructionCost * 1.2) : 0;
        return `${dong} (${gu}) - ${formatKoreanNumber(base + buildingValue)}`;
    });
    showModal("Sell Property", [...options, "Cancel"], index => {
        if (index === owned.length) return;
        let dong = owned[index];
        let gu = player.properties[dong].district;
        let base = properties[gu][dong].price;
        let building = player.properties[dong].building;
        let buildingValue = building ? Math.floor(building.constructionCost * 1.2) : 0;
        let salePrice = base + buildingValue;
        player.cash += salePrice;
        delete player.properties[dong];
        properties[gu][dong].owner = null;
        log(`✅️Sold ${dong} for ${formatKoreanNumber(salePrice)}.`);
        updateStatus();
        highlightOwnedDistricts();
    });
}

function showInputModal(title, placeholder, callback, type = "number") {
    const modal = document.getElementById("input-modal");
    const label = modal.querySelector("label");
    const input = modal.querySelector("input");
    const confirm = modal.querySelector("button");

    label.textContent = title;
    input.value = "";
    input.placeholder = placeholder;
    input.type = type;
    modal.style.display = "block";

    input.focus();

    function submit() {
        modal.style.display = "none";
        callback(input.value);
    }

    confirm.onclick = submit;
    input.onkeydown = e => {
        if (e.key === "Enter") submit();
    };
}


function estimateBuildingValue(building) {
    return Math.floor(building.income * 200); // multiplier
}



function viewPortfolio() {
    const panel = document.getElementById("action-panel");
    panel.innerHTML = "<h3>🏢 Your Buildings</h3>";

    const list = document.createElement("ul");

    for (const dong in player.properties) {
        const prop = player.properties[dong];
        const building = prop.building;
        if (!building) continue;

        const item = document.createElement("li");
        item.style.cursor = "pointer";
        item.style.marginBottom = "6px";

        // Just show name + condition
        item.textContent = `🏗️ ${building.name || "Unnamed"} (${building.condition.toFixed(1)}% condition)`;

        // On click, show full details
        item.onclick = () => {
            showModal(`${building.name || "Unnamed"} – Details`, [
                `📍 Location: ${dong} (${prop.district})`,
                `🏢 Type: ${building.business}`,
                `📐 Stories: ${building.stories}`,
                `🎨 Exterior: ${building.exterior}`,
                `💰 Built at: ${formatKoreanNumber(building.constructionCost)} KRW`,
                `📈 Now worth: ${formatKoreanNumber(estimateBuildingValue(building))} KRW`,
                `💵 Income: ${formatKoreanNumber(building.income)} KRW`,
                `🛠️ Renovations: ${building.renovations}`,
                "Close"
            ]);
        };

        list.appendChild(item);
    }

    panel.appendChild(list);
}





function constructBuilding() {
    let owned = Object.keys(player.properties);
    if (owned.length === 0) { log("❌ No land to build on."); return; }

    // Step 1 Choose land
    let landOptions = owned.map(dong => {
        const hasBuilding = player.properties[dong]?.building;
        return `${hasBuilding ? "🔴" : "🟢"} ${dong}`;
    });
    showModal("Choose land to build", [...landOptions, "Cancel"], index => {
        if (index === owned.length) return;
        let dong = owned[index];

        // Ensure property exists and is initialized
        if (!player.properties[dong]) {
            player.properties[dong] = { district: findDistrictForDong(dong) }; // Fallback
        }
        let prop = player.properties[dong];

        if (prop.building) {
            log("❌ Already has a building.");
            return;
        }

        // Step 2Choose number of stories
        showInputModal("Enter number of stories", "e.g. 15", stories => {
            stories = parseInt(stories);
            if (isNaN(stories) || stories < 1 || stories > 1000) {
                log("❌ Invalid number of stories. Must be 1–1000.");
                return;
            }

            // Step 3Choose exterior
            let exteriorOptions = [
                "Brick (cheapest, ages faster)",
                "Windows (expensive, ages slower)",
                "Steel & Glass (very durable)",
                "Titanium (luxury, ultra slow aging)"
            ];
            showModal("Exterior Type", [...exteriorOptions, "Cancel"], exteriorIndex => {
                if (exteriorIndex === 4) return;
                const exteriorTypes = ["Brick", "Windows", "Steel & Glass", "Titanium"];
                let exterior = exteriorTypes[exteriorIndex];

                // Step 4Choose business type
                let businessOptions = [
                    "Hotel (high cost, high income)",
                    "Office (balanced)",
                    "Factory (low cost, low income)",
                    "Shopping Mall (big retail, high income)",
                    "Residential (apartments, steady income)",
                    "Luxury Tower (very high cost & income)"
                ];
                showModal("Business Type", [...businessOptions, "Cancel"], bizIndex => {
                    if (bizIndex === 6) return;
                    const businessTypes = ["Hotel", "Office", "Factory", "Shopping Mall", "Residential", "Luxury Tower"];
                    let business = businessTypes[bizIndex];

                    // Step 5 Ask for building name
                    showInputModal("Enter building name", "e.g. Sky Tower", name => {
                        if (typeof name !== "string" || name.trim().length === 0) {
                            log("❌ Invalid name.");
                            return;
                        }
                        name = name.trim();

                        // Step6: Calculate cost
                        const exteriorMultipliers = { "Brick": 1.0, "Windows": 1.5, "Steel & Glass": 2.0, "Titanium": 2.5 };
                        const businessMultipliers = { "Factory": 1.2, "Office": 1.5, "Hotel": 2.0, "Shopping Mall": 2.2, "Residential": 1.6, "Luxury Tower": 3.0 };

                        let baseCost = 1_000_000_000;
                        let storyMultiplier = Math.pow(1.15, stories);
                        let exteriorMultiplier = exteriorMultipliers[exterior];
                        let bizMultiplier = businessMultipliers[business];
                        let totalCost = Math.floor(baseCost * storyMultiplier * exteriorMultiplier * bizMultiplier);

                        if (player.cash < totalCost) {
                            log(`❌ Not enough cash. Cost: ${formatKoreanNumber(totalCost)} KRW`);
                            return;
                        }

                        // Step 7 Build
                        player.cash -= totalCost;
                        let income = Math.floor(totalCost * 0.005 * bizMultiplier);
                        prop.building = {
                            name,
                            stories,
                            exterior,
                            business,
                            constructionCost: totalCost,
                            condition: 100,
                            renovations: 0,
                            income
                        };

                        // Increase land price
                        let land = properties[prop.district]?.[dong];
                        if (land) {
                            let increaseFactor = 0.1 + stories * 0.01 +
                                (exterior === "Windows" ? 0.05 : (exterior === "Steel & Glass" ? 0.08 : (exterior === "Titanium" ? 0.12 : 0))) +
                                (bizMultiplier - 1.0) * 0.05;
                            land.price += Math.floor(totalCost * increaseFactor);
                        }

                        log(`🏗 Built "${name}" – a ${stories}-story ${business} with ${exterior} exterior in ${dong}. Cost: ${formatKoreanNumber(totalCost)} KRW. Income: ${formatKoreanNumber(income)} KRW`);
                        updateStatus();
                        drawBuildings();
                    }, "text"); //  Allow text input for name
                });
            });
        });
    });
}

// Utility fallback to find district if missing
function findDistrictForDong(dong) {
    for (let gu in properties) {
        if (dong in properties[gu]) return gu;
    }
    return "Unknown-gu";
}



function renovateBuilding() {
    let renovatable = Object.keys(player.properties).filter(d => player.properties[d].building);
    if (renovatable.length === 0) {
        log("No buildings to renovate.");
        return;
    }

    // show building name (with dong in parentheses)
    let labels = renovatable.map(d => {
        const b = player.properties[d].building;
        return `${b.name} (${d})`;
    });

    showModal("Renovate Building", [...labels, "Cancel"], index => {
        if (index === renovatable.length) return;

        let dong = renovatable[index];
        let building = player.properties[dong].building;
        let cost = Math.floor(building.constructionCost * 0.2 * Math.pow(1.2, building.renovations));

        if (player.cash < cost) {
            log("❌️Not enough cash.");
            return;
        }

        player.cash -= cost;
        building.condition = Math.min(100, building.condition + 20);
        building.renovations += 1;
        building.income = Math.floor(building.income * 1.15);
        building.constructionCost += Math.floor(cost * 0.5);

        log(`✅️Renovated ${building.name} in ${dong}. Condition: ${building.condition}%. Income boosted.`);
        updateStatus();
    });
}


function openDistrictModal(gu) {
    const dongs = Object.keys(properties[gu]);
    showModal(
        `Properties in ${gu}`,
        dongs.map(d => ({
            text: `${d}: ${formatKoreanNumber(properties[gu][d].price)} ${properties[gu][d].owner === "Player" ? "(OWNED)" : ""}`,
            onClick: () => buyPropertyFromMap(gu, d)
        }))
    );
}


function buyPropertyFromMap(gu, dong) {
    const price = properties[gu][dong].price;
    if (properties[gu][dong].owner === "Player") {
        log(`❌️ ${dong} is already owned by you.`);
        return;
    }
    if (player.cash < price) {
        log("❌️Not enough cash!");
        return;
    }
    player.cash -= price;
    properties[gu][dong].owner = "Player";
    player.properties[dong] = { district: gu, purchase_price: price, buildings: null };
    log(`✅️Bought ${dong} in ${gu} for ${price.toLocaleString()} KRW.`);
    updatePlayerStatus();
    highlightOwnedDistricts();
    closeModal();
}


function highlightOwnedDistricts() {
    document.querySelectorAll(".district").forEach(path => {
        const gu = path.dataset.gu;
        const owned = Object.values(player.properties).some(p => p.district === gu);
        path.classList.toggle("owned", owned);
    });
}




document.querySelectorAll(".district").forEach(path => {
    path.addEventListener("click", () => {
        const gu = path.dataset.gu;
        openDistrictModal(gu);
    });
});


// --- Event Listener Shit ---
document.getElementById("buy-property").addEventListener("click", buyProperty);
document.getElementById("sell-property").addEventListener("click", sellProperty);
document.getElementById("construct-building").addEventListener("click", constructBuilding);
document.getElementById("renovate-building").addEventListener("click", renovateBuilding);

// --- Game Loop Shit---
function nextTurn() {
    updatePrices();
    updateStatus();
}
setInterval(nextTurn, 1000); // every 5 seconds

// --- Mini-map interact ---

function initMap() {
  document.querySelectorAll("#seoul-map .district").forEach(el => {
    el.addEventListener("click", () => {
      let gu = el.dataset.gu;
      log(`Selected district: ${gu}`);
      showModal(`Dongs in ${gu}`, [
        ...seoul[gu].map(dong => {
          let price = formatKoreanNumber(properties[gu][dong].price);
          let owned = properties[gu][dong].owner === "Player" ? " (OWNED)" : "";
          return `${dong}: ${price}${owned}`;
        }),
        "Cancel"
      ], idx => {
        if (idx === seoul[gu].length) return;
        let dong = seoul[gu][idx];
        buyPropertyFromMap(gu, dong);
      });
    });
  });
}


function buyPropertyFromMap(gu, dong) {
  let prop = properties[gu][dong];
  if (prop.owner === "Player") {
    log("Already own it."); return;
  }
  if (player.cash < prop.price) {
    log("❌️Not enough cash"); return;
  }
  player.cash -= prop.price;
  prop.owner = "Player";
  player.properties[dong] = { district: gu, purchasePrice: prop.price, building: null };
  log(`✅️Bought ${dong} in ${gu} for ${formatKoreanNumber(prop.price)}`);
  updateStatus();
  highlightOwnedDistricts();
  updateMap();
}



function getBusinessIcon(type) {
    const icons = {
        "Hotel": "🏨",
        "Office": "🏢",
        "Factory": "🏭",
        "Shopping Mall": "🏬",
        "Residential": "🏘️",
        "Luxury Tower": "🏯"
    };
    return icons[type] || "🏢";
}




function updateMap() {
  document.querySelectorAll("#seoul-map .district").forEach(el => {
    let gu = el.dataset.gu;
    let owned = Object.values(player.properties).some(p => p.district === gu);
    el.classList.toggle("owned", owned);
  });
}


function showBuildingDetails(dong) {
    const prop = player.properties[dong];
    if (!prop || !prop.building) {
        log("❌ No building found for this land.");
        return;
    }

    const building = prop.building;
    const landPrice = properties[prop.district][dong].price;

    showModal(`${building.name || "Unnamed"} – Details`, [
        `📍 ${dong} (${prop.district})`,
        `🏢 ${building.business}`,
        `🎨 ${building.exterior}`,
        `📐 ${building.stories} stories`,
        `💵 Bought at: ${formatKoreanNumber(prop.purchasePrice)} KRW`,
        `📈 Now: ${formatKoreanNumber(landPrice)} KRW`,
        `🏗️ Built at: ${formatKoreanNumber(building.constructionCost)} KRW`,
        `💰 Income: ${formatKoreanNumber(building.income)} KRW`,
        `🛠️ Renovations: ${building.renovations}`,
        "Close"
    ]);
}


// Init
initMap();
player.victoryTime = null;

for (let dong in player.properties) {
    let building = player.properties[dong].building;
    if (building && building.incomeBoostTicks === undefined) {
        building.incomeBoostTicks = 0;
    }
}

updateMap();
updateStatus();
highlightOwnedDistricts();
log("Welcome to Digital Seoul 3! version 7.2 by KJH :) ");
