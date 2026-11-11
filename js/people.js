// Chain of Command — data + tree layout.
// To add a person: add an entry to PEOPLE with a unique id and the id of their `parent`.
// `short` is the label shown on the chart; `role` is the full title shown in the detail panel.
//
// Photos are picked up automatically by person id: images/real/<id>.jpg
// (.jpg, .jpeg, .png or .webp all work.)

const CATEGORIES = {
  party:    "Communist Party",
  gov:      "Government & ministries",
  science:  "Science",
  military: "Military",
  plant:    "Power plant staff",
  fire:     "Fire service",
  medical:  "Medicine",
};

const PEOPLE = [
  // ---- Top ----
  {
    id: "gorbachev", parent: null, cat: "party",
    name: "Mikhail Gorbachev",
    role: "General Secretary, CPSU",
    life: "1931–2022",
    bio: "Leader of the Soviet Union since March 1985. The Politburo first received reassuring, incomplete reports about the accident; Gorbachev did not address the nation until May 14, 1986, eighteen days later. He later wrote that Chernobyl was a turning point that pushed him toward glasnost and may have been a cause of the USSR's collapse.",
  },

  // ---- Union government ----
  {
    id: "ryzhkov", parent: "gorbachev", cat: "gov",
    name: "Nikolai Ryzhkov",
    role: "Chairman, USSR Council of Ministers",
    short: "Soviet Premier",
    life: "1929–2024",
    bio: "Soviet premier. On April 29, 1986 he was put in charge of the Politburo Operative Group on Chernobyl, which coordinated the state response from Moscow. He visited the zone on May 2 with Yegor Ligachev and widened the evacuation to a 30-kilometre radius.",
  },
  {
    id: "scherbina", parent: "ryzhkov", cat: "gov",
    name: "Boris Scherbina",
    role: "Deputy Chairman, USSR Council of Ministers; head of the Government Commission",
    short: "Head, Government Commission",
    life: "1919–1990",
    bio: "Chaired the Government Commission sent to the site on the evening of April 26. After seeing the destroyed reactor he authorized the evacuation of Pripyat, carried out on the afternoon of April 27. He died in 1990.",
  },
  {
    id: "legasov", parent: "scherbina", cat: "science",
    name: "Valery Legasov",
    role: "First Deputy Director, Kurchatov Institute",
    short: "Kurchatov Institute",
    life: "1936–1988",
    bio: "Chemist and the commission's leading scientific voice on site. He pushed for the Pripyat evacuation and helped plan the effort to smother the core. In August 1986 he presented the Soviet report to the IAEA in Vienna. He took his own life on April 27, 1988, two years and a day after the explosion, leaving tape recordings about the accident's causes.",
  },
  {
    id: "antoshkin", parent: "scherbina", cat: "military",
    name: "Nikolai Antoshkin",
    role: "Major General, Kiev Military District air forces",
    short: "Air force general",
    life: "1942–2021",
    bio: "Commanded the helicopter crews who flew over the open reactor dropping sand, clay, boron carbide, dolomite and lead — roughly 5,000 tonnes in the first two weeks.",
  },
  {
    id: "pikalov", parent: "scherbina", cat: "military",
    name: "Vladimir Pikalov",
    role: "Colonel General, Commander of the Chemical Troops",
    short: "Chemical Troops chief",
    life: "1924–2003",
    bio: "Led the army's chemical-defence units at Chernobyl. He personally drove an armoured reconnaissance vehicle close to the reactor to measure radiation, and his troops mapped contamination and decontaminated the area.",
  },
  {
    id: "mayorets", parent: "ryzhkov", cat: "gov",
    name: "Anatoly Mayorets",
    role: "USSR Minister of Energy & Electrification",
    short: "Minister of Energy",
    life: "1929–2016",
    bio: "Head of the ministry that ran the Chernobyl plant. He travelled to the site with the Government Commission. His ministry was later criticized for its handling of safety at RBMK stations.",
  },
  {
    id: "bryukhanov", parent: "mayorets", cat: "plant",
    name: "Viktor Bryukhanov",
    role: "Director, Chernobyl Nuclear Power Plant",
    short: "Plant Director",
    life: "1935–2021",
    bio: "Had run the plant since its construction began in 1970. In the first hours he reported to Moscow that the reactor was intact and radiation was under control. Convicted in 1987 of gross violations of safety rules and sentenced to ten years in a labour camp; released early.",
  },
  {
    id: "fomin", parent: "bryukhanov", cat: "plant",
    name: "Nikolai Fomin",
    role: "Chief Engineer",
    life: "born 1937",
    bio: "Responsible for the plant's technical operation and approved the turbine run-down test program. Sentenced to ten years alongside Bryukhanov and Dyatlov.",
  },
  {
    id: "dyatlov", parent: "fomin", cat: "plant",
    name: "Anatoly Dyatlov",
    role: "Deputy Chief Engineer",
    life: "1931–1995",
    bio: "Supervised the safety test in the Unit 4 control room on the night of April 25–26. Received a heavy dose of radiation, was sentenced to ten years, and was released in 1990 on health grounds. He argued until his death that the reactor's design flaws, not the operators, were the main cause.",
  },
  {
    id: "akimov", parent: "dyatlov", cat: "plant",
    name: "Aleksandr Akimov",
    role: "Unit 4 Shift Supervisor",
    life: "1953–1986", died: true,
    bio: "Led the night shift in the control room and ordered the AZ-5 emergency shutdown at 01:23:40. He stayed in the unit for hours trying to get water to the reactor. Died of acute radiation syndrome in Moscow on May 11, 1986.",
  },
  {
    id: "toptunov", parent: "akimov", cat: "plant",
    name: "Leonid Toptunov",
    role: "Senior Reactor Control Engineer",
    short: "Reactor Control Engineer",
    life: "1960–1986", died: true,
    bio: "Twenty-five years old and only a few months into his post, he was at the reactor controls during the test. He worked with Akimov afterward trying to open water valves by hand. Died of acute radiation syndrome on May 14, 1986.",
  },
  {
    id: "slavsky", parent: "ryzhkov", cat: "gov",
    name: "Yefim Slavsky",
    role: "USSR Minister of Medium Machine Building",
    short: "Minister, Medium Machine Building",
    life: "1898–1991",
    bio: "Long-time head of the secretive ministry behind the Soviet nuclear weapons program. His ministry was given the job of entombing the ruined reactor; the concrete-and-steel 'Sarcophagus' (Ukrytie) was finished in November 1986.",
  },
  {
    id: "burenkov", parent: "ryzhkov", cat: "medical",
    name: "Sergei Burenkov",
    role: "USSR Minister of Health",
    short: "Minister of Health",
    life: "1923–2004",
    bio: "Head of the Soviet health ministry at the time of the accident; he briefed the Politburo on April 29, 1986. His ministry oversaw the evacuation of the severely irradiated to Moscow and the medical monitoring of the population.",
  },
  {
    id: "guskova", parent: "burenkov", cat: "medical",
    name: "Angelina Guskova",
    role: "Head of Clinic, Hospital No. 6, Moscow",
    short: "Hospital No. 6, Moscow",
    life: "1924–2015",
    bio: "The Soviet Union's leading expert on radiation sickness. Her clinic treated the most heavily exposed operators and firefighters flown in from Pripyat — the hospital where many of them died.",
  },

  // ---- Soviet Ukraine ----
  {
    id: "shcherbitsky", parent: "gorbachev", cat: "party",
    name: "Volodymyr Shcherbytsky",
    role: "First Secretary, Communist Party of Ukraine",
    short: "Ukrainian Party chief",
    life: "1918–1990",
    bio: "Party boss of Soviet Ukraine. On Moscow's insistence the May Day parade in Kyiv went ahead on May 1, 1986, with crowds in the streets while radiation levels in the city were rising.",
  },
  {
    id: "lyashko", parent: "shcherbitsky", cat: "gov",
    name: "Oleksandr Lyashko",
    role: "Chairman, Council of Ministers of the Ukrainian SSR",
    short: "Premier, Ukrainian SSR",
    life: "1915–2002",
    bio: "Head of the Ukrainian republic's government, responsible for resettling evacuees and the republic-level response.",
  },
  {
    id: "romanenko", parent: "lyashko", cat: "medical",
    name: "Anatoly Romanenko",
    role: "Minister of Health, Ukrainian SSR",
    short: "Ukrainian Health Minister",
    life: "1928–2025",
    bio: "Went on Ukrainian television in early May 1986 with advice to stay indoors and close windows, while downplaying the danger. His statements became a symbol of the official minimization of the risks.",
  },
  {
    id: "gladush", parent: "lyashko", cat: "gov",
    name: "Ivan Gladush",
    role: "Minister of Internal Affairs, Ukrainian SSR",
    short: "Ukrainian Interior Minister",
    life: "1929–2018",
    bio: "His ministry (MVD) controlled the fire service and the police, who sealed off the zone and organized the evacuation convoys.",
  },
  {
    id: "telyatnikov", parent: "gladush", cat: "fire",
    name: "Leonid Telyatnikov",
    role: "Major; Chief, Plant Fire Station No. 2",
    short: "Chief, Plant Fire Station",
    life: "1951–2004",
    bio: "Commander of the plant's own fire brigade. On leave that night, he rushed to the site and took charge of the firefighting on the roofs of the turbine hall and reactor building. Survived severe radiation sickness; named Hero of the Soviet Union.",
  },
  {
    id: "pravyk", parent: "telyatnikov", cat: "fire",
    name: "Volodymyr Pravyk",
    role: "Lieutenant; duty shift leader, Plant Fire Station No. 2",
    short: "Lieutenant, plant fire crew",
    life: "1962–1986", died: true,
    bio: "Led the first fire crew to arrive at Unit 4, minutes after the explosion. Twenty-three years old. Died in Moscow on May 11, 1986; posthumously named Hero of the Soviet Union.",
  },
  {
    id: "kibenok", parent: "gladush", cat: "fire",
    name: "Viktor Kibenok",
    role: "Lieutenant; Pripyat City Fire Station No. 6",
    short: "Lieutenant, Pripyat fire crew",
    life: "1963–1986", died: true,
    bio: "Led the Pripyat town fire crew that arrived right behind Pravyk's and fought the blaze on the reactor building. Died May 11, 1986; posthumously named Hero of the Soviet Union.",
  },
  {
    id: "ignatenko", parent: "kibenok", cat: "fire",
    name: "Vasily Ignatenko",
    role: "Sergeant, Pripyat City Fire Station No. 6",
    short: "Sergeant, Pripyat fire crew",
    life: "1961–1986", died: true,
    bio: "Firefighter in Kibenok's crew. Died in Moscow on May 13, 1986. His wife Lyudmila's account of his final weeks opens Svetlana Alexievich's Voices from Chernobyl.",
  },
  {
    id: "revenko", parent: "shcherbitsky", cat: "party",
    name: "Grigory Revenko",
    role: "First Secretary, Kyiv Oblast Party Committee",
    short: "Kyiv Oblast Party chief",
    life: "1936–2014",
    bio: "Party chief of the Kyiv region, which included Chernobyl and Pripyat; responsible for local party direction of the evacuation and resettlement.",
  },
];

