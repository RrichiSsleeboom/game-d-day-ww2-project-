/* ============================================================
   D-DAY: BEACH ASSAULT — v9 cover-based top-down shooter
   Top-down free-movement (WASD / joystick), manual aim + fire
   (mouse/touch), cover system (obstacles block bullets), scrolling
   beach map, multiple roles, multiple levels, score progression.
   ============================================================ */

const BUILD_VERSION = 'v9 · cover';
console.log('%c[D-DAY: Beach Assault] build ' + BUILD_VERSION, 'color:#d4a13a;font-weight:bold');

(function () {
'use strict';

// ============================================================
// CONFIG — ROLES
// ============================================================

const ROLES = {
  rifleman: {
    id: 'rifleman', name: 'Rifleman', fullName: 'Pvt. James Miller',
    unit: '1st Infantry · Omaha Beach', icon: '🎯',
    color: '#4a8754', accent: '#88c46a',
    hp: 100,
    weapon: { name: 'M1 Garand', mag: 8, reserve: 64, fireMs: 220, reloadMs: 2000, dmg: 35, auto: false, spread: 0.04, recoil: 4, range: 480, bulletSpeed: 1200 },
    ability: { name: 'Aimed Shot', key: 'Q', cooldown: 7000, desc: 'Next shot deals 3× damage' },
    difficulty: 2,
    blurb: 'M1 Garand. 8-round clip, semi-auto. Steady, accurate, deadly in trained hands.'
  },
  paratrooper: {
    id: 'paratrooper', name: 'Paratrooper', fullName: 'Sgt. William O\'Connor',
    unit: '101st Airborne · Sainte-Mère-Église', icon: '🪂',
    color: '#6e7a3a', accent: '#c8d058',
    hp: 80,
    weapon: { name: 'Thompson M1A1', mag: 30, reserve: 120, fireMs: 85, reloadMs: 2400, dmg: 14, auto: true, spread: 0.16, recoil: 2, range: 340, bulletSpeed: 1000 },
    ability: { name: 'Sprint', key: 'Q', cooldown: 6500, desc: '2s of 80% faster movement' },
    difficulty: 3,
    blurb: 'Thompson SMG. 30-round mag. Spray and pray, get up close.'
  },
  medic: {
    id: 'medic', name: 'Medic', fullName: 'Cpl. Samuel Cohen',
    unit: '4th Infantry · Utah Beach', icon: '⚕️',
    color: '#8a4040', accent: '#e07070',
    hp: 130,
    weapon: { name: 'Colt M1911', mag: 7, reserve: 56, fireMs: 240, reloadMs: 1800, dmg: 22, auto: false, spread: 0.06, recoil: 3, range: 360, bulletSpeed: 1000 },
    ability: { name: 'Field Dressing', key: 'Q', cooldown: 9000, desc: 'Heal 60 HP instantly' },
    difficulty: 2,
    blurb: 'Sidearm and a medic bag. Heal in a pinch. .45 ACP packs a punch.'
  },
  ranger: {
    id: 'ranger', name: 'Ranger', fullName: 'Cpl. Leonard Lomell',
    unit: '2nd Rangers · Pointe du Hoc', icon: '💣',
    color: '#4a5a78', accent: '#7090c0',
    hp: 90,
    weapon: { name: 'M1 Carbine', mag: 15, reserve: 90, fireMs: 180, reloadMs: 2200, dmg: 18, auto: false, spread: 0.05, recoil: 3, range: 420, bulletSpeed: 1100 },
    ability: { name: 'Grenade', key: 'Q', cooldown: 5500, desc: 'Lob a grenade at the crosshair' },
    difficulty: 3,
    blurb: 'M1 Carbine and a satchel of frags. Crack open clusters of enemies.'
  },
  sniper: {
    id: 'sniper', name: 'Sniper', fullName: 'Sgt. Robert Watson',
    unit: '29th Infantry · Bocage', icon: '🔭',
    color: '#3a5a3a', accent: '#80a060',
    hp: 70,
    weapon: { name: 'Springfield M1903', mag: 5, reserve: 30, fireMs: 1000, reloadMs: 3000, dmg: 110, auto: false, spread: 0.005, recoil: 8, range: 700, bulletSpeed: 1600 },
    ability: { name: 'Piercing Shot', key: 'Q', cooldown: 8000, desc: 'Next shot passes through everything' },
    difficulty: 4,
    blurb: 'Bolt-action with a scope. Slow, fragile, lethal. One shot, one kill.'
  },
  heavy: {
    id: 'heavy', name: 'Heavy Gunner', fullName: 'Pvt. Dale Vandegrift',
    unit: '29th Infantry · Omaha Beach', icon: '⚙️',
    color: '#6a5028', accent: '#c89040',
    hp: 140,
    weapon: { name: 'BAR M1918A2', mag: 20, reserve: 100, fireMs: 105, reloadMs: 2800, dmg: 22, auto: true, spread: 0.12, recoil: 3, range: 380, bulletSpeed: 1050 },
    ability: { name: 'Brace', key: 'Q', cooldown: 7000, desc: '2s of double damage, no recoil' },
    difficulty: 3,
    blurb: 'BAR automatic rifle. Walking thunder — hits hard, eats ammo.'
  }
};
const ROLE_ORDER = ['rifleman', 'paratrooper', 'medic', 'ranger', 'sniper', 'heavy'];

// ============================================================
// CONFIG — LEVELS
// ============================================================

const LEVELS = [
  {
    id: 'omaha', name: 'Omaha Beach', subtitle: 'Easy Red Sector · 06:35', icon: '🌊',
    difficulty: 2, waves: 3, enemyHP: 1.0, enemyCount: 1.0,
    brief: 'You\'re off the Higgins boat in waist-deep water. Sand, blood and machine-gun fire ahead. Reach the seawall — use cover.',
    historicalFact: 'Casualty rates on Omaha\'s first wave exceeded 50%. The 1st and 29th Divisions fought yard by yard up the bluffs.',
    palette: { water: '#3a6080', waterFoam: '#a8c0d0', wetSand: '#8a7048', sand: '#c8a878', sandLight: '#e0c08a', stone: '#888076', bunker: '#5a5048', blood: '#7a2020', smoke: 'rgba(80, 65, 50, 0.65)' },
    terrain: 'beach',
    facts: [
      { title: 'MG-42 — "Hitler\'s Buzzsaw"', text: 'The German MG-42 fired 1,200 rounds per minute, triple the rate of comparable US machine guns. Its distinctive ripping sound terrified Allied troops.' },
      { title: 'Czech Hedgehogs', text: 'The steel-beam obstacles scattered across the beach were designed to tear out the bottoms of landing craft and trap vehicles.' },
      { title: 'Naval Bombardment', text: 'USS Texas and destroyers closed to under 1,000 yards to fire on bunkers point-blank — air bombing had missed German positions.' }
    ],
    quiz: {
      q: 'How many men landed on Omaha Beach on D-Day?',
      options: ['About 12,000', 'About 34,000', 'About 60,000', 'About 100,000'],
      correct: 1,
      explain: '~34,000 men landed on Omaha alone. ~2,400 became casualties — the bloodiest of all five D-Day beaches.'
    },
    boss: { type: 'mg_nest', hp: 480 }
  },
  {
    id: 'bocage', name: 'Bocage Country', subtitle: 'Hedgerows · 11:20', icon: '🌿',
    difficulty: 3, waves: 4, enemyHP: 1.2, enemyCount: 1.2,
    brief: 'Hedgerows ten feet tall. Germans dug in behind every one. Push through. Don\'t bunch up.',
    historicalFact: 'The Normandy hedgerows — bocage — were ancient earth banks topped with thick foliage, forcing US troops into yard-by-yard fighting for weeks.',
    palette: { water: '#3a6080', waterFoam: '#a8c0d0', wetSand: '#5a6840', sand: '#8a9858', sandLight: '#aabc78', stone: '#706858', bunker: '#3a4a28', blood: '#7a2020', smoke: 'rgba(100, 90, 70, 0.5)' },
    terrain: 'bocage',
    facts: [
      { title: 'Rhino Tanks', text: 'US troops welded steel "tusks" from German beach obstacles onto Sherman tanks. These "Rhinos" could plough through hedgerows.' },
      { title: 'The Sunken Lanes', text: 'Between hedgerows ran narrow lanes, often below ground level. Germans turned them into death traps with pre-sighted MGs.' },
      { title: 'Cobra Breakout', text: 'After weeks of bocage fighting, Operation Cobra broke the front open near St-Lô with massive carpet bombing.' }
    ],
    quiz: {
      q: 'What does "bocage" mean?',
      options: ['Forest', 'Marsh', 'Patchwork of fields edged with hedges', 'Coastal cliff'],
      correct: 2,
      explain: 'Bocage is the patchwork of small fields bounded by ancient earth banks topped with dense hedgerows. It dominates inland Normandy.'
    },
    boss: { type: 'tank', hp: 700 }
  },
  {
    id: 'pointe', name: 'Pointe du Hoc', subtitle: 'Cliffs · 07:10', icon: '⛰️',
    difficulty: 4, waves: 4, enemyHP: 1.35, enemyCount: 1.35,
    brief: 'You climbed the 100-foot cliff under fire. Now find the guns — or what\'s left of them. Snipers everywhere.',
    historicalFact: '2nd Ranger Battalion scaled Pointe du Hoc under fire. The big guns had been moved inland, but the Rangers held the position for two days.',
    palette: { water: '#2a4878', waterFoam: '#8aa0b8', wetSand: '#605648', sand: '#9a9080', sandLight: '#b8aea0', stone: '#8a8278', bunker: '#403828', blood: '#7a2020', smoke: 'rgba(110, 90, 70, 0.6)' },
    terrain: 'cliffs',
    facts: [
      { title: 'Rocket-Propelled Grapnels', text: 'Rangers fired rocket-launched grapples trailing ropes up the 100-foot cliff. Many ropes were too wet from surf to hold.' },
      { title: 'The Missing Guns', text: 'Lt. Lomell and Sgt. Kuhn found the five missing guns hidden a mile inland — and destroyed them with thermite grenades.' },
      { title: 'Holding On', text: 'Of 225 Rangers who landed at Pointe du Hoc, only 90 were still able to fight when they were relieved two days later.' }
    ],
    quiz: {
      q: 'What did the Rangers find at the top of Pointe du Hoc?',
      options: ['The German command HQ', 'Empty gun emplacements — artillery had been moved', 'A large minefield', 'A captured American unit'],
      correct: 1,
      explain: 'The big coastal guns had been moved a mile inland a few days before. The Rangers tracked them down and destroyed them.'
    },
    boss: { type: 'mg_nest', hp: 600 }
  },
  {
    id: 'town', name: 'Sainte-Mère-Église', subtitle: 'Town Square · 04:30', icon: '⛪',
    difficulty: 5, waves: 5, enemyHP: 1.5, enemyCount: 1.5,
    brief: 'Paratroopers landed in the church square at night. Hold what you have. Reinforcements come at dawn.',
    historicalFact: 'Pvt. John Steele\'s parachute caught the church steeple, leaving him hanging through the night. The town was the first French town liberated.',
    palette: { water: '#1a2848', waterFoam: '#4a586a', wetSand: '#3a2c20', sand: '#5a4838', sandLight: '#7a6048', stone: '#a8a098', bunker: '#1a1208', blood: '#8a2020', smoke: 'rgba(80, 70, 60, 0.45)' },
    terrain: 'town',
    facts: [
      { title: 'John Steele', text: 'Steele played dead for two hours while hanging from the steeple. The Germans eventually cut him down and took him prisoner — he later escaped.' },
      { title: 'The Pathfinders', text: 'Pathfinders jumped first to mark drop zones with lights. Many were scattered miles off-target by weather and AA fire.' },
      { title: 'First Town Liberated', text: 'Sainte-Mère-Église became the first French town liberated on D-Day, secured around 04:30 by the 505th PIR.' }
    ],
    quiz: {
      q: 'What happened to Pvt. John Steele during the drop?',
      options: ['He landed on the church and was killed', 'His chute caught the steeple and he hung for hours', 'He led the assault on the German HQ', 'He was first into the square'],
      correct: 1,
      explain: 'Steele\'s chute snagged the steeple of the Église Notre-Dame. He hung from the side of the church playing dead before being taken prisoner.'
    },
    boss: { type: 'officer', hp: 850 }
  }
];

// ============================================================
// ENEMY TYPES
// ============================================================

const ENEMY_TYPES = {
  infantry: {
    name: 'Wehrmacht Heer', weapon: 'Mauser K98k',
    hp: 55, speed: 70, dmg: 12, fireMs: 1500, accuracy: 0.55, range: 320, bulletSpeed: 600,
    r: 16, color: '#5a5550', accent: '#7a7570', helmet: 'stahl', score: 15
  },
  rifleman: {
    name: 'Wehrmacht Grenadier', weapon: 'Gewehr 43',
    hp: 85, speed: 80, dmg: 18, fireMs: 1100, accuracy: 0.65, range: 360, bulletSpeed: 700,
    r: 17, color: '#3a4a3a', accent: '#5a6850', helmet: 'stahl', score: 25
  },
  mg: {
    name: 'MG-42 Gunner', weapon: 'MG-42',
    hp: 130, speed: 30, dmg: 10, fireMs: 180, accuracy: 0.55, range: 420, bulletSpeed: 800,
    r: 22, color: '#3a3a48', accent: '#5a5060', helmet: 'stahl', burst: 5, score: 60
  },
  sniper: {
    name: 'Scharfschütze', weapon: 'K98k w/ Zeiss',
    hp: 60, speed: 60, dmg: 38, fireMs: 1900, accuracy: 0.9, range: 600, bulletSpeed: 1200,
    r: 16, color: '#5a4848', accent: '#7a6868', helmet: 'cap', score: 70
  },
  ss: {
    name: 'Waffen-SS', weapon: 'MP 40',
    hp: 100, speed: 110, dmg: 14, fireMs: 350, accuracy: 0.65, range: 280, bulletSpeed: 700,
    r: 17, color: '#2a2a30', accent: '#48485a', helmet: 'stahl', burst: 3, score: 50
  },
  mg_nest: {
    name: 'MG-42 Bunker', weapon: 'Twin MG-42',
    hp: 480, speed: 0, dmg: 12, fireMs: 150, accuracy: 0.7, range: 520, bulletSpeed: 800,
    r: 32, color: '#3a3030', accent: '#5a4848', helmet: 'bunker', isStatic: true, score: 350
  },
  tank: {
    name: 'Panzer IV', weapon: '75mm KwK 40',
    hp: 700, speed: 25, dmg: 50, fireMs: 2200, accuracy: 0.85, range: 480, bulletSpeed: 600,
    r: 36, color: '#4a4a3a', accent: '#6a6a4a', helmet: 'none', isVehicle: true, score: 250
  },
  officer: {
    name: 'SS-Hauptsturmführer', weapon: 'MP 40 + Luger',
    hp: 850, speed: 85, dmg: 16, fireMs: 320, accuracy: 0.78, range: 360, bulletSpeed: 750,
    r: 20, color: '#3a2840', accent: '#7a5860', helmet: 'cap', burst: 4, score: 500
  }
};

// ============================================================
// STATE
// ============================================================

const state = {
  screen: 'title',
  role: 'rifleman',
  level: 0,
  score: 0, wave: 0, kills: 0,
  best: parseInt(localStorage.getItem('dday_best') || '0', 10),
  unlocked: parseInt(localStorage.getItem('dday_unlocked') || '1', 10)
};

const app = document.getElementById('app');

// ============================================================
// HELPERS
// ============================================================

function rand(a, b) { return Math.random() * (b - a) + a; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// Segment vs circle intersection (for bullet vs obstacle/cover)
function segCircleHit(x1, y1, x2, y2, cx, cy, r) {
  const dx = x2 - x1, dy = y2 - y1;
  const fx = x1 - cx, fy = y1 - cy;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  let disc = b * b - 4 * a * c;
  if (disc < 0) return -1;
  disc = Math.sqrt(disc);
  const t1 = (-b - disc) / (2 * a);
  const t2 = (-b + disc) / (2 * a);
  if (t1 >= 0 && t1 <= 1) return t1;
  if (t2 >= 0 && t2 <= 1) return t2;
  return -1;
}

// ============================================================
// SCREEN ROUTING
// ============================================================

let canvas, ctx;
let game = null;
let gameLoopId = 0;
let lastFrame = 0;
let keys = {};
let mouseX = 0, mouseY = 0;
let mouseDown = false;
let touchMove = { active: false, x: 0, y: 0 };
let touchAim = { active: false, x: 0, y: 0 };

function go(screen, opts) {
  state.screen = screen;
  if (opts) Object.assign(state, opts);
  if (gameLoopId) { cancelAnimationFrame(gameLoopId); gameLoopId = 0; }
  if (game) { game = null; }
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  switch (screen) {
    case 'title': renderTitle(); break;
    case 'role':  renderRoleSelect(); break;
    case 'level': renderLevelSelect(); break;
    case 'brief': renderBriefing(); break;
    case 'play':  startGameplay(); break;
    case 'win':   renderResult(true); break;
    case 'lose':  renderResult(false); break;
  }
}

function wireButtons() {
  app.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => go(el.getAttribute('data-go')));
  });
}

