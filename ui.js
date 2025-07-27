function updateStatus() {
  document.getElementById("status").innerHTML = `
    💰 Cash: ${player.cash.toLocaleString()} KRW<br>
    🏠 Properties: ${player.properties.length}
  `;
}




function logMessage(msg) {
  let log = document.getElementById("log");
  log.innerHTML += msg + "<br>";
  log.scrollTop = log.scrollHeight;
}

function setMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = `
    <button onclick="onBuyProperty()">Buy Property</button>
    <button onclick="onSellProperty()">Sell Property</button>
    <button onclick="viewPortfolio()">View Portfolio</button>
    <button onclick="constructBuilding()">Construct Building</button>
    <button onclick="renovateBuilding()">Renovate Building</button>
  `;
}

function setAction(content) {
  document.getElementById("action-panel").innerHTML = content;
}


function showFloatingIncome(x, y, amount) {
  const layer = document.getElementById("floating-income-layer");
  if (!layer) return;

  const svg = document.getElementById("seoul-map");
  if (!svg) return;

  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;

  const screenCTM = svg.getScreenCTM();
  if (!screenCTM) return;

  const global = pt.matrixTransform(screenCTM);

  const div = document.createElement("div");
  div.className = "floating-income";
  div.textContent = `+${formatKoreanNumber(amount)} KRW`;

  div.style.left = `${global.x}px`;
  div.style.top = `${global.y}px`;

  layer.appendChild(div);

  setTimeout(() => div.remove(), 1500);
}
