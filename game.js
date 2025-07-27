// --- Seoul data ---
const seoul = {
    "Gangnam-gu": ["Dogok-dong", "Apgujeong-dong", "Cheongdam-dong"],
    "Gangdong-gu": ["Cheonho-dong", "Gil-dong", "Sangil-dong"],
    "Gangbuk-gu": ["Mia-dong", "Beon-dong", "Suyu-dong"],
    "Gangseo-gu": ["Banghwa-dong", "Deungchon-dong", "Hwagok-dong"],
    "Gwanak-gu": ["Bongcheon-dong", "Nakseongdae-dong", "Sillim-dong"],
    "Gwangjin-gu": ["Guui-dong", "Jayang-dong", "Neung-dong"],
    "Guro-gu": ["Gocheok-dong", "Sindorim-dong", "Onsu-dong"],
    "Geumcheon-gu": ["Doksan-dong", "Siheung-dong", "Gasan-dong"],
    "Nowon-gu": ["Junggye-dong", "Sanggye-dong", "Wolgye-dong"],
    "Dobong-gu": ["Banghak-dong", "Chang-dong", "Dobong-dong"],
    "Dongdaemun-gu": ["Hoegi-dong", "Jeonnong-dong", "Imun-dong"],
    "Dongjak-gu": ["Heukseok-dong", "Sadang-dong", "Daebang-dong"],
    "Mapo-gu": ["Sangam-dong", "Yeonnam-dong", "Hapjeong-dong"],
    "Seodaemun-gu": ["Hongje-dong", "Yeonhui-dong", "Sinchon-dong"],
    "Seocho-gu": ["Banpo-dong", "Seocho-dong", "Yangjae-dong"],
    "Seongdong-gu": ["Geumho-dong", "Oksu-dong", "Seongsu-dong"],
    "Seongbuk-gu": ["Jeongneung-dong", "Donam-dong", "Bomun-dong"],
    "Songpa-gu": ["Jamsil-dong", "Munjeong-dong", "Bangi-dong"],
    "Yangcheon-gu": ["Mok-dong", "Sinjeong-dong", "Sinwol-dong"],
    "Yeongdeungpo-gu": ["Yeouido-dong", "Dangsan-dong", "Mullae-dong"],
    "Yongsan-gu": ["Itaewon-dong", "Hannam-dong", "Huam-dong"],
    "Eunpyeong-gu": ["Eungam-dong", "Bulam-dong", "Galhyeon-dong"],
    "Jongno-gu": ["Gahoe-dong", "Sajik-dong", "Gyonam-dong"],
    "Jung-gu": ["Sogong-dong", "Myeong-dong", "Sindang-dong"],
    "Jungnang-gu": ["Junghwa-dong", "Sinnae-dong", "Mangu-dong"]
};




