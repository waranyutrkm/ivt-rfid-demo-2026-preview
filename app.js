const zones = [
  { name: "Receiving", count: 412, reader: "RDR-RC01", status: "normal" },
  { name: "Raw Material WH", count: 3250, reader: "RDR-WH02", status: "normal" },
  { name: "Line A", count: 842, reader: "RDR-LA01", status: "normal" },
  { name: "Line B", count: 699, reader: "RDR-LB02", status: "warning" },
  { name: "QA/QC", count: 186, reader: "RDR-QC01", status: "normal" },
  { name: "Packing", count: 534, reader: "RDR-PK01", status: "normal" },
  { name: "Finished Goods WH", count: 6180, reader: "RDR-FG03", status: "normal" },
  { name: "Dispatch", count: 92, reader: "RDR-DP01", status: "danger" },
];

const assets = [
  ["RFID-IVT-000128", "RM-STL-2201", "Steel Coil", "LOT-VN127-0626", "Raw Material", "Raw Material WH", "In Stock", "09:42:02", "Warehouse"],
  ["RFID-IVT-000459", "WIP-MH-363", "Motor Housing", "LOT-V363-0626", "WIP", "Line B Gate", "In Transit", "09:41:56", "Production B"],
  ["RFID-IVT-000611", "PCB-TRAY-18", "PCB Tray", "LOT-PCB-8742", "WIP", "QA/QC", "In Production", "09:40:14", "QA Team"],
  ["RFID-IVT-000782", "FG-CTN-442", "Finished Carton", "LOT-FG-4421", "Finished Goods", "Finished Goods WH", "Completed", "09:39:33", "Logistics"],
  ["RFID-IVT-001024", "TOOL-SET-A", "Tool Set A", "TOOL-2026-A", "Tooling", "Line A", "In Production", "09:38:47", "Maintenance"],
  ["RFID-IVT-001198", "PALLET-778", "Pallet P778", "PAL-0626-778", "Container", "Dispatch", "Missing", "08:57:21", "Shipping"],
  ["RFID-IVT-001203", "RM-RBR-092", "Rubber Seal", "LOT-RBR-092", "Raw Material", "Receiving", "In Stock", "09:36:08", "Warehouse"],
  ["RFID-IVT-001382", "FG-V363-901", "V363 Assembly", "LOT-V363-901", "Finished Goods", "Packing", "On Hold", "09:33:40", "Packing"],
];

let events = [
  ["09:42:18", "RDR-WH02", "Raw Material WH", "RFID-IVT-000128", "Steel Coil", "Enter", "Enter Zone", "99.4%"],
  ["09:41:56", "RDR-LB02", "Line B", "RFID-IVT-000459", "Motor Housing", "Exit", "Transfer", "97.8%"],
  ["09:40:14", "RDR-QC01", "QA/QC", "RFID-IVT-000611", "PCB Tray", "Enter", "Enter Zone", "98.1%"],
  ["09:39:33", "RDR-FG03", "Finished Goods WH", "RFID-IVT-000782", "Finished Carton", "Enter", "Completed", "99.8%"],
  ["09:38:47", "RDR-LA01", "Line A", "RFID-IVT-001024", "Tool Set A", "Enter", "Tool Check-in", "96.9%"],
  ["09:30:11", "RDR-DP01", "Dispatch", "RFID-IVT-001198", "Pallet P778", "Exit", "Missing Signal", "72.4%"],
  ["09:26:02", "RDR-RC01", "Receiving", "RFID-IVT-001203", "Rubber Seal", "Enter", "Receive", "99.0%"],
  ["09:22:44", "RDR-PK01", "Packing", "RFID-IVT-001382", "V363 Assembly", "Hold", "On Hold", "95.5%"],
];

const alerts = [
  {
    severity: "critical",
    title: "Unauthorized Exit",
    detail: "RFID-IVT-001198 left Dispatch without shipment confirmation.",
    meta: "Dispatch / RDR-DP01 / 09:30",
  },
  {
    severity: "critical",
    title: "Missing Signal",
    detail: "Pallet P778 has no reader contact for more than 30 minutes.",
    meta: "Last seen Dispatch / 08:57",
  },
  {
    severity: "warning",
    title: "Wrong Zone",
    detail: "Motor Housing batch LOT-V363-0626 moved outside assigned path.",
    meta: "Line B Gate / RDR-LB02",
  },
  {
    severity: "warning",
    title: "Reader Read Rate Dropped",
    detail: "RDR-LB02 read confidence dropped below 96% during shift.",
    meta: "Production Line B",
  },
  {
    severity: "critical",
    title: "Duplicate Tag Detected",
    detail: "Two signals reported for RFID-IVT-000782 within 6 seconds.",
    meta: "Finished Goods WH",
  },
  {
    severity: "warning",
    title: "Dwell Time Exceeded",
    detail: "V363 Assembly stayed in Packing longer than 4 hours.",
    meta: "Packing / LOT-V363-901",
  },
];

