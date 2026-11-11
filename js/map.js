// Radiation Map: a timeline of how the Chernobyl fallout spread.
// Shapes are schematic (hand-placed from published reconstructions), not measured data.

const PLANT = [51.3897, 30.0992];
const ACCIDENT = new Date("1986-04-26T00:00:00Z");
const I131_HALF_LIFE_DAYS = 8.02;
const CS137_HALF_LIFE_DAYS = 30.17 * 365.25;

// Cs-137 ground deposition tiers (kBq/m²), lowest first. One-hue red-brown ramp,
// light → dark, validated against the paper background.
const TIERS = [
  { label: "37 – 185",      color: "#d8845a" },
  { label: "185 – 555",     color: "#bb5533" },
  { label: "555 – 1,480",   color: "#93301d" },
  { label: "over 1,480",    color: "#621a0f" },
];
const PLUME_COLOR = "#2d5a78"; // slate blue, distinct from the red ramp
const INK = "#1d1b18";
const PAPER = "#efe8d8";

// Map framings
const VIEWS = {
  plant:    [[51.15, 29.65], [51.65, 30.55]],
  local:    [[50.75, 28.6], [52.05, 31.4]],
  zone:     [[50.4, 27.9], [52.4, 32.3]],
  northwest:[[50.3, 21.0], [57.5, 33.0]],
  north:    [[49.5, 9.0], [64.0, 40.0]],
  europe:   [[39.5, -7.0], [64.0, 40.0]],
  region:   [[49.3, 25.5], [55.6, 38.5]],
};

// ---------------------------------------------------------------------------
// Timeline stages