// ============================================================
// SCREEN: TITLE
// ============================================================

function renderTitle() {
  app.innerHTML = `
    <section class="dday-screen dday-title">
      <div class="dday-stars"></div>
      <div class="dday-title-inner">
        <div class="dday-title-tag">June 6, 1944</div>
        <h1 class="dday-title-heading">D-DAY<span>Beach Assault</span></h1>
        <div class="dday-title-line"></div>
        <p class="dday-title-blurb">Run out of the surf. Find cover. Take the seawall. Survive.</p>
        <div class="dday-title-stats">
          <div><b>${state.best}</b><span>Best Score</span></div>
          <div><b>${state.unlocked}</b><span>Levels</span></div>
          <div><b>${ROLE_ORDER.length}</b><span>Roles</span></div>
        </div>
        <button class="dday-btn dday-btn-primary" data-go="role">Deploy →</button>
        <div class="dday-title-hint">
          <kbd>WASD</kbd> move · <kbd>Mouse</kbd> aim · <kbd>Click</kbd> fire · <kbd>R</kbd> reload · <kbd>Q</kbd> ability · <kbd>Shift</kbd> sprint<br>
          Touch: drag left to move, drag right to aim, tap right button to fire
        </div>
        <div class="dday-build">build ${BUILD_VERSION}</div>
      </div>
    </section>
  `;
  wireButtons();
}

// ============================================================
// SCREEN: ROLE SELECT
// ============================================================