const readers = [
  ["RDR-RC01", "Receiving Gate", "Online", "99.2%", "12,842 scans"],
  ["RDR-WH02", "Raw Material WH", "Online", "98.7%", "44,091 scans"],
  ["RDR-LA01", "Production Line A", "Online", "97.6%", "31,404 scans"],
  ["RDR-LB02", "Production Line B", "Warning", "94.8%", "28,119 scans"],
  ["RDR-QC01", "QA/QC", "Online", "99.1%", "9,614 scans"],
  ["RDR-PK01", "Packing", "Online", "98.2%", "15,402 scans"],
  ["RDR-FG03", "Finished Goods WH", "Online", "99.4%", "51,920 scans"],
  ["RDR-DP01", "Dispatch", "Warning", "92.5%", "7,335 scans"],
];

const zoneVolumes = [
  ["Finished Goods WH", 86, "6,180"],
  ["Raw Material WH", 64, "3,250"],
  ["Line A", 42, "842"],
  ["Line B", 38, "699"],
  ["Packing", 29, "534"],
  ["Receiving", 22, "412"],
  ["QA/QC", 16, "186"],
  ["Dispatch", 10, "92"],
];

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function currentTime() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function renderMap(targetId, mode = "compact") {
  const target = document.getElementById(targetId);
  const zoneLayer = target.querySelector(".map-zones") || target;
  const dots = mode === "large" ? 3 : 1;

  zoneLayer.innerHTML = zones
    .map((zone, index) => {
      const dotMarkup = Array.from({ length: dots })
        .map((_, dotIndex) => {
          const x = randomBetween(18, 78);
          const y = randomBetween(32, 68);
          const warn = zone.status !== "normal" && dotIndex === 0 ? " warn" : "";
          const delay = ((index + dotIndex) * 0.28).toFixed(2);
          return `<span class="asset-dot${warn}" style="left:${x}%;top:${y}%;--delay:${delay}s;">${dotIndex + 1}</span>`;
        })
        .join("");

      return `
        <div class="zone ${zone.status}">
          <strong>${zone.name}</strong>
          <small>${zone.count.toLocaleString()} assets tracked</small>
          <span class="reader-dot" title="${zone.reader}">RF</span>
          ${dotMarkup}
        </div>
      `;
    })
    .join("");
}

function simulateScanEvent() {
  const asset = assets[randomBetween(0, assets.length - 1)];
  const zone = zones[randomBetween(0, zones.length - 1)];
  const eventTypes = ["Enter Zone", "Exit Zone", "Transfer", "Inventory Read", "Gate Pass"];
  const eventType = eventTypes[randomBetween(0, eventTypes.length - 1)];
  const direction = eventType === "Exit Zone" ? "Exit" : eventType === "Enter Zone" ? "Enter" : "Read";
  events.unshift([
    currentTime(),
    zone.reader,
    zone.name,
    asset[0],
    asset[2],
    direction,
    eventType,
    `${randomBetween(94, 99)}.${randomBetween(0, 9)}%`,
  ]);
  events = events.slice(0, 12);
  renderEvents();
}

function renderEvents() {
  document.getElementById("recentEvents").innerHTML = events
    .slice(0, 8)
    .map(
      (event) => `
        <article class="event-item">
          <header>
            <strong>${event[4]}</strong>
            <span class="badge ${event[6] === "Missing Signal" ? "warn" : "live"}">${event[6]}</span>
          </header>
          <small>${event[0]} / ${event[1]} / ${event[2]} / ${event[3]}</small>
        </article>
      `,
    )
    .join("");

  document.getElementById("eventTable").innerHTML = events
    .map(
      (event) => `
        <tr>
          ${event.map((cell, index) => (index === 6 ? `<td><span class="status-pill ${statusClass(cell)}">${cell}</span></td>` : `<td>${cell}</td>`)).join("")}
        </tr>
      `,
    )
    .join("");
}