const STAGES = [
  {
    tick: "Before", date: null, when: "1970 – April 1986",
    title: "A Model Atomic City",
    body: [
      "Construction of the V.I. Lenin Nuclear Power Plant began in 1970, together with Pripyat, a new town for its workers. By 1986 four RBMK reactors were running and two more were being built. Unit 4 had come online in 1983.",
      "Pripyat had about 49,000 residents, and its average age was around 26. The only radiation in the area was natural background.",
    ],
    view: "plant",
  },
  {
    tick: "Apr 26", date: "1986-04-26", when: "April 26, 1986 · 01:23",
    title: "The Explosion",
    body: [
      "During a safety test, a power surge destroyed Reactor No. 4. The blast and the graphite fire that followed threw radioactive material more than a kilometre into the air.",
      "The first plume drifted west and northwest. The pine forest just west of the plant took such heavy doses that it died and turned rust-red. It became known as the Red Forest.",
    ],
    view: "local", plumes: ["west"],
  },
  {
    tick: "Apr 27", date: "1986-04-27", when: "April 27, 1986",
    title: "Pripyat Evacuated",
    body: [
      "About 36 hours after the explosion, Pripyat's residents were told to pack for three days and boarded roughly 1,200 buses. They never came back.",
      "Meanwhile the plume crossed into Soviet Belarus and headed northwest toward the Baltic Sea.",
    ],
    view: "northwest", plumes: ["northwest"],
  },
  {
    tick: "Apr 28", date: "1986-04-28", when: "April 28, 1986",
    title: "The World Finds Out",
    body: [
      "On the morning of April 28, radiation alarms went off at Sweden's Forsmark nuclear plant, more than 1,000 km away. Swedish experts traced the source to the Soviet Union, and that evening Soviet television read a brief statement admitting an accident.",
      "A second branch of the plume moved northeast over Gomel and Bryansk toward Tula. Rain over these regions washed caesium onto the ground and created the worst hotspots outside the zone.",
    ],
    view: "north", plumes: ["scandinavia", "finland", "norway", "northeast"],
  },
  {
    tick: "May 1", date: "1986-05-01", when: "April 29 – May 3, 1986",
    title: "Across Europe",
    body: [
      "Shifting winds carried the plume over Poland, Central Europe and the Balkans, and by May 2 over Britain. Poland gave iodine solution to more than 18 million people to protect their thyroids.",
      "Rain left heavy fallout in parts of Austria, southern Germany and Scandinavia. Restrictions on some sheep farms in Wales and Cumbria lasted until 2012.",
      "In Kyiv the May Day parade went ahead on May 1, as the wind turned toward the city.",
    ],
    view: "europe", plumes: ["kyiv", "central", "britain", "balkans"],
  },
  {
    tick: "May 6", date: "1986-05-06", when: "May 2–6, 1986",
    title: "The 30-Kilometre Zone",
    body: [
      "On May 2 the government ordered everyone within 30 km of the plant to leave. About 116,000 people were evacuated in 1986.",
      "Helicopters dropped about 5,000 tonnes of sand, clay, lead and boron onto the burning core, and by May 6 the releases had fallen sharply. Over ten days the reactor released an estimated 1,760 PBq of iodine-131 and 85 PBq of caesium-137.",
    ],
    view: "zone", plumes: ["kyiv"], plumeFade: 0.35, zone: true,
  },
  {
    tick: "Nov ’86", date: "1986-11-30", when: "November 1986",
    title: "The Sarcophagus",
    body: [
      "Workers finished a concrete-and-steel shelter over the ruined reactor.",
      "By now the iodine-131 had decayed away. It had already done its damage: children who drank contaminated milk absorbed it into their thyroids. Most of what remained on the ground was caesium-137, with a half-life of 30 years. The map now shows where it settled.",
    ],
    view: "region", zone: true,
  },
  {
    tick: "1990s", date: "1995-01-01", when: "1991 – 1999",
    title: "Living With Fallout",
    body: [
      "When the Soviet Union collapsed in 1991, Ukraine, Belarus and Russia inherited the contaminated land. About 150,000 km² across the three countries had caesium deposition above 37 kBq/m². Belarus was hit hardest, with nearly a quarter of its territory contaminated.",
      "Relocations continued until about 350,000 people in all had been moved. Doctors saw a sharp rise in thyroid cancer among people who had been children in 1986. UNSCEAR counted about 20,000 cases from 1991 to 2015.",
    ],
    view: "region", zone: true,
  },
  {
    tick: "2000", date: "2000-12-15", when: "December 15, 2000",
    title: "Last Reactor Shut Down",
    body: [
      "The plant's three surviving reactors kept generating electricity for years after the disaster. Unit 3, the last one, was shut down on December 15, 2000.",
      "Many plant workers had moved to Slavutych, a town built about 45 km east of the plant to replace Pripyat.",
    ],
    view: "local", zone: true,
  },
  {
    tick: "2016", date: "2016-11-29", when: "November 2016",
    title: "The New Safe Confinement",
    body: [
      "A giant steel arch was built nearby and slid over the old sarcophagus. It was designed to seal the reactor for about 100 years.",
      "Thirty years after the accident, half of the caesium-137 released in 1986 had decayed.",
    ],
    view: "plant", zone: true,
  },
  {
    tick: "2022", date: "2022-03-31", when: "February 24 – March 31, 2022",
    title: "Occupation",
    body: [
      "Russian forces seized the zone on the first day of the full-scale invasion of Ukraine and held the plant for five weeks.",
      "Military vehicles churned up contaminated soil, and soldiers dug trenches in the Red Forest. The IAEA lost its remote monitoring data from the site until it was restored.",
    ],
    view: "plant", zone: true,
  },
  {
    tick: "Today", date: "today", when: "Today",
    title: "Forty Years On",
    body: [
      "On February 14, 2025 a drone hit the New Safe Confinement and punched a hole in its outer shell. The IAEA reported that radiation levels stayed normal.",
      "Today about 40% of the 1986 caesium-137 is still in the ground, and the plutonium near the plant will stay hazardous for tens of thousands of years. The Ukrainian exclusion zone covers about 2,600 km². Wildlife has returned, and part of the zone is now a biosphere reserve.",
    ],
    view: "region", zone: true,
  },
];

// ---------------------------------------------------------------------------
// Geography (schematic)

// Plume corridors: waypoints [lat, lng], start width and end width in km.
const PLUMES = {
  west:        { pts: [PLANT, [51.42, 29.6], [51.6, 29.0], [51.9, 28.3]], w: [6, 80] },
  northwest:   { pts: [PLANT, [52.3, 28.8], [53.6, 27.0], [55.0, 25.0], [56.6, 22.0]], w: [12, 300] },
  scandinavia: { pts: [[54.5, 25.5], [56.5, 22.0], [58.5, 19.5], [60.5, 17.5], [62.5, 15.5]], w: [260, 420] },
  finland:     { pts: [[57.5, 21.5], [59.5, 23.0], [61.5, 25.0]], w: [200, 300] },
  norway:      { pts: [[60.5, 17.0], [61.4, 13.0], [62.3, 10.0]], w: [220, 300] },
  northeast:   { pts: [PLANT, [52.4, 30.9], [52.9, 32.5], [53.4, 35.0], [53.7, 37.5]], w: [12, 280] },
  kyiv:        { pts: [PLANT, [50.9, 30.4], [50.2, 30.6], [49.2, 30.2]], w: [12, 200] },
  central:     { pts: [PLANT, [51.6, 26.0], [52.0, 21.5], [51.0, 16.0], [49.5, 13.0], [47.8, 12.0], [46.0, 11.0]], w: [12, 480] },
  britain:     { pts: [[51.5, 15.0], [52.5, 9.0], [53.5, 3.0], [54.5, -3.0]], w: [300, 360] },
  balkans:     { pts: [[50.5, 29.5], [48.0, 27.5], [45.5, 25.5], [43.0, 24.0], [40.6, 22.9]], w: [120, 380] },
};

