// ============================================================
// chrome.js — the shell around the engine's controls.
//
// view.js still owns all state and reads it from the hidden native
// controls in index.html. This file only builds the concept-styled
// surfaces — the bottom sheets, the chips, the key readout — and keeps
// them in sync by setting those controls and dispatching change events.
// ============================================================

const $ = id => document.getElementById(id);

const fire = sel => sel.dispatchEvent(new Event("change"));

// ---- Sheets -----------------------------------------------
const sheets = { key: $("sheetKey"), view: $("sheetView") };
const scrim = $("scrim");
let openNow = null;

function openSheet(name) {
  closeSheet();
  openNow = sheets[name];
  openNow.classList.add("open");
  scrim.classList.add("show");
}
function closeSheet() {
  if (openNow) openNow.classList.remove("open");
  scrim.classList.remove("show");
  openNow = null;
}

scrim.addEventListener("click", closeSheet);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeSheet));

$("keyBtn").addEventListener("click", () => openSheet("key"));
$("keyChip").addEventListener("click", () => openSheet("key"));
$("viewBtn").addEventListener("click", () => openSheet("view"));

// ---- The key readout under the wordmark -------------------
function updateChip() {
  $("keyChip").textContent = `${$("root").value} · ${$("scale").value}`;
}

// ---- Root chips -------------------------------------------
function buildRoots() {
  const grid = $("rootGrid");
  grid.innerHTML = "";
  [...$("root").options].forEach(o => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.value = o.value;
    b.textContent = o.value;
    b.addEventListener("click", () => {
      $("root").value = o.value;
      fire($("root"));
      syncSelections();
    });
    grid.appendChild(b);
  });
}

// ---- Segmented controls -----------------------------------
function buildSeg(segId, select, labelOf) {
  const seg = $(segId);
  seg.innerHTML = "";
  [...select.options].forEach(o => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.value = o.value;
    b.textContent = labelOf ? labelOf(o) : o.textContent;
    b.addEventListener("click", () => {
      select.value = o.value;
      fire(select);
      syncSelections();
    });
    seg.appendChild(b);
  });
}

// ---- Material list ----------------------------------------
function buildMaterial() {
  const list = $("matList");
  list.innerHTML = "";
  [...$("scale").children].forEach(og => {
    const h = document.createElement("h3");
    h.textContent = og.label;
    list.appendChild(h);
    [...og.children].forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.value = o.value;
      b.textContent = o.value;
      b.addEventListener("click", () => {
        $("scale").value = o.value;
        fire($("scale"));
        syncSelections();
        closeSheet();
      });
      list.appendChild(b);
    });
  });
  filterMaterial();
}

function filterMaterial() {
  const q = $("matSearch").value.trim().toLowerCase();
  const list = $("matList");
  let header = null, headerHasHits = false;
  [...list.children].forEach(node => {
    if (node.tagName === "H3") {
      if (header) header.style.display = headerHasHits ? "" : "none";
      header = node;
      headerHasHits = false;
      return;
    }
    const hit = !q || node.textContent.toLowerCase().includes(q);
    node.style.display = hit ? "" : "none";
    if (hit) headerHasHits = true;
  });
  if (header) header.style.display = headerHasHits ? "" : "none";
}
$("matSearch").addEventListener("input", filterMaterial);

// ---- Keeping every surface honest -------------------------
function syncSelections() {
  updateChip();
  const mark = (containerId, value) => {
    [...$(containerId).querySelectorAll("button[data-value]")].forEach(b =>
      b.classList.toggle("selected", b.dataset.value === value));
  };
  mark("rootGrid", $("root").value);
  mark("kindSeg", $("kind").value);
  mark("labelSeg", $("labels").value);
  mark("matList", $("scale").value);
}

// Rebuild the material list after the engine refills it — its own kind
// handler runs first, since it was registered first.
$("kind").addEventListener("change", () => { buildMaterial(); syncSelections(); });
["root", "scale", "labels"].forEach(id =>
  $(id).addEventListener("change", syncSelections));

buildRoots();
buildSeg("kindSeg", $("kind"));
buildSeg("labelSeg", $("labels"));
buildMaterial();
syncSelections();