function renderRoleSelect() {
  const cards = ROLE_ORDER.map(id => {
    const r = ROLES[id];
    const w = r.weapon;
    const selected = state.role === id ? 'selected' : '';
    return `
      <div class="dday-role-card ${selected}" data-pick-role="${id}" style="--accent:${r.accent};--accent-dark:${r.color}">
        <div class="dday-role-icon">${r.icon}</div>
        <div class="dday-role-name">${escapeHtml(r.name)}</div>
        <div class="dday-role-sub">${escapeHtml(r.fullName)}</div>
        <div class="dday-role-unit">${escapeHtml(r.unit)}</div>
        <p class="dday-role-blurb">${escapeHtml(r.blurb)}</p>
        <div class="dday-role-weapon">
          <b>${escapeHtml(w.name)}</b>
          <span>${w.mag} rnd · ${w.auto ? 'auto' : 'semi'}</span>
        </div>
        <div class="dday-role-stats">
          <div><span>HP</span><div class="dday-stat-bar"><i style="width:${r.hp / 1.5}%"></i></div></div>
          <div><span>DMG</span><div class="dday-stat-bar"><i style="width:${clamp(w.dmg * 0.9, 10, 100)}%"></i></div></div>
          <div><span>RoF</span><div class="dday-stat-bar"><i style="width:${clamp(100 - w.fireMs / 12, 10, 100)}%"></i></div></div>
          <div><span>RNG</span><div class="dday-stat-bar"><i style="width:${clamp(w.range / 8, 30, 100)}%"></i></div></div>
        </div>
        <div class="dday-role-ability">
          <b>${escapeHtml(r.ability.name)}</b> <span>(Q)</span><br>
          <em>${escapeHtml(r.ability.desc)}</em>
        </div>
      </div>
    `;
  }).join('');
  app.innerHTML = `
    <section class="dday-screen dday-role-select">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="title">← Back</button>
        <h2>Choose Your Soldier</h2>
        <span class="dday-spacer"></span>
      </div>
      <div class="dday-roles-grid">${cards}</div>
      <div class="dday-bottom">
        <button class="dday-btn dday-btn-primary" data-go="level">Continue →</button>
      </div>
    </section>
  `;
  wireButtons();
  app.querySelectorAll('[data-pick-role]').forEach(el => {
    el.addEventListener('click', () => { state.role = el.getAttribute('data-pick-role'); renderRoleSelect(); });
  });
}

// ============================================================
// SCREEN: LEVEL SELECT
// ============================================================

function renderLevelSelect() {
  const cards = LEVELS.map((l, i) => {
    const locked = i >= state.unlocked;
    const stars = '★'.repeat(l.difficulty) + '☆'.repeat(5 - l.difficulty);
    return `
      <div class="dday-level-card ${locked ? 'locked' : ''}" data-pick-level="${i}">
        <div class="dday-level-icon">${l.icon}</div>
        <div class="dday-level-name">${escapeHtml(l.name)}</div>
        <div class="dday-level-sub">${escapeHtml(l.subtitle)}</div>
        <div class="dday-level-stars">${stars}</div>
        ${locked ? '<div class="dday-level-locked">🔒 Beat previous to unlock</div>' : ''}
      </div>
    `;
  }).join('');
  app.innerHTML = `
    <section class="dday-screen dday-level-select">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="role">← Back</button>
        <h2>Choose Your Mission</h2>
        <span class="dday-spacer"></span>
      </div>
      <div class="dday-current-role">
        Playing as <b style="color:${ROLES[state.role].accent}">${ROLES[state.role].icon} ${escapeHtml(ROLES[state.role].name)}</b>
      </div>
      <div class="dday-levels-grid">${cards}</div>
    </section>
  `;
  wireButtons();
  app.querySelectorAll('[data-pick-level]').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.getAttribute('data-pick-level'), 10);
      if (i >= state.unlocked) return;
      state.level = i;
      go('brief');
    });
  });
}

// ============================================================
// SCREEN: BRIEFING
// ============================================================

function renderBriefing() {
  const l = LEVELS[state.level];
  const r = ROLES[state.role];
  app.innerHTML = `
    <section class="dday-screen dday-brief">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="level">← Back</button>
        <h2>Mission Briefing</h2>
        <span class="dday-spacer"></span>
      </div>
      <div class="dday-brief-card">
        <div class="dday-brief-row">
          <div class="dday-brief-left">
            <div class="dday-brief-label">Operation</div>
            <h3>${escapeHtml(l.name)}</h3>
            <div class="dday-brief-sub">${escapeHtml(l.subtitle)}</div>
          </div>
          <div class="dday-brief-right">
            <div class="dday-brief-label">Soldier</div>
            <div class="dday-brief-role" style="background:${r.color};color:#fff">
              ${r.icon} ${escapeHtml(r.name)}
            </div>
            <div class="dday-brief-sub">${escapeHtml(r.fullName)}</div>
          </div>
        </div>
        <div class="dday-brief-divider"></div>
        <p class="dday-brief-text">${escapeHtml(l.brief)}</p>
        <div class="dday-brief-fact">
          <span>📜 Historical Note</span>
          <p>${escapeHtml(l.historicalFact)}</p>
        </div>
        <div class="dday-brief-objective">
          <span>OBJECTIVE</span>
          <p>You spawn in the surf. Run up the beach. Use cover. Clear ${l.waves} waves, then take the position.</p>
        </div>
        <button class="dday-btn dday-btn-primary dday-btn-large" data-go="play">Engage</button>
      </div>
    </section>
  `;
  wireButtons();
}

// ============================================================
// GAMEPLAY — TOP-DOWN COVER SHOOTER
// ============================================================

function startGameplay() {
  const l = LEVELS[state.level];
  const r = ROLES[state.role];
  app.innerHTML = `
    <section class="dday-screen dday-play">
      <canvas id="dday-canvas"></canvas>
      <div class="dday-hud">
        <div class="dday-hud-top">
          <div class="dday-hud-health">
            <div class="dday-hud-label">${r.icon} ${escapeHtml(r.name)}</div>
            <div class="dday-hud-hp"><i id="hud-hp"></i></div>
            <div class="dday-hud-hp-text"><span id="hud-hp-text">${r.hp}</span> / ${r.hp}</div>
          </div>
          <div class="dday-hud-mid">
            <div class="dday-hud-label">Wave</div>
            <div class="dday-hud-wave"><b id="hud-wave">1</b> / ${l.waves}</div>
          </div>
          <div class="dday-hud-score">
            <div class="dday-hud-label">Score</div>
            <div class="dday-hud-score-val"><b id="hud-score">0</b></div>
          </div>
        </div>
        <div class="dday-hud-bottom-row">
          <div class="dday-hud-ammo">
            <div class="dday-hud-ammo-mag"><b id="hud-mag">${r.weapon.mag}</b><span>/ ${r.weapon.mag}</span></div>
            <div class="dday-hud-ammo-reserve">Reserve: <span id="hud-reserve">${r.weapon.reserve}</span></div>
            <div class="dday-hud-ammo-name">${escapeHtml(r.weapon.name)}</div>
            <div class="dday-hud-reload" id="hud-reload">RELOADING…</div>
          </div>
          <div class="dday-hud-ability" id="hud-ability">
            <div class="dday-hud-ability-fill"></div>
            <div class="dday-hud-ability-label">${escapeHtml(r.ability.name)}</div>
            <div class="dday-hud-ability-key">Q</div>
          </div>
        </div>
        <div class="dday-intel" id="dday-intel"></div>
      </div>
      <div class="dday-mobile-controls">
        <div class="dday-mobile-stick" id="mob-move">
          <div class="dday-mobile-knob" id="mob-move-knob"></div>
        </div>
        <div class="dday-mobile-stick dday-mobile-stick-right" id="mob-aim">
          <div class="dday-mobile-knob" id="mob-aim-knob"></div>
          <div class="dday-mobile-fire" id="mob-fire">FIRE</div>
        </div>
        <button class="dday-touch-ability" id="dday-touch-ability">${r.icon}</button>
        <button class="dday-touch-reload" id="dday-touch-reload">⟳</button>
      </div>
      <button class="dday-pause" id="dday-pause">⏸</button>
      <div class="dday-toast" id="dday-toast"></div>
    </section>
  `;
  canvas = document.getElementById('dday-canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  game = new Game(r, l);
  setupInput();
  document.getElementById('dday-pause').addEventListener('click', () => {
    if (game.paused) game.resume(); else game.pause();
  });
  const tAb = document.getElementById('dday-touch-ability');
  const tRl = document.getElementById('dday-touch-reload');
  if (tAb) tAb.addEventListener('click', e => { e.preventDefault(); if (game) game.useAbility(); });
  if (tRl) tRl.addEventListener('click', e => { e.preventDefault(); if (game) game.reload(); });
  lastFrame = performance.now();
  gameLoopId = requestAnimationFrame(loop);
}

function resizeCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (game) game.onResize();
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  if (game && !game.paused) {
    game.update(dt);
    game.render(ctx);
  }
  gameLoopId = requestAnimationFrame(loop);
}

// ============================================================
// GAME CLASS
// ============================================================

const MAP_W = 1600;
const MAP_H = 2400;  // Tall so player runs UP the beach

class Game {
  constructor(role, level) {
    this.role = role;
    this.level = level;
    this.viewW = window.innerWidth;
    this.viewH = window.innerHeight;

    // World/camera
    this.camX = 0; this.camY = 0;
    this.shake = 0;

    // Player
    this.player = {
      x: MAP_W / 2, y: MAP_H - 80,
      r: 18, facing: -Math.PI / 2,
      hp: role.hp, maxHp: role.hp,
      mag: role.weapon.mag,
      reserve: role.weapon.reserve,
      reloading: false, reloadTimer: 0,
      lastFire: 0,
      iframes: 0,
      hitFlash: 0,
      walkPhase: 0,
      inWater: true,
      sprintActive: false
    };

    // Map: build obstacles and friendly/enemy positions
    this.obstacles = [];
    this.enemies = [];
    this.allies = [];
    this.bullets = [];
    this.particles = [];
    this.floats = [];
    this.grenades = [];

    this.buildMap();
    this.spawnAllies();

    // Wave system
    this.wave = 1;
    this.waveTimer = 1.8;
    this.state = 'pre-wave';
    this.bossSpawned = false;
    this.boss = null;

    // Ability
    this.lastAbility = -99999;
    this.abilityActive = 0;
    this.nextShotMul = 1;
    this.nextShotPierce = false;

    // Score
    this.score = 0;
    this.kills = 0;
    this.factIndex = 0;

    this.paused = false;
    this.over = false;
    this.time = 0;
    this.flashHit = 0;

    this.toast('Off the boat — find cover and push up', 2200);
  }