// Cs-137 deposition areas: ellipses (center, east-west radius km, north-south radius km,
// rotation in degrees), the tier index, and the stage they first appear in.
const SPOTS = [
  // 37–185 kBq/m²: the broad contaminated belt (~150,000 km² in total)
  { name: "Northern Ukraine & southern Belarus", c: [52.1, 29.9], r: [170, 150], rot: 0,  tier: 0, from: 2 },
  { name: "Gomel, Mogilev & Bryansk regions",    c: [53.2, 32.0], r: [125, 105], rot: 20, tier: 0, from: 3 },
  { name: "Tula, Kaluga & Oryol regions",        c: [53.6, 36.5], r: [110, 85],  rot: 0,  tier: 0, from: 3 },
  { name: "Gävle region, Sweden",                c: [60.7, 17.0], r: [90, 55],   rot: 0,  tier: 0, from: 3 },
  { name: "Central Norway",                      c: [62.0, 10.5], r: [95, 75],   rot: 0,  tier: 0, from: 3 },
  { name: "Southern Finland",                    c: [61.0, 24.0], r: [100, 55],  rot: 0,  tier: 0, from: 3 },
  { name: "Austria",                             c: [47.6, 13.8], r: [150, 55],  rot: 0,  tier: 0, from: 4 },
  { name: "Southern Bavaria, Germany",           c: [47.9, 11.5], r: [80, 40],   rot: 0,  tier: 0, from: 4 },

  // 185–555
  { name: "Area around the zone",                c: [51.45, 30.0], r: [70, 80],  rot: 0,  tier: 1, from: 2 },
  { name: "Zhytomyr Oblast (Narodychi)",         c: [51.25, 28.9], r: [50, 25],  rot: 0,  tier: 1, from: 2 },
  { name: "Gomel–Bryansk hotspot",               c: [52.9, 31.4], r: [70, 85],   rot: 20, tier: 1, from: 3 },
  { name: "Tula–Kaluga–Oryol hotspot",           c: [53.6, 36.6], r: [45, 38],   rot: 0,  tier: 1, from: 3 },

  // 555–1,480
  { name: "Inner zone",                          c: [51.45, 29.95], r: [40, 45], rot: 0,  tier: 2, from: 2 },
  { name: "Narodychi",                           c: [51.2, 29.1], r: [12, 9],    rot: 0,  tier: 2, from: 2 },
  { name: "Vetka–Chechersk–Krasnopolye (Belarus)", c: [53.0, 31.1], r: [25, 45], rot: 15, tier: 2, from: 3 },
  { name: "Novozybkov (Russia)",                 c: [52.55, 31.85], r: [25, 18], rot: 0,  tier: 2, from: 3 },

  // over 1,480
  { name: "Near the plant and the Belarusian border", c: [51.47, 30.0], r: [20, 30], rot: -20, tier: 3, from: 1 },
  { name: "Western trace (Red Forest direction)", c: [51.38, 29.75], r: [20, 6],  rot: 0,  tier: 3, from: 1 },
];

// Places. `from`/`to` = stage range when shown; `minZoom` hides the label when zoomed out.
// (Major cities are already labeled by the basemap; these are the story-specific places.)
const PLACES = [
  { name: "Pripyat",        at: [51.4045, 30.0542], minZoom: 9 },
  { name: "Chernobyl",      at: [51.2763, 30.2219], minZoom: 9 },
  { name: "Red Forest",     at: [51.3800, 30.0200], minZoom: 10, from: 1 },
  { name: "Slavutych",      at: [51.5222, 30.7569], minZoom: 8, from: 8 },
  { name: "Forsmark NPP",   at: [60.4036, 18.1661], minZoom: 3, from: 3 },
  { name: "Cumbria, UK",    at: [54.5000, -3.1000], minZoom: 4, from: 4 },
];