// Growth per district
const districtGrowth = {
    "Gangnam-gu": 0.05, "Seocho-gu": 0.045, "Songpa-gu": 0.045,
    "Mapo-gu": 0.04, "Yongsan-gu": 0.04, "Jongno-gu": 0.04,
    "Yeongdeungpo-gu": 0.035, "Seodaemun-gu": 0.035, "Dongjak-gu": 0.035,
    "Nowon-gu": 0.03, "Gangdong-gu": 0.03, "Gwangjin-gu": 0.03,
    "Yangcheon-gu": 0.03, "Eunpyeong-gu": 0.03, "Seongdong-gu": 0.03,
    "Seongbuk-gu": 0.03, "Gangseo-gu": 0.025, "Guro-gu": 0.025,
    "Geumcheon-gu": 0.025, "Dobong-gu": 0.025, "Jungnang-gu": 0.025,
    "Gangbuk-gu": 0.02, "Gwanak-gu": 0.02, "Dongdaemun-gu": 0.02,
    "Jung-gu": 0.02
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





// --- Properties ---
let properties = {};
for (const gu in seoul) {
    properties[gu] = {};
    for (const dong of seoul[gu]) {
        properties[gu][dong] = {
            price: Math.floor(Math.random() * (800_000_000 - 400_000_000) + 400_000_000),
            owner: null
        };
    }
}

// --- Player ---
let player = {
    cash: 1_000_000_000_000,
    properties: {
        "Dogok-dong": { district: "Gangnam-gu", purchase_price: 500_000_000, buildings: null }
    }
};
properties["Gangnam-gu"]["Dogok-dong"].owner = "Player";

// --- Price Update ---
function updatePrices() {
    for (const gu in properties) {
        for (const dong in properties[gu]) {
            let change = (Math.random() * 0.1 - 0.05); // -5% to +5%
            properties[gu][dong].price = Math.max(50_000_000, Math.floor(properties[gu][dong].price * (1 + change)));
        }
    }
}

// --- Income Generation ---
function generateIncome() {
    let totalIncome = 0;
    for (const dong in player.properties) {
        const building = player.properties[dong].buildings;
        if (building) {
            let incomeRate = { "Hotel": 10_000_000, "Office": 7_000_000, "Factory": 5_000_000 };
            let growth = districtGrowth[player.properties[dong].district] || 0.02;
            building.income = Math.floor(building.income * (1 + growth / 12)); // Monthly growth
            totalIncome += building.stories * incomeRate[building.business] + building.income;
        }
    }
    player.cash += totalIncome;
    logMessage(`💵 Earned ${totalIncome.toLocaleString()} KRW from businesses.`);
}

// --- Buy Property ---
function buyProperty(gu, dong) {
    if (properties[gu][dong].owner === "Player") {
        logMessage("You already own this property.");
        return false;
    }
    let price = properties[gu][dong].price;
    if (player.cash < price) {
        logMessage("Not enough cash!");
        return false;
    }
    player.cash -= price;
    player.properties[dong] = { district: gu, purchase_price: price, buildings: null };
    properties[gu][dong].owner = "Player";
    logMessage(`Bought ${dong} in ${gu} for ${price.toLocaleString()} KRW.`);
    return true;
}

// --- Sell Property ---
function sellProperty(dong) {
    if (!player.properties[dong]) {
        logMessage("You don’t own this property.");
        return false;
    }
    const gu = player.properties[dong].district;
    let basePrice = properties[gu][dong].price;
    let buildingValue = player.properties[dong].buildings ? Math.floor(player.properties[dong].buildings.construction_cost * 1.2) : 0;
    let currentPrice = basePrice + buildingValue;

    player.cash += currentPrice;
    delete player.properties[dong];
    properties[gu][dong].owner = null;
    logMessage(`Sold ${dong} for ${currentPrice.toLocaleString()} KRW.`);
    return true;
}


// --- Build ---
function constructBuilding(dong, stories, exterior, business) {
    const prop = player.properties[dong];
    if (!prop) { logMessage("You don’t own this property."); return false; }
    if (prop.buildings) { logMessage("This property already has a building."); return false; }

    let baseCost = 1_000_000_000;
    let storyMultiplier = Math.pow(1.2, stories);
    let exteriorMultiplier = exterior === "Brick" ? 1.0 : 1.5;
    let bizMultiplier = { "Hotel": 2.0, "Office": 1.5, "Factory": 1.2 }[business];
    let totalCost = Math.floor(baseCost * storyMultiplier * exteriorMultiplier * bizMultiplier);

    if (player.cash < totalCost) {
        logMessage(`Not enough cash. Construction cost: ${formatKoreanNumber(totalCost)}`);
        return false;
    }
    player.cash -= totalCost;

    let baseIncome = Math.floor(totalCost * 0.005 * bizMultiplier);
    prop.buildings = {
        stories,
        exterior,
        business,
        construction_cost: totalCost,
        condition: 100,
        renovations: 0,
        income: baseIncome
    };

    logMessage(`Built a ${stories}-story ${business} (${exterior}) for ${formatKoreanNumber(totalCost)}.`);
    return true;
}


function constructBuildingFromMap(gu, dong) {
    const stories = parseInt(prompt("Number of stories (1-100):"));
    if (isNaN(stories) || stories < 1 || stories > 100) { log("Invalid number of stories."); return; }

    const exterior = prompt("Exterior Type (Brick/Windows):", "Brick");
    if (!["Brick", "Windows"].includes(exterior)) { log("Invalid exterior."); return; }

    const business = prompt("Business Type (Hotel/Office/Factory):", "Hotel");
    if (!["Hotel", "Office", "Factory"].includes(business)) { log("Invalid business."); return; }

    // Cost calculation
    const baseCost = 1_000_000_000;
    const storyMult = Math.pow(1.2, stories);
    const exteriorMult = exterior === "Brick" ? 1.0 : 1.5;
    const bizMult = { Hotel: 2.0, Office: 1.5, Factory: 1.2 }[business];
    const totalCost = Math.floor(baseCost * storyMult * exteriorMult * bizMult);

    if (player.cash < totalCost) { log("Not enough cash!"); return; }
    player.cash -= totalCost;

    const baseIncome = Math.floor(totalCost * 0.005 * bizMult);
    player.properties[dong].buildings = { stories, exterior, business, construction_cost: totalCost, condition: 100, renovations: 0, income: baseIncome };

    log(`Constructed a ${stories}-story ${business} with ${exterior} exterior at ${dong}. Cost: ${formatKoreanNumber(totalCost)}`);
    updatePlayerStatus();
}


function renovateBuildingFromMap(gu, dong) {
    const building = player.properties[dong].buildings;
    const baseCost = building.construction_cost * 0.2;
    const renovationCount = building.renovations || 0;
    const totalCost = Math.floor(baseCost * Math.pow(1.2, renovationCount));

    if (player.cash < totalCost) { log("Not enough cash!"); return; }
    player.cash -= totalCost;

    building.condition = Math.min(100, building.condition + 20);
    building.renovations = renovationCount + 1;
    building.income = Math.floor(building.income * 1.15);
    building.construction_cost += Math.floor(totalCost * 0.5);

    log(`Renovated ${dong}! Condition: ${building.condition}%, Income: ${building.income.toLocaleString()} KRW`);
    updatePlayerStatus();
}


function sellPropertyFromMap(gu, dong) {
    const building = player.properties[dong].buildings;
    let currentPrice = properties[gu][dong].price;
    if (building) currentPrice += Math.floor(building.construction_cost * 1.2);

    player.cash += currentPrice;
    delete player.properties[dong];
    properties[gu][dong].owner = null;

    log(`Sold ${dong} for ${currentPrice.toLocaleString()} KRW`);
    highlightOwnedDistricts();
    updatePlayerStatus();
}


function openDistrictModal(gu) {
    const dongs = Object.keys(properties[gu]);
    showModal(
        `Properties in ${gu}`,
        dongs.map(d => {
            const prop = properties[gu][d];
            const isOwned = prop.owner === "Player";
            return {
                text: `${d} - ${prop.price.toLocaleString()} KRW ${isOwned ? "(OWNED)" : ""}`,
                onClick: () => isOwned ? openPropertyManagement(gu, d) : buyPropertyFromMap(gu, d)
            };
        })
    );
}


function openPropertyManagement(gu, dong) {
    const prop = player.properties[dong];
    const building = prop.buildings;

    const options = [];
    if (!building) {
        options.push({ text: "Construct Building", onClick: () => { closeModal(); constructBuildingFromMap(gu, dong); } });
    } else {
        options.push({ text: `Renovate Building (Condition: ${building.condition}%)`, onClick: () => { closeModal(); renovateBuildingFromMap(gu, dong); } });
    }
    options.push({ text: "Sell Property", onClick: () => { closeModal(); sellPropertyFromMap(gu, dong); } });

    showModal(
        `${dong} (${gu})`,
        options
    );
}



// --- Renovate ---
function renovateBuilding(dong) {
    const building = player.properties[dong]?.buildings;
    if (!building) { logMessage("No building to renovate."); return false; }

    let baseCost = building.construction_cost * 0.2;
    let renovationCount = building.renovations;
    let totalCost = Math.floor(baseCost * Math.pow(1.2, renovationCount));

    if (player.cash < totalCost) {
        logMessage(`Not enough cash. Renovation cost: ${totalCost.toLocaleString()} KRW`);
        return false;
    }
    player.cash -= totalCost;
    building.condition = Math.min(100, building.condition + 20);
    building.renovations++;
    building.income = Math.floor(building.income * 1.15);
    building.construction_cost += Math.floor(totalCost * 0.5);

    logMessage(`Renovated ${dong}! Condition: ${building.condition}% | New Income: ${building.income.toLocaleString()} KRW`);
    return true;
}