// ---------------------------------------------------------------------------
// Layout

const NODE_W = 150;
const NODE_H = 76;
const GAP_X = 16;
const GAP_Y = 40;
const STACK_GAP = 12;  // vertical gap between stacked siblings
const INDENT = 18;     // how far stacked siblings sit to the right of their parent
const PAD = 20;
const MIN_SCALE = 0.75; // below this, scroll sideways instead of shrinking further

const byId = Object.fromEntries(PEOPLE.map(p => [p.id, { ...p, children: [] }]));
let root = null;
for (const p of Object.values(byId)) {
  if (p.parent) byId[p.parent].children.push(p);
  else root = p;
}

// A parent whose children are all leaves gets them stacked in a single column
// under it, instead of spread side by side. Keeps the chart narrow.
const stacksChildren = n => n.children.length > 1 && n.children.every(c => c.children.length === 0);

let nextCol = 0;
function layout(node, depth) {
  node.y = PAD + depth * (NODE_H + GAP_Y);
  if (node.children.length === 0) {
    node.col = nextCol++;
  } else if (stacksChildren(node)) {
    node.col = nextCol++;
    node.children.forEach((c, i) => {
      c.stacked = true;
      c.col = node.col;
      c.y = node.y + (i + 1) * (NODE_H + STACK_GAP);
    });
  } else {
    node.children.forEach(c => layout(c, depth + 1));
    const first = node.children[0].col;
    const last = node.children[node.children.length - 1].col;
    node.col = (first + last) / 2;
  }
}
layout(root, 0);