  onResize() {
    this.viewW = window.innerWidth;
    this.viewH = window.innerHeight;
  }
  pause() { this.paused = true; this.toast('Paused — click ⏸ to resume', 99999); }
  resume() {
    this.paused = false;
    const el = document.getElementById('dday-toast');
    if (el) el.classList.remove('show');
    lastFrame = performance.now();
  }

  toast(msg, dur) {
    const el = document.getElementById('dday-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.classList.remove('show'), dur || 1200);
  }
  intel(fact) {
    const el = document.getElementById('dday-intel');
    if (!el) return;
    el.innerHTML = `<div class="dday-intel-card"><span>📜 INTEL</span><b>${escapeHtml(fact.title)}</b><p>${escapeHtml(fact.text)}</p></div>`;
    el.classList.add('show');
    clearTimeout(this._intelT);
    this._intelT = setTimeout(() => el.classList.remove('show'), 5500);
  }
  showIntelFact() {
    const facts = this.level.facts;
    if (!facts || facts.length === 0) return;
    const f = facts[this.factIndex % facts.length];
    this.factIndex++;
    this.intel(f);
  }

  buildMap() {
    const t = this.level.terrain;
    // Common: cover scattered up the map
    if (t === 'beach') {
      // Czech hedgehogs in a cluster in the middle
      for (let i = 0; i < 14; i++) {
        this.obstacles.push({
          x: rand(120, MAP_W - 120),
          y: rand(MAP_H * 0.45, MAP_H * 0.75),
          r: 28, type: 'hedgehog', blocks: true
        });
      }
      // Sandbag walls — cover near the seawall
      for (let i = 0; i < 6; i++) {
        this.obstacles.push({
          x: 200 + i * (MAP_W - 400) / 5,
          y: MAP_H * 0.32 + rand(-30, 30),
          r: 30, type: 'sandbag', blocks: true
        });
      }
      // Smaller sandbag islands halfway
      for (let i = 0; i < 4; i++) {
        this.obstacles.push({
          x: rand(180, MAP_W - 180),
          y: rand(MAP_H * 0.55, MAP_H * 0.7),
          r: 24, type: 'sandbag', blocks: true
        });
      }
      // Bunkers at the top
      this.obstacles.push({ x: MAP_W * 0.25, y: 120, r: 50, type: 'bunker', blocks: true });
      this.obstacles.push({ x: MAP_W * 0.75, y: 120, r: 50, type: 'bunker', blocks: true });
    } else if (t === 'bocage') {
      // Hedgerow blocks
      for (let row = 0; row < 4; row++) {
        const y = 400 + row * 480;
        // Two-segment row with a gap
        const gapX = rand(MAP_W * 0.35, MAP_W * 0.65);
        for (let i = 0; i < 8; i++) {
          const x = 120 + i * (MAP_W - 240) / 7;
          if (Math.abs(x - gapX) < 140) continue;
          this.obstacles.push({ x, y: y + rand(-20, 20), r: 38, type: 'bush', blocks: true });
        }
      }
    } else if (t === 'cliffs') {
      for (let i = 0; i < 22; i++) {
        this.obstacles.push({
          x: rand(80, MAP_W - 80),
          y: rand(MAP_H * 0.25, MAP_H * 0.85),
          r: rand(26, 44), type: 'rock', blocks: true
        });
      }
    } else if (t === 'town') {
      // Building walls (large round-ish obstacles)
      for (let i = 0; i < 10; i++) {
        this.obstacles.push({
          x: rand(140, MAP_W - 140),
          y: rand(MAP_H * 0.2, MAP_H * 0.8),
          r: rand(40, 60), type: 'wall', blocks: true
        });
      }
      // Church steeple in middle-top
      this.obstacles.push({ x: MAP_W / 2, y: 200, r: 60, type: 'church', blocks: true });
    }
  }

  spawnAllies() {
    // 6 friendly NPCs spread near the spawn area, advancing slowly
    for (let i = 0; i < 6; i++) {
      this.allies.push({
        x: rand(120, MAP_W - 120),
        y: MAP_H - 60 + rand(-30, 30),
        r: 14,
        hp: 60, maxHp: 60,
        facing: -Math.PI / 2,
        walkPhase: 0,
        advanceTo: rand(MAP_H * 0.4, MAP_H * 0.6),
        lastShot: 0,
        dead: false,
        hitFlash: 0
      });
    }
  }

  spawnWave() {
    const baseCount = 4 + this.wave;
    const count = Math.round(baseCount * this.level.enemyCount);
    for (let i = 0; i < count; i++) {
      const type = this.pickEnemyType();
      // Spawn enemies at top of map (the "enemy line")
      const x = rand(120, MAP_W - 120);
      const y = rand(160, MAP_H * 0.28);
      this.spawnEnemy(type, x, y);
    }
    this.state = 'wave';
    this.toast(`Wave ${this.wave} of ${this.level.waves}`, 1200);
  }

  pickEnemyType() {
    const w = this.wave;
    const roll = Math.random();
    if (w === 1) return roll < 0.75 ? 'infantry' : 'rifleman';
    if (w === 2) return roll < 0.5 ? 'infantry' : roll < 0.85 ? 'rifleman' : 'mg';
    if (w === 3) return roll < 0.35 ? 'infantry' : roll < 0.65 ? 'rifleman' : roll < 0.88 ? 'mg' : 'sniper';
    return roll < 0.25 ? 'infantry' : roll < 0.5 ? 'rifleman' : roll < 0.75 ? 'mg' : roll < 0.9 ? 'sniper' : 'ss';
  }

  spawnEnemy(typeId, x, y) {
    const t = ENEMY_TYPES[typeId];
    this.enemies.push({
      typeId, type: t,
      x, y, r: t.r,
      hp: t.hp * this.level.enemyHP, maxHp: t.hp * this.level.enemyHP,
      facing: Math.PI / 2,
      lastShot: 0,
      walkPhase: 0,
      hitFlash: 0,
      dead: false,
      dying: 0,
      stopUntil: 0,
      coverTarget: null,
      retreatTimer: 0,
      boss: false
    });
  }

  spawnBoss() {
    const b = this.level.boss;
    const t = ENEMY_TYPES[b.type];
    const e = {
      typeId: b.type, type: t,
      x: MAP_W / 2, y: 220,
      r: t.r + 6,
      hp: b.hp, maxHp: b.hp,
      facing: Math.PI / 2,
      lastShot: 0,
      walkPhase: 0,
      hitFlash: 0,
      dead: false,
      dying: 0,
      stopUntil: 0,
      coverTarget: null,
      retreatTimer: 0,
      boss: true
    };
    this.enemies.push(e);
    this.boss = e;
    this.bossSpawned = true;
    this.state = 'boss';
    this.toast('⚠ Boss approaching', 1800);
  }

  tryFire() {
    if (this.over || this.paused) return;
    if (this.player.reloading) return;
    const w = this.role.weapon;
    if (this.player.mag <= 0) { this.reload(); return; }
    const now = this.time * 1000;
    if (now - this.player.lastFire < w.fireMs) return;
    this.player.lastFire = now;
    this.fire();
  }

  fire() {
    const w = this.role.weapon;
    this.player.mag--;
    // Compute aim direction from player to crosshair (world coords)
    const worldAimX = this.aimWorldX;
    const worldAimY = this.aimWorldY;
    let ang = Math.atan2(worldAimY - this.player.y, worldAimX - this.player.x);
    const spread = w.spread + (this.abilityActive > 0 && this.role.id === 'heavy' ? 0 : 0);
    ang += rand(-spread, spread);
    this.player.facing = ang;
    let dmg = w.dmg * this.nextShotMul;
    this.nextShotMul = 1;
    if (this.abilityActive > 0 && this.role.id === 'heavy') dmg *= 2;
    const pierce = this.nextShotPierce;
    this.nextShotPierce = false;
    // Bullet starts a bit forward of player
    const bx = this.player.x + Math.cos(ang) * (this.player.r + 4);
    const by = this.player.y + Math.sin(ang) * (this.player.r + 4);
    this.bullets.push({
      x: bx, y: by,
      vx: Math.cos(ang) * w.bulletSpeed,
      vy: Math.sin(ang) * w.bulletSpeed,
      dmg, owner: 'player',
      color: '#ffd95a', size: 4,
      life: w.range / w.bulletSpeed,
      pierce,
      hitSet: new Set()
    });
    // Muzzle flash particle
    this.particles.push({
      x: bx, y: by,
      vx: 0, vy: 0,
      color: '#fff5b0', size: 9, life: 0.08, maxLife: 0.08
    });
    this.shake = Math.max(this.shake, 0.06);
    if (this.player.mag === 0) this.toast('Out of ammo — press R', 900);
    this.updateAmmoHUD();
  }

  reload() {
    if (this.player.reloading) return;
    const w = this.role.weapon;
    if (this.player.mag === w.mag) return;
    if (this.player.reserve <= 0) { this.toast('No reserve ammo!', 900); return; }
    this.player.reloading = true;
    this.player.reloadTimer = w.reloadMs / 1000;
    const el = document.getElementById('hud-reload');
    if (el) el.classList.add('show');
  }

  useAbility() {
    if (this.over || this.paused) return;
    const r = this.role;
    const since = this.time * 1000 - this.lastAbility;
    if (since < r.ability.cooldown) return;
    this.lastAbility = this.time * 1000;
    if (r.id === 'rifleman') {
      this.nextShotMul = 3;
      this.toast('Aimed shot ready — next bullet ×3', 1300);
    } else if (r.id === 'paratrooper') {
      this.abilityActive = 2.0;
      this.player.sprintActive = true;
      this.toast('Sprint!', 1200);
    } else if (r.id === 'medic') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 60);
      this.floats.push({ x: this.player.x, y: this.player.y - 24, text: '+60 HP', color: '#ff8080', life: 1 });
      this.updateHpHUD();
    } else if (r.id === 'ranger') {
      // Grenade lobbed to crosshair
      this.grenades.push({
        sx: this.player.x, sy: this.player.y,
        tx: this.aimWorldX, ty: this.aimWorldY,
        age: 0, dur: 0.7, exploded: false
      });
    } else if (r.id === 'sniper') {
      this.nextShotPierce = true;
      this.nextShotMul = 1.5;
      this.toast('Piercing shot ready', 1300);
    } else if (r.id === 'heavy') {
      this.abilityActive = 2.0;
      this.toast('Braced — ×2 damage', 1200);
    }
  }

  // ---- UPDATE ----

  update(dt) {
    this.time += dt;

    // Build world-aim from screen mouse
    this.aimWorldX = (mouseX || touchAim.x || (this.viewW / 2)) + this.camX;
    this.aimWorldY = (mouseY || touchAim.y || (this.viewH / 2)) + this.camY;

    // Player movement input
    let mx = 0, my = 0;
    if (keys['w'] || keys['arrowup'])    my -= 1;
    if (keys['s'] || keys['arrowdown'])  my += 1;
    if (keys['a'] || keys['arrowleft'])  mx -= 1;
    if (keys['d'] || keys['arrowright']) mx += 1;
    if (touchMove.active) { mx += touchMove.x; my += touchMove.y; }
    const mlen = Math.hypot(mx, my);
    if (mlen > 0) { mx /= mlen; my /= mlen; }
    // Sprint
    const sprint = (keys['shift'] || this.player.sprintActive) ? 1.4 : 1;
    const speed = 240 * sprint * (this.player.inWater ? 0.7 : 1);
    const dx = mx * speed * dt;
    const dy = my * speed * dt;
    this.movePlayer(dx, dy);
    if (mlen > 0) this.player.walkPhase += dt * (sprint > 1 ? 14 : 9);

    // Face mouse
    this.player.facing = Math.atan2(this.aimWorldY - this.player.y, this.aimWorldX - this.player.x);

    // Update inWater status (player is in water when in bottom slice of map)
    this.player.inWater = this.player.y > MAP_H - 200;

    // Reloading
    if (this.player.reloading) {
      this.player.reloadTimer -= dt;
      if (this.player.reloadTimer <= 0) {
        const w = this.role.weapon;
        const need = w.mag - this.player.mag;
        const take = Math.min(need, this.player.reserve);
        this.player.mag += take;
        this.player.reserve -= take;
        this.player.reloading = false;
        const el = document.getElementById('hud-reload');
        if (el) el.classList.remove('show');
        this.updateAmmoHUD();
      }
    }

    // Auto-fire while held (auto weapons)
    if ((mouseDown || touchAim.fire) && this.role.weapon.auto && !this.player.reloading) {
      this.tryFire();
    }
    // Or click/tap pulses on semi
    // (Handled in input events)

    // Ability
    if (this.abilityActive > 0) {
      this.abilityActive -= dt;
      if (this.abilityActive <= 0) this.player.sprintActive = false;
    }
    if (this.player.iframes > 0) this.player.iframes -= dt;
    if (this.player.hitFlash > 0) this.player.hitFlash -= dt;
    if (this.flashHit > 0) this.flashHit -= dt;

    // Wave state machine
    if (this.state === 'pre-wave') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.spawnWave();
    } else if (this.state === 'wave') {
      if (this.enemies.length === 0) {
        if (this.wave >= this.level.waves) {
          this.state = 'pre-boss';
          this.waveTimer = 2.0;
          this.toast('All waves clear', 1500);
          this.showIntelFact();
        } else {
          this.state = 'pre-wave';
          this.wave++;
          this.waveTimer = 2.5;
          this.showIntelFact();
          const wel = document.getElementById('hud-wave');
          if (wel) wel.textContent = this.wave;
        }
      }
    } else if (this.state === 'pre-boss') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.spawnBoss();
    } else if (this.state === 'boss') {
      if (!this.boss || this.boss.dead) { this.win(); return; }
    }

    // Enemies
    for (const e of this.enemies) this.updateEnemy(e, dt);
    this.enemies = this.enemies.filter(e => !(e.dead && e.dying <= 0));

    // Allies
    for (const a of this.allies) if (!a.dead) this.updateAlly(a, dt);
    this.allies = this.allies.filter(a => !a.dead);
    if (this.allies.length < 4 && Math.random() < dt * 0.3) {
      this.allies.push({
        x: rand(120, MAP_W - 120), y: MAP_H - 60 + rand(-30, 30), r: 14,
        hp: 60, maxHp: 60, facing: -Math.PI / 2, walkPhase: 0,
        advanceTo: rand(MAP_H * 0.4, MAP_H * 0.6), lastShot: 0, dead: false, hitFlash: 0
      });
    }

    // Bullets
    for (const b of this.bullets) this.updateBullet(b, dt);
    this.bullets = this.bullets.filter(b => b.life > 0);

    // Grenades
    for (const g of this.grenades) this.updateGrenade(g, dt);
    this.grenades = this.grenades.filter(g => g.age < g.dur + 0.5);

    // Particles
    for (const p of this.particles) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= 0.94; p.vy *= 0.94;
      p.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Floats
    for (const f of this.floats) { f.life -= dt; f.y -= dt * 40; }
    this.floats = this.floats.filter(f => f.life > 0);

    // Camera follows player, clamped
    const camTargetX = this.player.x - this.viewW / 2;
    const camTargetY = this.player.y - this.viewH / 2;
    this.camX = lerp(this.camX, clamp(camTargetX, 0, MAP_W - this.viewW), Math.min(1, dt * 6));
    this.camY = lerp(this.camY, clamp(camTargetY, 0, MAP_H - this.viewH), Math.min(1, dt * 6));

    // Shake
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 1.2);

    // Ability cooldown UI
    const cd = this.role.ability.cooldown;
    const since = this.time * 1000 - this.lastAbility;
    const fillEl = document.querySelector('.dday-hud-ability-fill');
    if (fillEl) {
      const pct = clamp(since / cd, 0, 1);
      fillEl.style.width = (pct * 100) + '%';
      const ab = document.getElementById('hud-ability');
      if (ab) ab.classList.toggle('ready', pct >= 1);
    }

    // Boss HP overlay
    if (this.boss && !this.boss.dead) {
      let bossEl = document.getElementById('dday-boss-bar');
      if (!bossEl) {
        bossEl = document.createElement('div');
        bossEl.id = 'dday-boss-bar';
        bossEl.className = 'dday-boss-bar';
        bossEl.innerHTML = '<span></span><i></i>';
        document.querySelector('.dday-play').appendChild(bossEl);
      }
      bossEl.querySelector('span').textContent = this.boss.type.name + ' — ' + Math.ceil(this.boss.hp);
      bossEl.querySelector('i').style.width = (this.boss.hp / this.boss.maxHp * 100) + '%';
    } else {
      const bossEl = document.getElementById('dday-boss-bar');
      if (bossEl) bossEl.remove();
    }
  }

  movePlayer(dx, dy) {
    const p = this.player;
    // Move X then Y, sliding around obstacles
    const newX = clamp(p.x + dx, p.r, MAP_W - p.r);
    if (!this.collidesObstacle(newX, p.y, p.r)) p.x = newX;
    const newY = clamp(p.y + dy, p.r, MAP_H - p.r);
    if (!this.collidesObstacle(p.x, newY, p.r)) p.y = newY;
  }
  collidesObstacle(x, y, r) {
    for (const o of this.obstacles) {
      if (!o.blocks) continue;
      if ((x - o.x) ** 2 + (y - o.y) ** 2 < (r + o.r * 0.8) ** 2) return true;
    }
    return false;
  }

  // ---- ENEMY AI ----

  updateEnemy(e, dt) {
    if (e.dead) { e.dying -= dt; return; }
    if (e.hitFlash > 0) e.hitFlash -= dt;
    e.walkPhase += dt * 5;

    const p = this.player;
    const d = dist(e, p);
    e.facing = Math.atan2(p.y - e.y, p.x - e.x);

    const now = this.time * 1000;

    if (e.type.isStatic) {
      // Bunker stays put
    } else {
      // Advance toward player but find cover
      if (d > 220) {
        const ang = e.facing;
        const sp = e.type.speed;
        this.moveEnemy(e, Math.cos(ang) * sp * dt, Math.sin(ang) * sp * dt);
      } else if (d < 140) {
        // Back off slightly
        const ang = e.facing;
        const sp = e.type.speed * 0.4;
        this.moveEnemy(e, -Math.cos(ang) * sp * dt, -Math.sin(ang) * sp * dt);
      }
    }

    // Touch damage
    if (d < e.r + p.r) {
      this.damagePlayer(e.type.dmg * 0.6 * dt);
    }

    // Fire at player if in range and has line of sight
    if (d < e.type.range && this.lineOfSight(e, p) && now - e.lastShot > e.type.fireMs) {
      const burst = e.type.burst || 1;
      e.lastShot = now;
      for (let i = 0; i < burst; i++) {
        setTimeout(() => {
          if (e.dead || !game || game.over || game.paused) return;
          const ang = Math.atan2(p.y - e.y, p.x - e.x) + rand(-0.08, 0.08);
          this.bullets.push({
            x: e.x + Math.cos(ang) * e.r,
            y: e.y + Math.sin(ang) * e.r,
            vx: Math.cos(ang) * e.type.bulletSpeed,
            vy: Math.sin(ang) * e.type.bulletSpeed,
            dmg: e.type.dmg, owner: 'enemy',
            color: '#ff6644', size: 4,
            life: e.type.range / e.type.bulletSpeed,
            pierce: false, hitSet: new Set()
          });
        }, i * 90);
      }
    }
  }
  moveEnemy(e, dx, dy) {
    const newX = clamp(e.x + dx, e.r, MAP_W - e.r);
    if (!this.collidesObstacle(newX, e.y, e.r)) e.x = newX;
    const newY = clamp(e.y + dy, e.r, MAP_H - e.r);
    if (!this.collidesObstacle(e.x, newY, e.r)) e.y = newY;
  }
  lineOfSight(a, b) {
    // Check if any blocking obstacle is in between
    for (const o of this.obstacles) {
      if (!o.blocks || o.type === 'bush') continue;
      // Don't block if obstacle is the one a is right next to (already exited it)
      const t = segCircleHit(a.x, a.y, b.x, b.y, o.x, o.y, o.r * 0.7);
      if (t >= 0 && t <= 1) return false;
    }
    return true;
  }

  updateAlly(a, dt) {
    a.walkPhase += dt * 5;
    if (a.hitFlash > 0) a.hitFlash -= dt;
    // Advance up the map slowly toward advanceTo, then hold
    if (a.y > a.advanceTo) {
      a.y -= 50 * dt;
    } else {
      // Find nearest enemy and shoot occasionally
      let target = null, bestD = 600;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const d = dist(a, e);
        if (d < bestD) { target = e; bestD = d; }
      }
      if (target) {
        a.facing = Math.atan2(target.y - a.y, target.x - a.x);
        const now = this.time * 1000;
        if (now - a.lastShot > 1200) {
          a.lastShot = now;
          if (this.lineOfSight(a, target)) {
            const ang = a.facing + rand(-0.06, 0.06);
            this.bullets.push({
              x: a.x + Math.cos(ang) * a.r,
              y: a.y + Math.sin(ang) * a.r,
              vx: Math.cos(ang) * 800, vy: Math.sin(ang) * 800,
              dmg: 8, owner: 'ally',
              color: '#ffd95a', size: 4,
              life: 0.8, pierce: false, hitSet: new Set()
            });
          }
        }
      }
    }
    // Allies can be killed by enemy bullets (handled in bullet update)
  }

  updateBullet(b, dt) {
    const stepX = b.vx * dt;
    const stepY = b.vy * dt;
    // Check obstacles along path
    for (const o of this.obstacles) {
      if (!o.blocks || o.type === 'bush') continue;
      const t = segCircleHit(b.x, b.y, b.x + stepX, b.y + stepY, o.x, o.y, o.r * 0.7);
      if (t >= 0 && t <= 1) {
        b.x += stepX * t; b.y += stepY * t;
        for (let i = 0; i < 4; i++) {
          this.particles.push({ x: b.x, y: b.y, vx: rand(-40, 40), vy: rand(-40, 40), color: '#888', size: 4, life: 0.2, maxLife: 0.2 });
        }
        b.life = 0;
        return;
      }
    }
    b.x += stepX; b.y += stepY;
    b.life -= dt;

    // Hits
    if (b.owner === 'player') {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (b.hitSet.has(e)) continue;
        if ((b.x - e.x) ** 2 + (b.y - e.y) ** 2 < (e.r + b.size) ** 2) {
          this.hitEnemy(e, b.dmg);
          b.hitSet.add(e);
          if (!b.pierce) { b.life = 0; return; }
        }
      }
    } else if (b.owner === 'enemy') {
      // Hit player
      if (this.player.iframes <= 0 && (b.x - this.player.x) ** 2 + (b.y - this.player.y) ** 2 < (this.player.r + b.size) ** 2) {
        this.damagePlayer(b.dmg);
        b.life = 0;
        return;
      }
      // Hit ally
      for (const a of this.allies) {
        if (a.dead) continue;
        if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 < (a.r + b.size) ** 2) {
          a.hp -= b.dmg;
          a.hitFlash = 0.15;
          if (a.hp <= 0) {
            a.dead = true;
            for (let i = 0; i < 8; i++) this.particles.push({ x: a.x, y: a.y, vx: rand(-50, 50), vy: rand(-50, 50), color: this.level.palette.blood, size: rand(5, 9), life: 0.7, maxLife: 0.7 });
          }
          b.life = 0;
          return;
        }
      }
    } else if (b.owner === 'ally') {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if ((b.x - e.x) ** 2 + (b.y - e.y) ** 2 < (e.r + b.size) ** 2) {
          this.hitEnemy(e, b.dmg);
          b.life = 0;
          return;
        }
      }
    }
  }

  updateGrenade(g, dt) {
    g.age += dt;
    if (g.age >= g.dur && !g.exploded) {
      g.exploded = true;
      const R = 110;
      for (const e of this.enemies) {
        if (e.dead) continue;
        if ((e.x - g.tx) ** 2 + (e.y - g.ty) ** 2 < R * R) {
          this.hitEnemy(e, 120);
        }
      }
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(60, 240);
        this.particles.push({
          x: g.tx, y: g.ty,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          color: ['#ffaa44', '#ff7030', '#ffffff'][Math.floor(Math.random() * 3)],
          size: rand(7, 14), life: rand(0.5, 0.9), maxLife: 0.9
        });
      }
      this.shake = Math.max(this.shake, 0.4);
    }
  }

  hitEnemy(e, dmg) {
    e.hp -= dmg;
    e.hitFlash = 0.15;
    this.floats.push({ x: e.x + rand(-6, 6), y: e.y - 14, text: '' + Math.ceil(dmg), color: dmg >= 50 ? '#ffeb6a' : '#ffd95a', life: 0.7 });
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      e.dying = 0.6;
      this.score += e.boss ? 600 : e.type.score;
      this.kills++;
      for (let i = 0; i < 12; i++) {
        this.particles.push({
          x: e.x, y: e.y,
          vx: rand(-60, 60), vy: rand(-60, 60),
          color: this.level.palette.blood,
          size: rand(5, 9), life: rand(0.5, 0.9), maxLife: 0.9
        });
      }
      this.updateScoreHUD();
    }
  }
  damagePlayer(dmg) {
    if (this.over) return;
    this.player.hp = Math.max(0, this.player.hp - dmg);
    this.player.hitFlash = 0.18;
    this.shake = Math.min(0.4, this.shake + 0.1);
    this.flashHit = 0.15;
    this.updateHpHUD();
    if (this.player.hp <= 0) this.lose();
  }

  updateHpHUD() {
    const hpEl = document.getElementById('hud-hp');
    const tEl = document.getElementById('hud-hp-text');
    if (hpEl) hpEl.style.width = (this.player.hp / this.player.maxHp * 100) + '%';
    if (tEl) tEl.textContent = Math.max(0, Math.ceil(this.player.hp));
  }
  updateAmmoHUD() {
    const m = document.getElementById('hud-mag');
    const r = document.getElementById('hud-reserve');
    if (m) m.textContent = this.player.mag;
    if (r) r.textContent = this.player.reserve;
  }
  updateScoreHUD() {
    const s = document.getElementById('hud-score');
    if (s) s.textContent = this.score;
  }

  win() {
    if (this.over) return;
    this.over = true;
    state.score = this.score; state.wave = this.wave; state.kills = this.kills;
    if (this.score > state.best) { state.best = this.score; localStorage.setItem('dday_best', state.best); }
    const nextLvl = state.level + 2;
    if (nextLvl > state.unlocked) {
      state.unlocked = Math.min(LEVELS.length, nextLvl);
      localStorage.setItem('dday_unlocked', state.unlocked);
    }
    setTimeout(() => go('win'), 700);
  }
  lose() {
    if (this.over) return;
    this.over = true;
    state.score = this.score; state.wave = this.wave; state.kills = this.kills;
    if (this.score > state.best) { state.best = this.score; localStorage.setItem('dday_best', state.best); }
    setTimeout(() => go('lose'), 700);
  }

  // ---- RENDER ----

  render(ctx) {
    let sx = 0, sy = 0;
    if (this.shake > 0) {
      sx = rand(-this.shake * 10, this.shake * 10);
      sy = rand(-this.shake * 10, this.shake * 10);
    }
    ctx.save();
    ctx.translate(sx - this.camX, sy - this.camY);
    this.drawTerrain(ctx);
    this.drawObstacles(ctx);
    // Sort entities by Y for fake depth
    const all = [
      ...this.allies.filter(a => !a.dead).map(a => ({ y: a.y, kind: 'ally', e: a })),
      ...this.enemies.map(e => ({ y: e.y, kind: 'enemy', e })),
      { y: this.player.y, kind: 'player', e: this.player }
    ].sort((a, b) => a.y - b.y);
    for (const it of all) {
      if (it.kind === 'ally') this.drawAlly(ctx, it.e);
      else if (it.kind === 'enemy') this.drawEnemy(ctx, it.e);
      else this.drawPlayer(ctx, it.e);
    }
    this.drawBullets(ctx);
    this.drawGrenades(ctx);
    this.drawParticles(ctx);
    this.drawFloats(ctx);
    ctx.restore();
    // Crosshair (screen space)
    this.drawCrosshair(ctx);
    // Low-HP overlay
    this.drawHitFlash(ctx);
  }

  drawTerrain(ctx) {
    const p = this.level.palette;
    const t = this.level.terrain;
    // Background fill (sand or appropriate)
    ctx.fillStyle = p.sand;
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    if (t === 'beach') {
      // Water at bottom
      const waterY = MAP_H - 200;
      ctx.fillStyle = p.water;
      ctx.fillRect(0, waterY, MAP_W, 200);
      // Wet sand band
      ctx.fillStyle = p.wetSand;
      ctx.fillRect(0, waterY - 50, MAP_W, 50);
      // Foam waves animated
      ctx.fillStyle = p.waterFoam;
      const t0 = this.time * 40;
      for (let i = 0; i < 30; i++) {
        const x = ((i * 80 + t0) % (MAP_W + 100)) - 50;
        ctx.fillRect(x, waterY + 6, 30, 3);
      }
      for (let i = 0; i < 24; i++) {
        const x = ((i * 90 - t0 * 0.7) % (MAP_W + 100)) - 50;
        ctx.fillRect(x, waterY + 26, 36, 2);
      }
      // Wet bullet-spray patches in middle
      ctx.fillStyle = 'rgba(120,80,60,0.15)';
      for (let i = 0; i < 30; i++) {
        const x = ((i * 211) % MAP_W);
        const y = MAP_H * 0.5 + ((i * 137) % 300);
        ctx.beginPath(); ctx.arc(x, y, 18 + (i % 6) * 4, 0, Math.PI * 2); ctx.fill();
      }
      // Seawall at top
      ctx.fillStyle = p.bunker;
      ctx.fillRect(0, 80, MAP_W, 14);
      ctx.fillRect(0, 60, MAP_W, 8);
    } else if (t === 'bocage') {
      // Grass texture
      ctx.fillStyle = 'rgba(40,60,30,0.5)';
      for (let i = 0; i < 200; i++) {
        const x = (i * 137 + 11) % MAP_W;
        const y = (i * 211 + 17) % MAP_H;
        ctx.fillRect(x, y, 6, 6);
      }
    } else if (t === 'cliffs') {
      ctx.fillStyle = 'rgba(80,70,60,0.4)';
      for (let i = 0; i < 280; i++) {
        const x = (i * 113 + 11) % MAP_W;
        const y = (i * 197 + 17) % MAP_H;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#4a4030';
      ctx.fillRect(0, 0, MAP_W, 60);
    } else if (t === 'town') {
      ctx.fillStyle = p.wetSand;
      for (let y = 0; y < MAP_H; y += 28) {
        for (let x = 0; x < MAP_W; x += 28) {
          ctx.fillRect(x + (y / 28 % 2 === 0 ? 0 : 14), y, 12, 12);
        }
      }
    }
  }

  drawObstacles(ctx) {
    for (const o of this.obstacles) {
      ctx.save();
      ctx.translate(o.x, o.y);
      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(0, o.r * 0.4, o.r * 0.9, o.r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
      if (o.type === 'hedgehog') {
        ctx.strokeStyle = '#3a2818'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-o.r, -o.r); ctx.lineTo(o.r, o.r);
        ctx.moveTo(o.r, -o.r);  ctx.lineTo(-o.r, o.r);
        ctx.moveTo(0, -o.r);    ctx.lineTo(0, o.r);
        ctx.stroke();
        ctx.fillStyle = '#1a1008';
        ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      } else if (o.type === 'sandbag') {
        ctx.fillStyle = '#a89070';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(0, -8 + i * 9, o.r * 0.95, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#806040'; ctx.lineWidth = 1; ctx.stroke();
        }
      } else if (o.type === 'bunker') {
        ctx.fillStyle = '#5a5048';
        ctx.fillRect(-o.r, -o.r * 0.7, o.r * 2, o.r * 1.4);
        ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 3; ctx.strokeRect(-o.r, -o.r * 0.7, o.r * 2, o.r * 1.4);
        ctx.fillStyle = '#0a0604';
        ctx.fillRect(-o.r * 0.7, -o.r * 0.1, o.r * 1.4, o.r * 0.18);
        ctx.fillStyle = '#1a1008';
        ctx.fillRect(-o.r * 0.08, -o.r * 0.1, o.r * 0.5, o.r * 0.08);
      } else if (o.type === 'bush') {
        ctx.fillStyle = this.level.palette.bunker;
        ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(40,60,30,0.7)';
        ctx.beginPath(); ctx.arc(o.r * 0.25, o.r * 0.25, o.r * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#2a3a18'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI * 2); ctx.stroke();
      } else if (o.type === 'rock') {
        ctx.fillStyle = this.level.palette.stone;
        ctx.beginPath();
        const sides = 7;
        for (let i = 0; i <= sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          const rr = o.r * (0.85 + (Math.sin(i * 1.7) * 0.15));
          if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
          else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.fill();
        ctx.strokeStyle = '#4a4540'; ctx.lineWidth = 2; ctx.stroke();
      } else if (o.type === 'wall') {
        ctx.fillStyle = this.level.palette.stone;
        ctx.fillRect(-o.r, -o.r * 0.8, o.r * 2, o.r * 1.6);
        ctx.strokeStyle = '#3a3530'; ctx.lineWidth = 2; ctx.strokeRect(-o.r, -o.r * 0.8, o.r * 2, o.r * 1.6);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let y = -1; y <= 1; y++)
          for (let x = -1; x <= 1; x++)
            ctx.fillRect(-o.r + 8 + x * 24, -o.r * 0.8 + 12 + y * 16, 12, 6);
      } else if (o.type === 'church') {
        ctx.fillStyle = '#807060';
        ctx.fillRect(-o.r, -o.r * 0.9, o.r * 2, o.r * 1.8);
        ctx.fillStyle = '#5a4838';
        ctx.beginPath();
        ctx.moveTo(-o.r, -o.r * 0.9);
        ctx.lineTo(0, -o.r * 1.5);
        ctx.lineTo(o.r, -o.r * 0.9);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3a2818';
        ctx.fillRect(-3, -o.r * 1.5, 6, 8);
      }
      ctx.restore();
    }
  }

  drawPlayer(ctx, p) {
    const role = this.role;
    const bob = Math.sin(p.walkPhase) * 2;
    ctx.save();
    ctx.translate(p.x, p.y + bob);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(0, 14, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Body
    ctx.fillStyle = p.hitFlash > 0 ? '#fff' : role.color;
    ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 2; ctx.stroke();
    // Helmet
    ctx.fillStyle = p.hitFlash > 0 ? '#fff' : role.accent;
    ctx.beginPath(); ctx.arc(0, -3, 13, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1008'; ctx.fillRect(-13, -3, 26, 2);
    // Eyes
    ctx.fillStyle = '#1a1008';
    ctx.beginPath(); ctx.arc(-4, 3, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, 3, 1.6, 0, Math.PI * 2); ctx.fill();
    // Gun
    ctx.rotate(p.facing);
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(8, -2, 22, 4);
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(28, -1, 5, 2);
    // I-frames
    if (p.iframes > 0) {
      ctx.rotate(-p.facing);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, p.r + 6, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  drawEnemy(ctx, e) {
    if (e.dead && e.dying > 0) {
      ctx.save();
      ctx.globalAlpha = e.dying * 1.5;
    } else {
      ctx.save();
    }
    ctx.translate(e.x, e.y);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(0, e.r * 0.8, e.r * 0.85, e.r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
    if (e.type.isVehicle) {
      // Tank
      ctx.fillStyle = e.hitFlash > 0 ? '#fff' : e.type.color;
      ctx.fillRect(-e.r, -e.r * 0.7, e.r * 2, e.r * 1.4);
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(-e.r * 1.1, -e.r * 0.5, e.r * 2.2, e.r * 0.18);
      ctx.fillRect(-e.r * 1.1, e.r * 0.3, e.r * 2.2, e.r * 0.18);
      // Turret
      ctx.fillStyle = e.hitFlash > 0 ? '#fff' : e.type.accent;
      ctx.save(); ctx.rotate(e.facing);
      ctx.beginPath(); ctx.arc(0, 0, e.r * 0.55, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(0, -2, e.r * 1.2, 4);
      ctx.restore();
    } else if (e.type.isStatic) {
      // Bunker MG nest
      ctx.fillStyle = e.hitFlash > 0 ? '#fff' : '#5a5048';
      ctx.fillRect(-e.r, -e.r * 0.7, e.r * 2, e.r * 1.4);
      ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 3;
      ctx.strokeRect(-e.r, -e.r * 0.7, e.r * 2, e.r * 1.4);
      ctx.fillStyle = '#0a0604';
      ctx.fillRect(-e.r * 0.7, -e.r * 0.05, e.r * 1.4, e.r * 0.18);
      ctx.save(); ctx.rotate(e.facing);
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(0, -2, e.r * 0.9, 4);
      ctx.restore();
    } else {
      // Soldier
      ctx.fillStyle = e.hitFlash > 0 ? '#fff' : e.type.color;
      ctx.beginPath(); ctx.arc(0, 0, e.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 2; ctx.stroke();
      // Stahlhelm (flatter, flares)
      ctx.fillStyle = e.hitFlash > 0 ? '#fff' : e.type.accent;
      ctx.beginPath();
      ctx.ellipse(0, -3, e.r * 0.85, e.r * 0.4, 0, Math.PI, Math.PI * 2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(-e.r * 0.9, -2, e.r * 1.8, 2);
      // Eyes
      ctx.fillStyle = '#1a1008';
      ctx.beginPath(); ctx.arc(-e.r * 0.25, 3, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(e.r * 0.25, 3, 1.5, 0, Math.PI * 2); ctx.fill();
      // Gun
      ctx.rotate(e.facing);
      ctx.fillStyle = '#2a1a0c';
      ctx.fillRect(e.r * 0.6, -2, e.r * 0.9, 3);
    }
    // HP bar
    if (!e.dead && (e.hp < e.maxHp || e.boss)) {
      const w = e.r * 2;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(-w / 2, e.r + 4, w, 4);
      ctx.fillStyle = e.boss ? '#c83040' : '#80c060';
      ctx.fillRect(-w / 2, e.r + 4, w * (e.hp / e.maxHp), 4);
    }
    ctx.restore();
  }

  drawAlly(ctx, a) {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(0, a.r * 0.7, a.r * 0.8, a.r * 0.25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = a.hitFlash > 0 ? '#fff' : '#4a6741';
    ctx.beginPath(); ctx.arc(0, 0, a.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 1.5; ctx.stroke();
    // US M1 helmet
    ctx.fillStyle = '#5a6840';
    ctx.beginPath(); ctx.arc(0, -2, a.r * 0.7, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1008'; ctx.fillRect(-a.r * 0.7, -2, a.r * 1.4, 2);
    ctx.rotate(a.facing);
    ctx.fillStyle = '#2a1a0c';
    ctx.fillRect(a.r * 0.6, -1.5, a.r * 0.9, 3);
    ctx.restore();
  }

  drawBullets(ctx) {
    for (const b of this.bullets) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  drawGrenades(ctx) {
    for (const g of this.grenades) {
      if (g.exploded) continue;
      const p = clamp(g.age / g.dur, 0, 1);
      const x = lerp(g.sx, g.tx, p);
      const y = lerp(g.sy, g.ty, p) - Math.sin(p * Math.PI) * 60;
      ctx.fillStyle = '#1a2a18';
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#3a4a30'; ctx.lineWidth = 1; ctx.stroke();
    }
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      const a = clamp(p.life / p.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  drawFloats(ctx) {
    for (const f of this.floats) {
      ctx.save();
      ctx.globalAlpha = clamp(f.life, 0, 1);
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }
  }

  drawCrosshair(ctx) {
    const sx = (mouseX || touchAim.x || (this.viewW / 2));
    const sy = (mouseY || touchAim.y || (this.viewH / 2));
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 235, 136, 0.85)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffeb88';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(sx - 14, sy); ctx.lineTo(sx - 4, sy);
    ctx.moveTo(sx + 4, sy);  ctx.lineTo(sx + 14, sy);
    ctx.moveTo(sx, sy - 14); ctx.lineTo(sx, sy - 4);
    ctx.moveTo(sx, sy + 4);  ctx.lineTo(sx, sy + 14);
    ctx.stroke();
    ctx.restore();
  }

  drawHitFlash(ctx) {
    if (this.flashHit > 0) {
      ctx.fillStyle = `rgba(180,30,30,${this.flashHit * 2})`;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
    if (this.player.hp / this.player.maxHp < 0.35) {
      const a = (0.35 - this.player.hp / this.player.maxHp) / 0.35;
      const grad = ctx.createRadialGradient(this.viewW / 2, this.viewH / 2, this.viewH * 0.25, this.viewW / 2, this.viewH / 2, this.viewH * 0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(180,30,30,${a * 0.55})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
  }
}

// ============================================================
// INPUT
// ============================================================

function setupInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', () => { mouseDown = false; });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  setupTouchSticks();
}

function onKeyDown(e) {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === 'q') { e.preventDefault(); if (game) game.useAbility(); }
  if (k === 'r') { e.preventDefault(); if (game) game.reload(); }
  if (k === ' ') { e.preventDefault(); if (game) game.tryFire(); }
  if (k === 'p' || k === 'escape') { if (game) { game.paused ? game.resume() : game.pause(); } }
}
function onKeyUp(e) { keys[e.key.toLowerCase()] = false; }

function onMouseMove(e) { mouseX = e.clientX; mouseY = e.clientY; }
function onMouseDown(e) {
  mouseDown = true;
  if (game) game.tryFire();
}
function onMouseUp() { mouseDown = false; }

// Touch sticks: left half = move, right half = aim/fire
let moveTouchId = null;
let aimTouchId = null;
function setupTouchSticks() {
  const move = document.getElementById('mob-move');
  const moveKnob = document.getElementById('mob-move-knob');
  const aim = document.getElementById('mob-aim');
  const aimKnob = document.getElementById('mob-aim-knob');
  const fireBtn = document.getElementById('mob-fire');
  if (!move) return;

  const RAD = 50;

  function startMove(e) {
    const t = e.changedTouches[0];
    moveTouchId = t.identifier;
    touchMove.active = true;
    move._cx = move.getBoundingClientRect().left + move.offsetWidth / 2;
    move._cy = move.getBoundingClientRect().top + move.offsetHeight / 2;
  }
  function moveMove(e) {
    if (moveTouchId === null) return;
    for (const t of e.changedTouches) {
      if (t.identifier === moveTouchId) {
        let dx = t.clientX - move._cx;
        let dy = t.clientY - move._cy;
        const len = Math.hypot(dx, dy);
        if (len > RAD) { dx = dx / len * RAD; dy = dy / len * RAD; }
        moveKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        touchMove.x = dx / RAD;
        touchMove.y = dy / RAD;
      }
    }
  }
  function endMove(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === moveTouchId) {
        moveTouchId = null;
        moveKnob.style.transform = 'translate(0,0)';
        touchMove.active = false; touchMove.x = 0; touchMove.y = 0;
      }
    }
  }
  move.addEventListener('touchstart', e => { e.preventDefault(); startMove(e); }, { passive: false });
  window.addEventListener('touchmove', moveMove, { passive: false });
  window.addEventListener('touchend', endMove);
  window.addEventListener('touchcancel', endMove);

  function startAim(e) {
    const t = e.changedTouches[0];
    aimTouchId = t.identifier;
    touchAim.active = true;
    aim._cx = aim.getBoundingClientRect().left + aim.offsetWidth / 2;
    aim._cy = aim.getBoundingClientRect().top + aim.offsetHeight / 2;
    // Initial aim direction
    touchAim.x = window.innerWidth - 100;
    touchAim.y = window.innerHeight / 2;
  }
  function moveAim(e) {
    if (aimTouchId === null) return;
    for (const t of e.changedTouches) {
      if (t.identifier === aimTouchId) {
        let dx = t.clientX - aim._cx;
        let dy = t.clientY - aim._cy;
        const len = Math.hypot(dx, dy);
        if (len > RAD) { dx = dx / len * RAD; dy = dy / len * RAD; }
        aimKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        // Set aim target far in that direction from player
        if (game) {
          const px = game.player.x - game.camX;
          const py = game.player.y - game.camY;
          touchAim.x = px + dx * 6;
          touchAim.y = py + dy * 6;
        }
      }
    }
  }
  function endAim(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === aimTouchId) {
        aimTouchId = null;
        aimKnob.style.transform = 'translate(0,0)';
        touchAim.active = false;
      }
    }
  }
  aim.addEventListener('touchstart', e => { e.preventDefault(); startAim(e); }, { passive: false });
  window.addEventListener('touchmove', moveAim, { passive: false });
  window.addEventListener('touchend', endAim);
  window.addEventListener('touchcancel', endAim);

  if (fireBtn) {
    fireBtn.addEventListener('touchstart', e => { e.preventDefault(); touchAim.fire = true; if (game) game.tryFire(); }, { passive: false });
    fireBtn.addEventListener('touchend',   e => { e.preventDefault(); touchAim.fire = false; });
    fireBtn.addEventListener('mousedown',  e => { e.preventDefault(); touchAim.fire = true; if (game) game.tryFire(); });
    fireBtn.addEventListener('mouseup',    e => { e.preventDefault(); touchAim.fire = false; });
  }
}

// ============================================================
// SCREEN: RESULT (with quiz)
// ============================================================

function renderResult(won) {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  keys = {};
  const l = LEVELS[state.level];
  const r = ROLES[state.role];
  const newBest = state.score === state.best && state.score > 0;
  const quiz = l.quiz;
  const options = quiz.options.map((opt, i) => `<button class="dday-quiz-opt" data-quiz="${i}">${escapeHtml(opt)}</button>`).join('');
  app.innerHTML = `
    <section class="dday-screen dday-result ${won ? 'dday-result-win' : 'dday-result-lose'}">
      <div class="dday-result-card">
        <div class="dday-result-icon">${won ? '🎖' : '☠'}</div>
        <h2 class="dday-result-title">${won ? 'Position Secured' : 'KIA'}</h2>
        <div class="dday-result-sub">${escapeHtml(l.name)} · ${escapeHtml(r.name)}</div>
        <div class="dday-result-stats">
          <div><b>${state.score}</b><span>Score</span></div>
          <div><b>${state.kills || 0}</b><span>Kills</span></div>
          <div><b>${state.best}</b><span>Best</span></div>
        </div>
        ${newBest ? '<div class="dday-result-new">⭐ NEW BEST</div>' : ''}
        ${won && state.unlocked > state.level + 1 ? `<div class="dday-result-unlock">🔓 Unlocked: <b>${escapeHtml(LEVELS[Math.min(state.level + 1, LEVELS.length - 1)].name)}</b></div>` : ''}
        <div class="dday-quiz">
          <div class="dday-quiz-label">⭐ HISTORICAL QUESTION (+500 bonus)</div>
          <div class="dday-quiz-q">${escapeHtml(quiz.q)}</div>
          <div class="dday-quiz-opts">${options}</div>
          <div class="dday-quiz-explain" id="dday-quiz-explain"></div>
        </div>
        <p class="dday-result-fact">📜 ${escapeHtml(l.historicalFact)}</p>
        <div class="dday-result-buttons">
          <button class="dday-btn" data-go="brief">Retry</button>
          <button class="dday-btn" data-go="level">Levels</button>
          <button class="dday-btn dday-btn-primary" data-go="role">New Soldier</button>
        </div>
      </div>
    </section>
  `;
  wireButtons();
  let quizAnswered = false;
  app.querySelectorAll('[data-quiz]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const i = parseInt(btn.getAttribute('data-quiz'), 10);
      const correct = i === quiz.correct;
      app.querySelectorAll('[data-quiz]').forEach((b, j) => {
        b.classList.add('answered');
        if (j === quiz.correct) b.classList.add('right');
        if (j === i && !correct) b.classList.add('wrong');
      });
      const ex = document.getElementById('dday-quiz-explain');
      if (correct) {
        state.best = Math.max(state.best, state.score + 500);
        localStorage.setItem('dday_best', state.best);
        ex.innerHTML = `<b style="color:#80ff80">+500 score!</b> ${escapeHtml(quiz.explain)}`;
      } else {
        ex.innerHTML = `<b style="color:#ff5a4a">Not quite.</b> ${escapeHtml(quiz.explain)}`;
      }
      ex.classList.add('show');
    });
  });
}

// ============================================================
// BOOT
// ============================================================

function boot() { go('title'); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