function renderAssets(filterText = "", status = "all") {
  const normalized = filterText.trim().toLowerCase();
  const rows = assets.filter((asset) => {
    const matchText = asset.join(" ").toLowerCase().includes(normalized);
    const matchStatus = status === "all" || asset[6] === status;
    return matchText && matchStatus;
  });

  document.getElementById("assetTable").innerHTML = rows
    .map(
      (asset) => `
        <tr>
          ${asset
            .map((cell, index) => (index === 6 ? `<td><span class="status-pill ${statusClass(cell)}">${cell}</span></td>` : `<td>${cell}</td>`))
            .join("")}
        </tr>
      `,
    )
    .join("");
}

function renderAlerts() {
  document.getElementById("dashboardAlerts").innerHTML = alerts
    .slice(0, 3)
    .map(
      (alert) => `
        <article class="alert-item ${alert.severity}">
          <strong>${alert.title}</strong>
          <small>${alert.detail}</small>
          <small>${alert.meta}</small>
        </article>
      `,
    )
    .join("");

  document.getElementById("alertCards").innerHTML = alerts
    .map(
      (alert) => `
        <article class="alert-card ${alert.severity}">
          <header>
            <strong>${alert.title}</strong>
            <span class="status-pill ${alert.severity}">${alert.severity}</span>
          </header>
          <p>${alert.detail}</p>
          <p>${alert.meta}</p>
          <button class="ghost-button">Acknowledge</button>
        </article>
      `,
    )
    .join("");
}

function renderReports() {
  document.getElementById("zoneBars").innerHTML = zoneVolumes
    .map(
      ([zone, percent, total]) => `
        <div class="bar-row">
          <header><span>${zone}</span><span>${total}</span></header>
          <div class="bar"><span style="width:${percent}%"></span></div>
        </div>
      `,
    )
    .join("");

  const readerMarkup = readers
    .map(
      ([id, zone, state, rate, scans]) => `
        <article class="reader-card">
          <header>
            <div>
              <strong>${id}</strong>
              <small>${zone}</small>
            </div>
            <span class="status-pill ${state === "Online" ? "in-stock" : "on-hold"}">${state}</span>
          </header>
          <div class="metric">${rate}</div>
          <p>${scans} today</p>
        </article>
      `,
    )
    .join("");

  document.getElementById("readerCards").innerHTML = readers
    .slice(0, 4)
    .map(
      ([id, zone, state, rate, scans]) => `
        <article class="reader-card">
          <header>
            <div>
              <strong>${id}</strong>
              <small>${zone}</small>
            </div>
            <span class="status-pill ${state === "Online" ? "in-stock" : "on-hold"}">${state}</span>
          </header>
          <div class="metric">${rate}</div>
          <p>${scans} today</p>
        </article>
      `,
    )
    .join("");
  document.getElementById("readerManagement").innerHTML = readerMarkup;
}

function setScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  document.querySelector(`[data-screen="${screenId}"]`).classList.add("active");
  document.getElementById("screenTitle").textContent = document.querySelector(`[data-screen="${screenId}"]`).textContent.trim().replace(/^[A-Z!]\s/, "");
}

function updateClock() {
  const now = new Date();
  document.getElementById("syncTime").textContent = now.toLocaleTimeString("en-GB", { hour12: false });
}

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screen));
});

document.querySelectorAll("[data-screen-jump]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screenJump));
});

document.getElementById("assetFilter").addEventListener("input", (event) => {
  renderAssets(event.target.value, document.getElementById("assetStatusFilter").value);
});

document.getElementById("assetStatusFilter").addEventListener("change", (event) => {
  renderAssets(document.getElementById("assetFilter").value, event.target.value);
});

document.getElementById("globalSearch").addEventListener("input", (event) => {
  const value = event.target.value.trim();
  if (value.length > 1) {
    setScreen("assets");
    document.getElementById("assetFilter").value = value;
    renderAssets(value, "all");
  }
});

document.querySelectorAll(".primary-button").forEach((button) => {
  if (button.textContent.trim() === "Refresh Feed") {
    button.addEventListener("click", () => {
      renderMap("dashboardMap");
      renderMap("trackingMap", "large");
      simulateScanEvent();
    });
  }
});

renderMap("dashboardMap");
renderMap("trackingMap", "large");
renderEvents();
renderAssets();
renderAlerts();
renderReports();
updateClock();
setInterval(updateClock, 1000);
setInterval(simulateScanEvent, 4500);