const nodes = Object.values(byId);
const x = n => PAD + n.col * (NODE_W + GAP_X) + (n.stacked ? INDENT : 0);
const w = n => NODE_W - (n.stacked ? INDENT : 0);
const width = PAD * 2 + nextCol * NODE_W + (nextCol - 1) * GAP_X;
const height = Math.max(...nodes.map(n => n.y + NODE_H)) + PAD;

const scroller = document.getElementById("tree-scroll");
const sizer = document.getElementById("tree-sizer");
const canvas = document.getElementById("tree-canvas");
const svg = document.getElementById("tree-lines");
canvas.style.width = width + "px";
canvas.style.height = height + "px";
svg.setAttribute("width", width);
svg.setAttribute("height", height);

// Connectors
const SVG_NS = "http://www.w3.org/2000/svg";
for (const n of nodes) {
  if (!n.parent) continue;
  const p = byId[n.parent];
  let d;
  if (n.stacked) {
    const spineX = x(p) + INDENT / 2;
    d = `M${spineX},${p.y + NODE_H} V${n.y + NODE_H / 2} H${x(n)}`;
  } else {
    const x1 = x(p) + w(p) / 2, y1 = p.y + NODE_H;
    const x2 = x(n) + w(n) / 2, y2 = n.y;
    const midY = y1 + GAP_Y / 2;
    d = `M${x1},${y1} V${midY} H${x2} V${y2}`;
  }
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  n.path = path;
  svg.appendChild(path);
}