// ---------------------------------------------------------------------------
// Geometry helpers (work in Web Mercator so shapes keep their size at any latitude)

const proj = L.Projection.SphericalMercator;
const scaleAt = lat => 1 / Math.cos(lat * Math.PI / 180); // mercator metres per real metre

function chaikin(pts, rounds = 2) {
  for (let r = 0; r < rounds; r++) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      out.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

function corridor(waypoints, [w0, w1], widthFactor = 1) {
  const ll = chaikin(waypoints);
  const P = ll.map(([lat, lng]) => proj.project(L.latLng(lat, lng)));
  const cum = [0];
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + P[i].distanceTo(P[i - 1]));
  const total = cum[cum.length - 1];

  const left = [], right = [], tangents = [], halfW = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const t = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
    const n = { x: -t.y, y: t.x };
    const f = Math.pow(cum[i] / total, 0.7);
    const h = ((w0 + (w1 - w0) * f) / 2) * 1000 * scaleAt(ll[i][0]) * widthFactor;
    tangents.push(t); halfW.push(h);
    left.push(L.point(P[i].x + n.x * h, P[i].y + n.y * h));
    right.push(L.point(P[i].x - n.x * h, P[i].y - n.y * h));
  }

  const cap = (i, dir) => {
    const t = tangents[i], n = { x: -t.y, y: t.x }, h = halfW[i], out = [];
    for (let k = 1; k < 12; k++) {
      const th = (k / 12) * Math.PI;
      const c = Math.cos(th), s = Math.sin(th) * dir;
      out.push(L.point(P[i].x + h * (n.x * c + t.x * s), P[i].y + h * (n.y * c + t.y * s)));
    }
    return out;
  };

  const last = P.length - 1;
  // left edge → rounded far end → right edge (backwards) → rounded start
  const ring = [...left, ...cap(last, 1), ...right.reverse(), ...cap(0, -1).reverse()];
  return ring.map(p => proj.unproject(p));
}