// Nodes
for (const n of nodes) {
  const el = document.createElement("button");
  el.className = "node";
  el.dataset.cat = n.cat;
  el.style.left = x(n) + "px";
  el.style.top = n.y + "px";
  el.style.width = w(n) + "px";
  el.style.height = NODE_H + "px";
  el.innerHTML =
    `<span class="name"></span><span class="role"></span>` +
    (n.died ? `<span class="dagger" title="Died as a result of the disaster">&dagger;</span>` : "");
  el.querySelector(".name").textContent = n.name;
  el.querySelector(".role").textContent = n.short || n.role;
  el.setAttribute("aria-label", `${n.name}, ${n.role}`);
  el.addEventListener("mouseenter", () => highlight(n));
  el.addEventListener("mouseleave", () => highlight(null));
  el.addEventListener("focus", () => highlight(n));
  el.addEventListener("blur", () => highlight(null));
  el.addEventListener("click", () => openDetail(n));
  n.el = el;
  canvas.appendChild(el);
}

// Shrink the chart to fit the window (down to MIN_SCALE), then scroll if still too wide.
function fit() {
  const avail = scroller.clientWidth;
  const s = Math.min(1, Math.max(MIN_SCALE, avail / width));
  canvas.style.transform = `scale(${s})`;
  sizer.style.width = width * s + "px";
  sizer.style.height = height * s + "px";
  scroller.scrollLeft = (x(root) + NODE_W / 2) * s - avail / 2;
}
fit();
window.addEventListener("resize", fit);

function chainToRoot(n) {
  const chain = [];
  for (let c = n; c; c = c.parent ? byId[c.parent] : null) chain.push(c);
  return chain;
}

function highlight(n) {
  document.querySelectorAll(".node.lit, path.lit").forEach(e => e.classList.remove("lit"));
  if (!n) return;
  for (const c of chainToRoot(n)) {
    c.el.classList.add("lit");
    if (c.path) c.path.classList.add("lit");
  }
}

// Detail panel
const detail = document.getElementById("detail");
let selected = null;

function openDetail(n) {
  if (selected) selected.el.classList.remove("selected");
  selected = n;
  n.el.classList.add("selected");
  document.getElementById("d-cat").textContent = CATEGORIES[n.cat];
  document.getElementById("d-name").textContent = n.name + (n.died ? " †" : "");
  document.getElementById("d-role").textContent = n.role;
  document.getElementById("d-life").textContent = n.life || "";
  document.getElementById("d-bio").textContent = n.bio;

  loadPhoto(document.getElementById("d-real"), `images/real/${n.id}`, `Photo of ${n.name}`, "Photo not added yet");

  const chain = chainToRoot(n).slice(1);
  const chainEl = document.getElementById("d-chain");
  chainEl.innerHTML = "";
  if (chain.length) {
    chainEl.append("Reports up through: ");
    chain.forEach((c, i) => {
      const s = document.createElement("strong");
      s.textContent = c.name;
      chainEl.append(s);
      if (i < chain.length - 1) chainEl.append(" → ");
    });
  } else {
    chainEl.textContent = "Top of the Soviet chain of command.";
  }

  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");
}

// Try each image extension in turn; show a placeholder if none exists.
const PHOTO_EXTS = ["jpg", "jpeg", "png", "webp"];
let photoToken = 0;
function loadPhoto(box, base, alt, missingText) {
  const token = ++photoToken + box.id; // ignore late loads after switching person
  box.dataset.token = token;
  box.innerHTML = "";
  box.classList.remove("empty");
  const tryExt = i => {
    if (box.dataset.token !== token) return;
    if (i >= PHOTO_EXTS.length) return showPlaceholder(box, missingText);
    const img = new Image();
    img.alt = alt;
    img.onload = () => { if (box.dataset.token === token) { box.innerHTML = ""; box.appendChild(img); } };
    img.onerror = () => tryExt(i + 1);
    img.src = `${base}.${PHOTO_EXTS[i]}`;
  };
  tryExt(0);
}

function showPlaceholder(box, text) {
  box.dataset.token = "";
  box.classList.add("empty");
  box.textContent = text;
}

function closeDetail() {
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden", "true");
  if (selected) selected.el.classList.remove("selected");
  selected = null;
}

document.getElementById("detail-close").addEventListener("click", closeDetail);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetail(); });