// An ellipse with a gently irregular edge, so contamination areas read as patches, not circles.
function ellipse([lat, lng], [rx, ry], rotDeg) {
  const C = proj.project(L.latLng(lat, lng));
  const s = 1000 * scaleAt(lat);
  const rot = rotDeg * Math.PI / 180;
  const seed = lat * 7.3 + lng * 3.1; // deterministic per shape
  const pts = [];
  for (let k = 0; k < 96; k++) {
    const th = (k / 96) * 2 * Math.PI;
    const wobble = 1 + 0.09 * Math.sin(3 * th + seed) + 0.06 * Math.sin(5 * th + seed * 1.7) + 0.03 * Math.sin(9 * th + seed * 2.3);
    const dx = rx * wobble * Math.cos(th), dy = ry * wobble * Math.sin(th);
    const x = dx * Math.cos(rot) - dy * Math.sin(rot);
    const y = dx * Math.sin(rot) + dy * Math.cos(rot);
    pts.push(proj.unproject(L.point(C.x + x * s, C.y + y * s)));
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Map

const map = L.map("map", {
  zoomControl: true,
  scrollWheelZoom: false,
  minZoom: 3,
  maxZoom: 12,
  zoomSnap: 0.25,
});

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/";
L.tileLayer(ESRI + "World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
  maxNativeZoom: 16,
  attribution: 'Basemap &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.fitBounds(VIEWS.plant);

// Place-name labels sit above the colored layers so they stay readable.
map.createPane("basemapLabels").style.zIndex = 440;
map.getPane("basemapLabels").style.pointerEvents = "none";
L.tileLayer(ESRI + "World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
  pane: "basemapLabels",
  maxNativeZoom: 16,
  opacity: 0.9,
}).addTo(map);

// Panes keep the layer order fixed: deposition < plume < zone ring < labels < markers.
// Deposition shapes are opaque and the whole pane is faded, so nested tiers keep their legend colors.
const depositionPane = map.createPane("deposition");
depositionPane.style.zIndex = 410;
map.createPane("plume").style.zIndex = 420;
map.createPane("zone").style.zIndex = 430;

const spotLayers = SPOTS.map(s => {
  const layer = L.polygon(ellipse(s.c, s.r, s.rot), {
    pane: "deposition",
    stroke: false,
    fillColor: TIERS[s.tier].color,
    fillOpacity: 1,
  });
  layer.bindTooltip(
    `<strong>${s.name}</strong><br>Cs-137: ${TIERS[s.tier].label} kBq/m²`,
    { sticky: true, className: "map-tip" }
  );
  return { spec: s, layer };
});

// Each plume is three nested layers (wide & faint → narrow & denser) for a soft cloud edge.
const PLUME_LAYERS = [
  { width: 1.0,  opacity: 0.08 },
  { width: 0.65, opacity: 0.12 },
  { width: 0.3,  opacity: 0.20 },
];
const plumeLayers = Object.fromEntries(Object.entries(PLUMES).map(([id, p]) => {
  const group = L.layerGroup(PLUME_LAYERS.map(pl =>
    L.polygon(corridor(p.pts, p.w, pl.width), {
      pane: "plume", stroke: false, fillColor: PLUME_COLOR, fillOpacity: pl.opacity, interactive: false,
    })));
  return [id, group];
}));

const zoneRing = L.circle(PLANT, {
  pane: "zone",
  radius: 30000,
  color: INK,
  weight: 1.5,
  dashArray: "5 6",
  fill: false,
  interactive: false,
});
const zoneLabel = L.marker([51.3897 + 0.29, 30.0992], {
  pane: "zone",
  interactive: false,
  icon: L.divIcon({ className: "zone-label", html: "30-km Exclusion Zone", iconSize: null }),
});

const plantMarker = L.marker(PLANT, {
  icon: L.divIcon({ className: "plant-icon", html: "<span></span>", iconSize: [18, 18] }),
  zIndexOffset: 1000,
}).bindTooltip("Chernobyl NPP", { permanent: true, direction: "right", offset: [10, 0], className: "map-label plant-label" })
  .addTo(map);

const placeMarkers = PLACES.map(p => {
  const m = L.circleMarker(p.at, {
    radius: 4,
    color: PAPER,
    weight: 2,
    fillColor: INK,
    fillOpacity: 1,
  }).bindTooltip(p.name, { permanent: true, direction: "right", offset: [6, 0], className: "map-label" });
  return { spec: p, marker: m };
});

// Legend
const legend = L.control({ position: "bottomleft" });
legend.onAdd = () => {
  const div = L.DomUtil.create("div", "map-legend");
  div.innerHTML =
    `<div class="lg-title">Cs-137 on the ground (kBq/m²)</div>` +
    TIERS.slice().reverse().map(t =>
      `<div class="lg-row"><span class="lg-sw" style="background:${t.color}"></span>${t.label}</div>`).join("") +
    `<div class="lg-row lg-gap"><span class="lg-sw lg-plume"></span>Airborne plume</div>` +
    `<div class="lg-row"><span class="lg-sw lg-zone"></span>Exclusion zone</div>`;
  return div;
};
legend.addTo(map);

// ---------------------------------------------------------------------------
// Stage rendering

const DAY = 86400000;
function daysSince(stage) {
  if (!stage.date) return null;
  const d = stage.date === "today" ? new Date() : new Date(stage.date + "T00:00:00Z");
  return Math.max(0, (d - ACCIDENT) / DAY);
}
const remaining = (days, halfLife) => Math.pow(0.5, days / halfLife);

function fmtPct(f) {
  const p = f * 100;
  if (p >= 99.95) return "100%";
  if (p >= 10) return p.toFixed(0) + "%";
  if (p >= 1) return p.toFixed(1) + "%";
  if (p >= 0.01) return p.toFixed(2) + "%";
  return "≈ 0%";
}

const story = document.getElementById("story");
const range = document.getElementById("tl-range");
const ticks = document.getElementById("tl-ticks");
const playBtn = document.getElementById("tl-play");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = -1;

range.max = STAGES.length - 1;
STAGES.forEach((s, i) => {
  const b = document.createElement("button");
  b.className = "tl-tick";
  b.textContent = s.tick;
  b.style.left = (i / (STAGES.length - 1)) * 100 + "%";
  b.addEventListener("click", () => { stopPlay(); show(i); });
  ticks.appendChild(b);
});

function readout(label, frac, note) {
  const val = frac == null ? "—" : fmtPct(frac);
  const width = frac == null ? 0 : Math.max(frac * 100, frac > 0.0001 ? 1 : 0);
  return `<div class="readout">
      <div class="r-head"><span class="r-label">${label}</span><span class="r-val">${val}</span></div>
      <div class="r-bar"><span style="width:${width}%"></span></div>
      <div class="r-note">${note}</div>
    </div>`;
}

function refreshPlaces() {
  const z = map.getZoom();
  for (const { spec, marker } of placeMarkers) {
    const inStage = current >= (spec.from ?? 0) && current <= (spec.to ?? Infinity);
    const visible = inStage && z >= spec.minZoom;
    if (visible && !map.hasLayer(marker)) marker.addTo(map);
    if (!visible && map.hasLayer(marker)) marker.remove();
  }
  const showZoneLabel = STAGES[current].zone && z >= 7.5;
  if (showZoneLabel && !map.hasLayer(zoneLabel)) zoneLabel.addTo(map);
  if (!showZoneLabel && map.hasLayer(zoneLabel)) zoneLabel.remove();
}
map.on("zoomend", refreshPlaces);

function show(i) {
  if (i === current) return;
  current = i;
  const s = STAGES[i];
  const days = daysSince(s);
  const iFrac = days == null ? null : remaining(days, I131_HALF_LIFE_DAYS);
  const cFrac = days == null ? null : remaining(days, CS137_HALF_LIFE_DAYS);

  // Story panel
  story.innerHTML =
    `<p class="s-when">${s.when}</p>` +
    `<h2 class="s-title">${s.title}</h2>` +
    s.body.map(p => `<p>${p}</p>`).join("") +
    `<div class="readouts">` +
      readout("Iodine-131 remaining", iFrac, days == null ? "No release yet" : "Half-life: 8 days") +
      readout("Caesium-137 remaining", cFrac, days == null ? "No release yet" : "Half-life: 30 years") +
    `</div>`;

  // Timeline controls
  range.value = i;
  [...ticks.children].forEach((t, k) => t.classList.toggle("active", k === i));
  document.getElementById("tl-prev").disabled = i === 0;
  document.getElementById("tl-next").disabled = i === STAGES.length - 1;

  // Plumes
  const fade = s.plumeFade ?? 1;
  for (const [id, group] of Object.entries(plumeLayers)) {
    const on = (s.plumes || []).includes(id);
    if (on) {
      group.getLayers().forEach((l, k) => l.setStyle({ fillOpacity: PLUME_LAYERS[k].opacity * fade }));
      if (!map.hasLayer(group)) group.addTo(map);
    } else if (map.hasLayer(group)) {
      group.remove();
    }
  }

  // Deposition fades as Cs-137 decays
  // 0.85 in 1986, fading toward ~0.5 today, so the tiers stay distinguishable.
  depositionPane.style.opacity = cFrac == null ? 0 : 0.25 + 0.6 * cFrac;
  for (const { spec, layer } of spotLayers) {
    const on = days != null && i >= spec.from;
    if (on && !map.hasLayer(layer)) layer.addTo(map);
    if (!on && map.hasLayer(layer)) layer.remove();
    if (on) layer.bringToFront(); // SPOTS is ordered low → high tier, so higher tiers end on top
  }

  // Exclusion zone (its label is handled in refreshPlaces, by zoom)
  if (s.zone && !map.hasLayer(zoneRing)) zoneRing.addTo(map);
  if (!s.zone && map.hasLayer(zoneRing)) zoneRing.remove();

  // Camera
  const bounds = VIEWS[s.view];
  if (reduceMotion) map.fitBounds(bounds);
  else map.flyToBounds(bounds, { duration: 1.4 });
  refreshPlaces();
}

// Controls
let timer = null;
function stopPlay() {
  clearInterval(timer);
  timer = null;
  playBtn.textContent = "Play";
}
function startPlay() {
  if (current === STAGES.length - 1) show(0);
  playBtn.textContent = "Pause";
  timer = setInterval(() => {
    if (current >= STAGES.length - 1) return stopPlay();
    show(current + 1);
  }, 7000);
}
playBtn.addEventListener("click", () => (timer ? stopPlay() : startPlay()));
document.getElementById("tl-prev").addEventListener("click", () => { stopPlay(); show(Math.max(0, current - 1)); });
document.getElementById("tl-next").addEventListener("click", () => { stopPlay(); show(Math.min(STAGES.length - 1, current + 1)); });
range.addEventListener("input", () => { stopPlay(); show(+range.value); });

// map.html#stage=4 opens straight to a stage.
const startStage = Number(new URLSearchParams(location.hash.slice(1)).get("stage")) || 0;
show(Math.min(Math.max(0, startStage), STAGES.length - 1));
