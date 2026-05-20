/* ============================================================
   D-DAY: BEACH ASSAULT
   First-person rail shooter. Aim with cursor, click to fire.
   Multiple roles, multiple levels, friendly NPCs, historical
   facts between waves + end-of-level quiz.
   ============================================================ */

const BUILD_VERSION = 'v7 · cinematic';

// AI-generated photo backdrops (Pollinations.ai — loaded by user's browser).
// One unique scene per level, fixed seed so the image is cached after first generate.
const BACKDROPS = {
  omaha: 'hyperrealistic first-person POV view of D-Day Omaha Beach June 6 1944, soldier muddy gloved hands holding M1 Garand rifle, vaulting burning Czech hedgehog steel obstacle, US soldiers advancing through surf, massive explosions, thick black smoke, water splashing, cinematic lighting overcast sky, Unreal Engine 5, photorealistic 8K sharp detail',
  bocage:'hyperrealistic first-person POV Normandy bocage hedgerow combat 1944, tall thick hedges either side, US soldiers crouching advancing, smoke between fields, distant gunfire flashes, sunlight through trees, cinematic, Unreal Engine 5, photorealistic 8K',
  pointe:'hyperrealistic first-person POV cliff top Pointe du Hoc D-Day 1944, US Army Rangers in foreground with grappling ropes, bombed crater terrain, distant German bunkers, smoke pillars, gray overcast sky, cinematic lighting, Unreal Engine 5, photorealistic 8K sharp detail',
  town:  'hyperrealistic first-person POV view of Sainte-Mere-Eglise France 1944 paratrooper night drop, dark French village square, church steeple with hanging parachute, burning buildings orange glow, smoke, US paratroopers fighting, cinematic dramatic lighting, Unreal Engine 5, photorealistic 8K'
};
const BACKDROP_SEED = 19440606;

function backdropURL(levelId) {
  const p = BACKDROPS[levelId] || BACKDROPS.omaha;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(p) +
         '?width=1600&height=900&nologo=true&enhance=true&seed=' + BACKDROP_SEED;
}

// 10 squad roles visible alongside the player.
const ALLY_ROLES = [
  { id: 'medic',     name: 'Medic',       icon: '⚕', color: '#c83030', extra: 'cross' },
  { id: 'officer',   name: 'Officer',     icon: '★', color: '#4a5a78', extra: 'cap' },
  { id: 'radio',     name: 'Radio Op',    icon: '⦿', color: '#5a5028', extra: 'antenna' },
  { id: 'sapper',    name: 'Sapper',      icon: '⚒', color: '#6a5a3a', extra: 'tube' },
  { id: 'bar',       name: 'BAR Gunner',  icon: '⚙', color: '#5a4828', extra: 'bipod' },
  { id: 'scout',     name: 'Scout',       icon: '➤', color: '#4a6a48', extra: '' },
  { id: 'wounded',   name: 'Wounded',     icon: '✚', color: '#7a4040', extra: 'low' },
  { id: 'flag',      name: 'Flag Bearer', icon: '⚑', color: '#4a6741', extra: 'flag' },
  { id: 'engineer',  name: 'Engineer',    icon: '⚡', color: '#5a4830', extra: 'pack' },
  { id: 'rifleman',  name: 'Rifleman',    icon: '🎯', color: '#4a6741', extra: '' }
];
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
    weapon: { name: 'M1 Garand', mag: 8, reserve: 64, fireMs: 220, reloadMs: 2000, dmg: 35, auto: false, spread: 0.005, recoil: 6 },
    ability: { name: 'Aimed Shot', key: 'Q', cooldown: 7000, desc: 'Next shot deals 3× damage' },
    difficulty: 2,
    blurb: 'Standard issue M1 Garand. 8-round clip, semi-auto. Steady, accurate, deadly in trained hands.'
  },
  paratrooper: {
    id: 'paratrooper', name: 'Paratrooper', fullName: 'Sgt. William O\'Connor',
    unit: '101st Airborne · Sainte-Mère-Église', icon: '🪂',
    color: '#6e7a3a', accent: '#c8d058',
    hp: 80,
    weapon: { name: 'Thompson M1A1', mag: 30, reserve: 120, fireMs: 85, reloadMs: 2400, dmg: 14, auto: true, spread: 0.04, recoil: 3 },
    ability: { name: 'Suppressing Fire', key: 'Q', cooldown: 6500, desc: 'Auto-fire burst, no recoil for 2s' },
    difficulty: 3,
    blurb: 'Thompson submachine gun — "Tommy gun". 30-round stick mag. Spray and pray, get up close.'
  },
  medic: {
    id: 'medic', name: 'Medic', fullName: 'Cpl. Samuel Cohen',
    unit: '4th Infantry · Utah Beach', icon: '⚕️',
    color: '#8a4040', accent: '#e07070',
    hp: 130,
    weapon: { name: 'Colt M1911', mag: 7, reserve: 56, fireMs: 240, reloadMs: 1800, dmg: 22, auto: false, spread: 0.015, recoil: 4 },
    ability: { name: 'Field Dressing', key: 'Q', cooldown: 9000, desc: 'Heal 60 HP instantly' },
    difficulty: 2,
    blurb: 'Sidearm and a medic\'s bag. Self-heal turns close calls into close shaves. .45 ACP packs a punch.'
  },
  ranger: {
    id: 'ranger', name: 'Ranger', fullName: 'Cpl. Leonard Lomell',
    unit: '2nd Rangers · Pointe du Hoc', icon: '💣',
    color: '#4a5a78', accent: '#7090c0',
    hp: 90,
    weapon: { name: 'M1 Carbine', mag: 15, reserve: 90, fireMs: 180, reloadMs: 2200, dmg: 18, auto: false, spread: 0.012, recoil: 4 },
    ability: { name: 'Grenade', key: 'Q', cooldown: 5500, desc: 'Lob a grenade at the crosshair' },
    difficulty: 3,
    blurb: 'M1 Carbine and a satchel of frags. Crack open clusters of enemies in one bang.'
  },
  sniper: {
    id: 'sniper', name: 'Sniper', fullName: 'Sgt. Robert Watson',
    unit: '29th Infantry · Bocage', icon: '🔭',
    color: '#3a5a3a', accent: '#80a060',
    hp: 70,
    weapon: { name: 'Springfield M1903', mag: 5, reserve: 30, fireMs: 1000, reloadMs: 3000, dmg: 110, auto: false, spread: 0.0015, recoil: 12 },
    ability: { name: 'Piercing Shot', key: 'Q', cooldown: 8000, desc: 'Next shot passes through everything in line' },
    difficulty: 4,
    blurb: 'Bolt-action with a 4× scope. Slow, fragile, lethal. One shot, one kill.'
  },
  heavy: {
    id: 'heavy', name: 'Heavy Gunner', fullName: 'Pvt. Dale Vandegrift',
    unit: '29th Infantry · Omaha Beach', icon: '⚙️',
    color: '#6a5028', accent: '#c89040',
    hp: 140,
    weapon: { name: 'BAR M1918A2', mag: 20, reserve: 100, fireMs: 105, reloadMs: 2800, dmg: 22, auto: true, spread: 0.03, recoil: 4 },
    ability: { name: 'Brace', key: 'Q', cooldown: 7000, desc: '2s of double damage, no recoil' },
    difficulty: 3,
    blurb: 'Browning Automatic Rifle. Walking thunder — hits like a hailstorm, eats ammo for breakfast.'
  }
};
const ROLE_ORDER = ['rifleman', 'paratrooper', 'medic', 'ranger', 'sniper', 'heavy'];

// ============================================================
// CONFIG — LEVELS
// ============================================================

const LEVELS = [
  {
    id: 'omaha', name: 'Omaha Beach', subtitle: 'Easy Red Sector · 06:35', icon: '🌊',
    difficulty: 2, waves: 3,
    enemyHP: 1.0, enemyCount: 1.0,
    brief: 'You\'re off the Higgins boat. Sand, blood and machine-gun fire. Clear the seawall before the next wave lands.',
    historicalFact: 'Casualty rates on Omaha\'s first wave exceeded 50%. The 1st and 29th Divisions fought yard by yard up the bluffs.',
    palette: { sky: '#7a8294', sky2: '#9aa2b4', ground: '#c8a878', ground2: '#a8885a', horizon: '#5a5048', smoke: 'rgba(120,100,80,0.75)' },
    terrain: 'beach',
    facts: [
      { title: 'MG-42 — "Hitler\'s Buzzsaw"', text: 'The German MG-42 fired 1,200 rounds per minute, triple the rate of comparable US machine guns. Its distinctive ripping sound terrified Allied troops.' },
      { title: 'Czech Hedgehogs', text: 'The steel-beam obstacles scattered across the beach were designed to tear out the bottoms of landing craft and prevent vehicles from advancing inland.' },
      { title: 'Naval Bombardment', text: 'USS Texas and other destroyers closed to under 1,000 yards from Omaha at dawn to fire on bunkers at point-blank range — they had to, because air bombing had missed the German positions.' }
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
    difficulty: 3, waves: 4,
    enemyHP: 1.2, enemyCount: 1.2,
    brief: 'Hedgerows ten feet tall. Germans dug in behind every one. Push through. Don\'t bunch up.',
    historicalFact: 'The Normandy hedgerows — bocage — were ancient earth banks topped with thick foliage, forcing US troops into yard-by-yard fighting for weeks.',
    palette: { sky: '#9caca0', sky2: '#bcc8b0', ground: '#8a9858', ground2: '#5a7048', horizon: '#3a4a28', smoke: 'rgba(100,90,70,0.6)' },
    terrain: 'bocage',
    facts: [
      { title: 'Rhino Tanks', text: 'US troops welded steel "tusks" from German beach obstacles onto Sherman tanks. These "Rhinos" could plough through hedgerows the Germans had thought impassable.' },
      { title: 'The Sunken Lanes', text: 'Between hedgerows ran narrow lanes, often below ground level. Germans turned them into death traps with pre-sighted MGs at every corner.' },
      { title: 'Cobra Breakout', text: 'After weeks of bocage fighting, Operation Cobra (July 25) finally broke the front open near St-Lô with massive carpet bombing.' }
    ],
    quiz: {
      q: 'What does "bocage" mean?',
      options: ['Forest', 'Marsh', 'Patchwork of fields edged with thick hedges', 'Coastal cliff'],
      correct: 2,
      explain: 'Bocage is the patchwork of small fields bounded by ancient earth banks topped with dense hedgerows. It dominates inland Normandy and made armoured combat brutal.'
    },
    boss: { type: 'tank', hp: 700 }
  },
  {
    id: 'pointe', name: 'Pointe du Hoc', subtitle: 'Cliffs · 07:10', icon: '⛰️',
    difficulty: 4, waves: 4,
    enemyHP: 1.35, enemyCount: 1.35,
    brief: 'You climbed the 100-foot cliff under fire. Now find the guns — or what\'s left of them. Snipers in every direction.',
    historicalFact: '2nd Ranger Battalion scaled Pointe du Hoc under fire. The big guns had been moved inland, but the Rangers held the position for two days against repeated counter-attacks.',
    palette: { sky: '#8090a4', sky2: '#a8b4c4', ground: '#9a9080', ground2: '#605648', horizon: '#403828', smoke: 'rgba(110,90,70,0.7)' },
    terrain: 'cliffs',
    facts: [
      { title: 'Rocket-Propelled Grapnels', text: 'The Rangers fired rocket-launched grappling hooks trailing ropes up the 100-foot cliff. Many ropes were too wet from the surf to hold weight.' },
      { title: 'The Missing Guns', text: 'Lt. Lomell and Sgt. Kuhn found the five missing guns hidden a mile inland, unguarded, and destroyed them with thermite grenades — completing the mission.' },
      { title: 'Holding On', text: 'Of 225 Rangers who landed at Pointe du Hoc, only 90 were still able to fight when they were relieved two days later.' }
    ],
    quiz: {
      q: 'What did the Rangers find at the top of Pointe du Hoc?',
      options: ['The German command HQ', 'Empty gun emplacements — the artillery had been moved', 'A large minefield', 'A captured American unit'],
      correct: 1,
      explain: 'The big coastal guns had been moved a mile inland a few days before. The Rangers tracked them down and destroyed them with thermite grenades.'
    },
    boss: { type: 'mg_nest', hp: 600 }
  },
  {
    id: 'town', name: 'Sainte-Mère-Église', subtitle: 'Town Square · 04:30', icon: '⛪',
    difficulty: 5, waves: 5,
    enemyHP: 1.5, enemyCount: 1.5,
    brief: 'Paratroopers landed in the church square at night. Hold what you have. Reinforcements come at dawn.',
    historicalFact: 'Pvt. John Steele\'s parachute caught the church steeple in Sainte-Mère-Église, leaving him hanging through the night. The town was the first French town liberated by Allied forces.',
    palette: { sky: '#1a2438', sky2: '#384058', ground: '#5a4838', ground2: '#3a2c20', horizon: '#1a1208', smoke: 'rgba(80,70,60,0.55)' },
    terrain: 'town',
    facts: [
      { title: 'John Steele', text: 'Steele played dead for two hours while hanging from the church spire. The Germans eventually cut him down and took him prisoner — he later escaped.' },
      { title: 'The Pathfinders', text: 'Pathfinder paratroopers jumped first to mark drop zones with lights. Many were scattered miles off-target by poor weather and anti-aircraft fire.' },
      { title: 'First Town Liberated', text: 'Sainte-Mère-Église became the first French town liberated on D-Day, secured around 04:30 by the 505th Parachute Infantry Regiment.' }
    ],
    quiz: {
      q: 'What happened to Pvt. John Steele during the drop on Sainte-Mère-Église?',
      options: ['He landed on the church and was killed', 'His parachute caught the church steeple and he hung there for hours', 'He led the assault on the German HQ', 'He was the first man into the town square'],
      correct: 1,
      explain: 'Steele\'s chute snagged the steeple of the Église Notre-Dame. He hung from the side of the church for about 2 hours playing dead before being taken prisoner.'
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
    hp: 55, speed: 7, dmg: 8, fireMs: 1600, accuracy: 0.65, range: 70, color: '#5a5550', accent: '#7a7570', helmet: 'stahl',
    score: 15
  },
  rifleman: {
    name: 'Wehrmacht Grenadier', weapon: 'Gewehr 43',
    hp: 85, speed: 9, dmg: 12, fireMs: 1100, accuracy: 0.72, range: 80, color: '#3a4a3a', accent: '#5a6850', helmet: 'stahl',
    score: 25
  },
  mg: {
    name: 'MG-42 Gunner', weapon: 'MG-42',
    hp: 140, speed: 4, dmg: 5, fireMs: 180, accuracy: 0.55, range: 90, color: '#3a3a48', accent: '#5a5060', helmet: 'stahl',
    burst: 5, score: 60
  },
  sniper: {
    name: 'Scharfschütze', weapon: 'K98k w/ Zeiss scope',
    hp: 65, speed: 6, dmg: 28, fireMs: 1900, accuracy: 0.92, range: 110, color: '#5a4848', accent: '#7a6868', helmet: 'cap',
    score: 70
  },
  ss: {
    name: 'Waffen-SS Trooper', weapon: 'MP 40',
    hp: 100, speed: 11, dmg: 10, fireMs: 380, accuracy: 0.7, range: 60, color: '#2a2a30', accent: '#48485a', helmet: 'stahl',
    burst: 3, score: 50
  },
  tank: {
    name: 'Panzer IV', weapon: '75mm KwK 40',
    hp: 700, speed: 3, dmg: 35, fireMs: 2200, accuracy: 0.85, range: 100, color: '#4a4a3a', accent: '#6a6a4a', helmet: 'none',
    isVehicle: true, score: 250
  },
  mg_nest: {
    name: 'MG-42 Bunker', weapon: 'Twin MG-42',
    hp: 480, speed: 0, dmg: 7, fireMs: 140, accuracy: 0.7, range: 130, color: '#3a3030', accent: '#5a4848', helmet: 'bunker',
    isStatic: true, score: 350
  },
  officer: {
    name: 'SS-Hauptsturmführer', weapon: 'MP 40 + Luger',
    hp: 850, speed: 8, dmg: 11, fireMs: 320, accuracy: 0.8, range: 70, color: '#3a2840', accent: '#7a5860', helmet: 'cap',
    burst: 4, score: 500
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
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function lerp(a, b, t) { return a + (b - a) * t; }

// ============================================================
// SCREEN ROUTING
// ============================================================

function go(screen, opts) {
  state.screen = screen;
  if (opts) Object.assign(state, opts);
  if (gameLoopId) { cancelAnimationFrame(gameLoopId); gameLoopId = 0; }
  if (game) { game.cleanup(); game = null; }
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
        <p class="dday-title-blurb">First-person rail shooter. Aim. Fire. Survive the waves. Learn the history.</p>
        <div class="dday-title-stats">
          <div><b>${state.best}</b><span>Best Score</span></div>
          <div><b>${state.unlocked}</b><span>Levels Unlocked</span></div>
          <div><b>${ROLE_ORDER.length}</b><span>Roles</span></div>
        </div>
        <button class="dday-btn dday-btn-primary" data-go="role">Deploy →</button>
        <div class="dday-title-hint">
          <kbd>Mouse</kbd> aim · <kbd>Click</kbd> fire · <kbd>R</kbd> reload · <kbd>Q</kbd> ability · <kbd>A/D</kbd> lean<br>
          Touch: tap to fire · drag to aim · button for ability
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
          <span>${w.mag} rnd mag · ${w.auto ? 'auto' : 'semi-auto'}</span>
        </div>
        <div class="dday-role-stats">
          <div><span>HP</span><div class="dday-stat-bar"><i style="width:${r.hp / 1.5}%"></i></div></div>
          <div><span>DMG</span><div class="dday-stat-bar"><i style="width:${clamp(w.dmg * 0.9, 10, 100)}%"></i></div></div>
          <div><span>RoF</span><div class="dday-stat-bar"><i style="width:${clamp(100 - w.fireMs / 12, 10, 100)}%"></i></div></div>
          <div><span>ACC</span><div class="dday-stat-bar"><i style="width:${clamp(100 - w.spread * 1500, 30, 100)}%"></i></div></div>
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
          <p>Survive ${l.waves} waves, then take down the position. Manual fire — aim with your cursor and click. Stay alive.</p>
        </div>
        <button class="dday-btn dday-btn-primary dday-btn-large" data-go="play">Engage</button>
      </div>
    </section>
  `;
  wireButtons();
}

// ============================================================
// GAMEPLAY
// ============================================================

let canvas, ctx;
let game = null;
let gameLoopId = 0;
let lastFrame = 0;
let keys = {};
let mouseX = 0, mouseY = 0;
let mouseDown = false;
let touchAim = false;

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
            <div class="dday-hud-compass">
              <div class="dday-hud-compass-strip" id="hud-compass">
                <span>W</span><span>NW</span><span class="north">N</span><span>NE</span><span>E</span>
              </div>
              <div class="dday-hud-compass-heading"><span id="hud-heading">315°</span></div>
            </div>
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
        <div class="dday-hud-enemy" id="hud-enemy"></div>
        <div class="dday-intel" id="dday-intel"></div>
      </div>
      <button class="dday-touch-ability" id="dday-touch-ability">${r.icon}</button>
      <button class="dday-touch-reload" id="dday-touch-reload">⟳</button>
      <button class="dday-pause" id="dday-pause">⏸</button>
      <div class="dday-toast" id="dday-toast"></div>
      <div class="dday-crosshair" id="dday-crosshair"></div>
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
  if (tAb) {
    tAb.addEventListener('click', e => { e.preventDefault(); if (game) game.useAbility(); });
  }
  if (tRl) {
    tRl.addEventListener('click', e => { e.preventDefault(); if (game) game.reload(); });
  }

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
// GAME CLASS — FIRST-PERSON RAIL SHOOTER
// ============================================================

class Game {
  constructor(role, level) {
    this.role = role;
    this.level = level;
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    // Camera / view
    this.lateral = 0; // -1 .. 1 (player lean / strafe)
    this.lateralTarget = 0;

    // Combat
    this.maxHp = role.hp;
    this.hp = role.hp;
    this.mag = role.weapon.mag;
    this.reserve = role.weapon.reserve;
    this.reloading = false;
    this.reloadTimer = 0;
    this.lastFire = 0;
    this.recoil = 0;
    this.firing = false;

    // Aim
    this.aimX = this.w / 2;
    this.aimY = this.h / 2;

    // Ability
    this.lastAbility = -99999;
    this.abilityActive = 0; // seconds remaining
    this.nextShotMul = 1;

    // Entities
    this.enemies = [];
    this.allies = []; // friendlies advancing alongside
    this.tracers = [];
    this.particles = [];
    this.floats = [];
    this.grenades = [];

    // Wave system
    this.wave = 1;
    this.waveAlive = 0;
    this.state = 'pre-wave';
    this.waveTimer = 1.8;
    this.bossSpawned = false;
    this.boss = null;

    // Scoring
    this.score = 0;
    this.kills = 0;
    this.factIndex = 0;

    // FX
    this.shake = 0;
    this.muzzleFlash = 0;
    this.flashHit = 0;

    // Persistent decor (smoke pillars, parallax)
    this.smokePillars = this.makeSmokePillars();
    this.parallax = this.makeParallax();
    this.allies = this.makeAllies();

    // Photorealistic AI backdrop (loaded in browser)
    this.backdrop = new Image();
    this.backdropReady = false;
    this.backdrop.onload = () => { this.backdropReady = true; };
    this.backdrop.onerror = () => { this.backdropReady = false; };
    this.backdrop.src = backdropURL(level.id);

    // Foreground burning Czech hedgehog (only on beach)
    this.fgHedgehog = level.terrain === 'beach';
    this.distantFlashTimer = 0;

    this.paused = false;
    this.over = false;
    this.time = 0;

    this.toast('Wave 1 incoming…', 1500);
  }

  cleanup() {
    window.removeEventListener('resize', resizeCanvas);
    canvas = null; ctx = null;
  }

  makeSmokePillars() {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        x: rand(-1.2, 1.2),
        z: rand(50, 90),
        h: rand(0.45, 0.7),
        wob: rand(0, 10),
        speed: rand(0.3, 0.8)
      });
    }
    return arr;
  }

  makeParallax() {
    const t = this.level.terrain;
    const arr = [];
    if (t === 'beach') {
      // Distant ships
      for (let i = 0; i < 4; i++) arr.push({ x: rand(-1.5, 1.5), z: 100, type: 'ship', size: rand(0.6, 1.1) });
    } else if (t === 'bocage') {
      for (let i = 0; i < 6; i++) arr.push({ x: rand(-1.5, 1.5), z: 70, type: 'tree', size: rand(0.7, 1.2) });
    } else if (t === 'cliffs') {
      for (let i = 0; i < 3; i++) arr.push({ x: rand(-1.5, 1.5), z: 90, type: 'cliff', size: rand(1.0, 1.6) });
    } else if (t === 'town') {
      for (let i = 0; i < 5; i++) arr.push({ x: rand(-1.5, 1.5), z: 60, type: 'building', size: rand(0.9, 1.4) });
      arr.push({ x: 0, z: 95, type: 'steeple', size: 1.8 });
    }
    return arr;
  }

  makeAllies() {
    // Guarantee one of each of the 10 squad roles is on screen.
    const arr = [];
    for (let i = 0; i < ALLY_ROLES.length; i++) {
      const role = ALLY_ROLES[i];
      arr.push({
        x: rand(-1.6, 1.6),
        z: rand(22, 55),
        role: role,
        anim: rand(0, 6),
        speed: rand(1.2, 2.6),
        alive: true,
        labelTimer: rand(0, 4) // staggered label appearance
      });
    }
    return arr;
  }

  pause() { this.paused = true; this.toast('Paused — click to resume', 99999); }
  resume() {
    this.paused = false;
    const el = document.getElementById('dday-toast');
    if (el) el.classList.remove('show');
    lastFrame = performance.now();
  }

  onResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
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

  // ---- WAVE / SPAWN ----

  spawnWave() {
    const baseCount = 4 + this.wave;
    const count = Math.round(baseCount * this.level.enemyCount);
    for (let i = 0; i < count; i++) {
      const type = this.pickEnemyType();
      const lane = (i % 3) - 1 + rand(-0.3, 0.3); // -1, 0, 1 with jitter
      const z = rand(70, 95);
      this.spawnEnemy(type, lane * 0.9, z);
    }
    this.waveAlive = count;
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

  spawnEnemy(typeId, x, z) {
    const t = ENEMY_TYPES[typeId];
    const hp = t.hp * this.level.enemyHP;
    this.enemies.push({
      typeId, type: t,
      x, z,
      hp, maxHp: hp,
      lastShot: 0,
      nextCoverStop: z - rand(20, 35), // they'll stop and shoot here
      stopped: false,
      stopUntil: 0,
      shootCount: 0,
      bobPhase: rand(0, Math.PI * 2),
      hitFlash: 0,
      dead: false,
      dying: 0,
      boss: false
    });
  }

  spawnBoss() {
    const b = this.level.boss;
    const t = ENEMY_TYPES[b.type];
    const e = {
      typeId: b.type, type: t,
      x: 0, z: 60,
      hp: b.hp, maxHp: b.hp,
      lastShot: 0,
      nextCoverStop: 25,
      stopped: false,
      stopUntil: 0,
      shootCount: 0,
      bobPhase: 0,
      hitFlash: 0,
      dead: false,
      dying: 0,
      boss: true
    };
    this.enemies.push(e);
    this.boss = e;
    this.bossSpawned = true;
    this.state = 'boss';
    this.toast('⚠ Boss approaching', 1800);
  }

  // ---- INPUT-DRIVEN ACTIONS ----

  tryFire() {
    if (this.over || this.paused) return;
    if (this.reloading) return;
    const w = this.role.weapon;
    if (this.mag <= 0) { this.reload(); return; }
    const now = this.time * 1000;
    if (now - this.lastFire < w.fireMs) return;
    this.lastFire = now;
    this.fire();
  }

  fire() {
    const w = this.role.weapon;
    this.mag--;
    const noRecoil = this.abilityActive > 0;
    let spread = w.spread + this.recoil * 0.002;
    if (this.role.id === 'paratrooper' && this.abilityActive > 0) spread = w.spread * 0.3;
    const aimNoise = spread * (1 + rand(-0.3, 0.3));
    const angX = rand(-aimNoise, aimNoise);
    const angY = rand(-aimNoise, aimNoise);
    // Convert screen-space aim to a ray hit
    const targetX = this.aimX + angX * this.w;
    const targetY = this.aimY + angY * this.h;
    let dmg = w.dmg * this.nextShotMul;
    this.nextShotMul = 1;
    if (this.role.id === 'heavy' && this.abilityActive > 0) dmg *= 2;
    const pierce = (this.role.id === 'sniper' && this.nextShotPierce);
    this.nextShotPierce = false;
    const hits = this.castShot(targetX, targetY, dmg, pierce);
    this.tracers.push({ x: targetX, y: targetY, age: 0 });
    this.muzzleFlash = 0.08;
    if (!noRecoil) this.recoil = Math.min(20, this.recoil + w.recoil);
    if (hits === 0) {
      // Miss
    }
    if (this.mag === 0) {
      this.toast('Out of ammo — press R', 900);
    }
    this.updateAmmoHUD();
  }

  castShot(sx, sy, dmg, pierce) {
    // Sort enemies front-to-back (smaller z first = closer)
    const candidates = [];
    for (const e of this.enemies) {
      if (e.dead) continue;
      const proj = this.projectEnemy(e);
      if (!proj) continue;
      const w = proj.w, h = proj.h;
      if (sx >= proj.cx - w / 2 && sx <= proj.cx + w / 2 &&
          sy >= proj.cy - h && sy <= proj.cy + h * 0.15) {
        candidates.push({ e, z: e.z });
      }
    }
    candidates.sort((a, b) => a.z - b.z);
    let hits = 0;
    for (const c of candidates) {
      this.hitEnemy(c.e, dmg);
      hits++;
      if (!pierce) break;
    }
    return hits;
  }

  hitEnemy(e, dmg) {
    e.hp -= dmg;
    e.hitFlash = 0.18;
    this.floats.push({ x: this.projectEnemy(e).cx, y: this.projectEnemy(e).cy - this.projectEnemy(e).h * 1.05, text: '' + Math.ceil(dmg), color: dmg >= 50 ? '#ffeb6a' : '#ffd95a', life: 0.7 });
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      e.dying = 0.6;
      this.score += e.boss ? 600 : e.type.score;
      this.kills++;
      this.flashHit = 0.1;
      const p = this.projectEnemy(e);
      if (p) {
        for (let i = 0; i < 14; i++) {
          this.particles.push({
            x: p.cx + rand(-10, 10), y: p.cy - p.h * 0.5 + rand(-10, 10),
            vx: rand(-40, 40), vy: rand(-60, -20),
            color: this.level.palette.smoke,
            size: rand(4, 10), life: rand(0.4, 0.8), maxLife: 0.8
          });
        }
      }
      this.updateScoreHUD();
    }
  }

  reload() {
    if (this.reloading) return;
    const w = this.role.weapon;
    if (this.mag === w.mag) return;
    if (this.reserve <= 0) { this.toast('No reserve ammo!', 900); return; }
    this.reloading = true;
    this.reloadTimer = w.reloadMs / 1000;
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
    } else if (r.id === 'paratrooper' || r.id === 'heavy') {
      this.abilityActive = 2.0;
      this.toast(r.id === 'heavy' ? 'Braced — ×2 damage' : 'Suppressing fire — no recoil', 1300);
    } else if (r.id === 'medic') {
      this.hp = Math.min(this.maxHp, this.hp + 60);
      this.floats.push({ x: this.w / 2, y: this.h * 0.6, text: '+60 HP', color: '#ff8080', life: 1 });
      this.updateHpHUD();
    } else if (r.id === 'ranger') {
      // Lob grenade at crosshair
      this.grenades.push({ ax: this.aimX, ay: this.aimY, t: 0, dur: 0.7, age: 0 });
    } else if (r.id === 'sniper') {
      this.nextShotPierce = true;
      this.nextShotMul = 1.5;
      this.toast('Piercing shot ready', 1300);
    }
  }

  // ---- UPDATE ----

  update(dt) {
    this.time += dt;

    // Lateral lean (A/D)
    let target = 0;
    if (keys['a'] || keys['arrowleft']) target -= 1;
    if (keys['d'] || keys['arrowright']) target += 1;
    this.lateralTarget = target;
    this.lateral = lerp(this.lateral, this.lateralTarget, Math.min(1, dt * 6));

    // Recoil decay
    this.recoil = Math.max(0, this.recoil - dt * 60);

    // Muzzle flash
    if (this.muzzleFlash > 0) this.muzzleFlash -= dt;
    if (this.flashHit > 0) this.flashHit -= dt;

    // Abilities
    if (this.abilityActive > 0) {
      this.abilityActive -= dt;
      if (this.role.id === 'paratrooper' && this.firing) {
        this.tryFire(); // auto-fire during ability
      }
    }

    // Reloading
    if (this.reloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const w = this.role.weapon;
        const need = w.mag - this.mag;
        const take = Math.min(need, this.reserve);
        this.mag += take;
        this.reserve -= take;
        this.reloading = false;
        const el = document.getElementById('hud-reload');
        if (el) el.classList.remove('show');
        this.updateAmmoHUD();
      }
    }

    // Auto-fire when mouse held for auto weapons
    if (this.firing && this.role.weapon.auto && !this.reloading) {
      this.tryFire();
    }

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
      if (!this.boss || this.boss.dead) {
        this.win();
        return;
      }
    }

    // Enemies
    for (const e of this.enemies) this.updateEnemy(e, dt);
    this.enemies = this.enemies.filter(e => !(e.dead && e.dying <= 0));

    // Tracers
    for (const t of this.tracers) t.age += dt;
    this.tracers = this.tracers.filter(t => t.age < 0.12);

    // Particles
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 30 * dt;
      p.vx *= 0.96; p.vy *= 0.96;
      p.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Floats
    for (const f of this.floats) { f.life -= dt; f.y -= dt * 40; }
    this.floats = this.floats.filter(f => f.life > 0);

    // Grenades
    for (const g of this.grenades) this.updateGrenade(g, dt);
    this.grenades = this.grenades.filter(g => g.age < g.dur + 0.5);

    // Allies advance slowly
    for (const a of this.allies) {
      if (!a.alive) continue;
      a.z -= a.speed * dt;
      a.anim += dt * 3;
      if (a.z < 6) a.alive = false; // they walked past us, swap with new spawn
    }
    // Replenish fallen allies occasionally
    if (this.allies.filter(a => a.alive).length < 4 && Math.random() < dt * 0.5) {
      this.allies.push({ x: rand(-1.4, 1.4), z: rand(40, 60), type: 'ally', anim: rand(0, 6), speed: rand(1.5, 3), alive: true });
    }
    this.allies = this.allies.filter(a => a.alive || a.z > 6);

    // Smoke pillars drift
    for (const s of this.smokePillars) { s.wob += dt * s.speed; }

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

    // Enemy hover label
    const labelEl = document.getElementById('hud-enemy');
    let hovered = null;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const p = this.projectEnemy(e);
      if (!p) continue;
      const w = p.w, h = p.h;
      if (this.aimX >= p.cx - w / 2 && this.aimX <= p.cx + w / 2 &&
          this.aimY >= p.cy - h && this.aimY <= p.cy + h * 0.15) {
        if (!hovered || e.z < hovered.z) hovered = e;
      }
    }
    if (hovered && labelEl) {
      labelEl.innerHTML = `<b>${escapeHtml(hovered.type.name)}</b><span>${escapeHtml(hovered.type.weapon)}</span>`;
      labelEl.classList.add('show');
    } else if (labelEl) {
      labelEl.classList.remove('show');
    }

    // Boss HP bar
    if (this.boss && !this.boss.dead) {
      let bossEl = document.getElementById('dday-boss-bar');
      if (!bossEl) {
        bossEl = document.createElement('div');
        bossEl.id = 'dday-boss-bar';
        bossEl.className = 'dday-boss-bar';
        bossEl.innerHTML = '<span></span><i></i>';
        document.querySelector('.dday-play').appendChild(bossEl);
      }
      bossEl.querySelector('span').textContent = (this.boss.type.name) + ' — ' + Math.ceil(this.boss.hp);
      bossEl.querySelector('i').style.width = (this.boss.hp / this.boss.maxHp * 100) + '%';
    } else {
      const bossEl = document.getElementById('dday-boss-bar');
      if (bossEl) bossEl.remove();
    }

    // Update crosshair
    const ch = document.getElementById('dday-crosshair');
    if (ch) {
      ch.style.left = this.aimX + 'px';
      ch.style.top = this.aimY + 'px';
      ch.classList.toggle('over-enemy', !!hovered);
    }

    // Compass — shifts subtly with lateral lean and aim X
    const compass = document.getElementById('hud-compass');
    if (compass) {
      const aimOff = (this.aimX / this.w - 0.5) * 30;
      const leanOff = this.lateral * 12;
      compass.style.transform = `translateX(${-(aimOff + leanOff)}px)`;
    }
    const heading = document.getElementById('hud-heading');
    if (heading) {
      const base = 315; // facing NW (typical D-Day inland)
      const adj = (this.aimX / this.w - 0.5) * 60 + this.lateral * 20;
      const deg = Math.round((base + adj + 360) % 360);
      heading.textContent = deg.toString().padStart(3, '0') + '°';
    }
  }

  showIntelFact() {
    const facts = this.level.facts;
    if (!facts || facts.length === 0) return;
    const f = facts[this.factIndex % facts.length];
    this.factIndex++;
    this.intel(f);
  }

  updateEnemy(e, dt) {
    if (e.dead) {
      e.dying -= dt;
      return;
    }
    if (e.hitFlash > 0) e.hitFlash -= dt;
    e.bobPhase += dt * 5;
    const speed = e.type.speed;
    const now = this.time * 1000;

    if (e.type.isStatic) {
      // Bunkers don't advance
    } else if (e.stopped && now < e.stopUntil) {
      // Standing still while shooting
    } else {
      // Advance toward us
      e.z = Math.max(8, e.z - speed * dt);
      if (e.z <= e.nextCoverStop && !e.stopped) {
        e.stopped = true;
        e.stopUntil = now + rand(1500, 2800);
        e.nextCoverStop = Math.max(8, e.z - rand(15, 25));
      } else if (e.stopped && now >= e.stopUntil) {
        e.stopped = false;
      }
    }

    // Reach point-blank = damage player & retreat
    if (e.z <= 9 && !e.type.isStatic) {
      this.damagePlayer(e.type.dmg * 1.2 * dt);
    }

    // Fire at player
    if (e.z < e.type.range && now - e.lastShot > e.type.fireMs) {
      const burst = e.type.burst || 1;
      e.lastShot = now;
      for (let i = 0; i < burst; i++) {
        setTimeout(() => {
          if (e.dead || !game || game.over) return;
          this.enemyShoot(e);
        }, i * 90);
      }
    }
  }

  enemyShoot(e) {
    // Compute hit chance: closer = more accurate
    const ranged = clamp(1 - e.z / e.type.range, 0.1, 1.0);
    const acc = e.type.accuracy * ranged;
    const hit = Math.random() < acc * (this.lateral * 0.5 + 0.7); // lateral lean reduces hit chance
    const p = this.projectEnemy(e);
    if (p) {
      this.particles.push({
        x: p.cx, y: p.cy - p.h * 0.45,
        vx: 0, vy: 0,
        color: '#ffeb88',
        size: 14, life: 0.08, maxLife: 0.08
      });
    }
    if (hit) {
      this.damagePlayer(e.type.dmg * (e.boss ? 1.3 : 1));
    } else {
      // miss — sound it nearby (just shake a tiny bit)
      this.shake = Math.max(this.shake, 0.06);
    }
  }

  damagePlayer(dmg) {
    if (this.over) return;
    this.hp = Math.max(0, this.hp - dmg);
    this.shake = Math.min(0.35, this.shake + 0.1);
    this.flashHit = 0.15;
    this.updateHpHUD();
    if (this.hp <= 0) this.lose();
  }

  updateHpHUD() {
    const hpEl = document.getElementById('hud-hp');
    const tEl = document.getElementById('hud-hp-text');
    if (hpEl) hpEl.style.width = (this.hp / this.maxHp * 100) + '%';
    if (tEl) tEl.textContent = Math.max(0, Math.ceil(this.hp));
  }
  updateAmmoHUD() {
    const m = document.getElementById('hud-mag');
    const r = document.getElementById('hud-reserve');
    if (m) m.textContent = this.mag;
    if (r) r.textContent = this.reserve;
  }
  updateScoreHUD() {
    const s = document.getElementById('hud-score');
    if (s) s.textContent = this.score;
  }

  updateGrenade(g, dt) {
    g.age += dt;
    if (g.age >= g.dur && !g.exploded) {
      g.exploded = true;
      // AoE damage at screen point — check which enemies project near g.ax/ay
      const R = Math.min(this.w, this.h) * 0.18;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const p = this.projectEnemy(e);
        if (!p) continue;
        const dx = p.cx - g.ax, dy = (p.cy - p.h * 0.5) - g.ay;
        if (Math.sqrt(dx * dx + dy * dy) < R) {
          this.hitEnemy(e, 100);
        }
      }
      // FX
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(40, 200);
        this.particles.push({
          x: g.ax, y: g.ay,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          color: ['#ffaa44', '#ff7030', '#ffffff'][Math.floor(Math.random() * 3)],
          size: rand(6, 14), life: rand(0.4, 0.8), maxLife: 0.8
        });
      }
      this.shake = 0.4;
    }
  }

  // ---- PROJECTION ----

  projectEnemy(e) {
    const z = e.z;
    if (z <= 0) return null;
    const scale = 700 / z;
    const baseSize = e.type.isVehicle ? 0.9 : (e.type.isStatic ? 1.1 : 0.55);
    const sizePx = baseSize * scale;
    const w = sizePx;
    const h = sizePx * 1.8;
    // Horizon at 0.45 of screen height
    const horizon = this.h * 0.5;
    const lateralOffset = -this.lateral * (this.w * 0.04);
    const cx = this.w / 2 + (e.x / z) * 1100 + lateralOffset;
    const groundY = horizon + 1000 / z;
    const cy = groundY;
    return { cx, cy, w, h, scale };
  }

  projectAlly(a) {
    if (a.z <= 0) return null;
    const scale = 700 / a.z;
    const sizePx = 0.5 * scale;
    const horizon = this.h * 0.5;
    const lateralOffset = -this.lateral * (this.w * 0.04);
    const cx = this.w / 2 + (a.x / a.z) * 1100 + lateralOffset;
    const groundY = horizon + 1000 / a.z;
    return { cx, cy: groundY, scale, sizePx };
  }

  projectParallax(p) {
    if (p.z <= 0) return null;
    const scale = 800 / p.z;
    const horizon = this.h * 0.5;
    const lateralOffset = -this.lateral * (this.w * 0.015);
    const cx = this.w / 2 + (p.x * 800 / p.z) + lateralOffset;
    return { cx, cy: horizon, scale };
  }

  // ---- RENDER ----

  render(ctx) {
    const W = this.w, H = this.h;
    let sx = 0, sy = 0;
    if (this.shake > 0) {
      sx = rand(-this.shake * 14, this.shake * 14);
      sy = rand(-this.shake * 14, this.shake * 14);
      this.shake = Math.max(0, this.shake - 0.04);
    }
    ctx.save();
    ctx.translate(sx, sy);

    this.drawSky(ctx);
    this.drawGround(ctx);
    this.drawDistantFlashes(ctx);
    this.drawParallax(ctx);
    this.drawSmokePillars(ctx);
    this.drawAllies(ctx);
    this.drawEnemies(ctx);
    this.drawGrenades(ctx);
    this.drawParticles(ctx);
    this.drawTracers(ctx);
    this.drawForegroundProps(ctx);
    this.drawForeground(ctx);
    this.drawGun(ctx);
    this.drawFloats(ctx);
    this.drawHitFlash(ctx);

    ctx.restore();
  }

  drawSky(ctx) {
    // Photo backdrop covers the whole frame; gradient sky shows through where image is transparent.
    if (this.backdropReady && this.backdrop && this.backdrop.naturalWidth > 0) {
      // Subtle parallax based on lateral lean
      const off = -this.lateral * 22;
      const scale = 1.06;
      const dw = this.w * scale;
      const dh = this.h * scale;
      ctx.drawImage(this.backdrop, off - dw * 0.03, -dh * 0.03, dw, dh);
      // Light color grading overlay to match the level palette
      const p = this.level.palette;
      ctx.fillStyle = `rgba(${parseInt(p.sky.slice(1, 3), 16)},${parseInt(p.sky.slice(3, 5), 16)},${parseInt(p.sky.slice(5, 7), 16)},0.12)`;
      ctx.fillRect(0, 0, this.w, this.h);
    } else {
      const p = this.level.palette;
      const horizon = this.h * 0.5;
      const grad = ctx.createLinearGradient(0, 0, 0, horizon);
      grad.addColorStop(0, p.sky);
      grad.addColorStop(1, p.sky2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.w, horizon);
    }
  }

  drawGround(ctx) {
    if (this.backdropReady && this.backdrop && this.backdrop.naturalWidth > 0) {
      return; // already covered by photo backdrop
    }
    const p = this.level.palette;
    const horizon = this.h * 0.5;
    const grad = ctx.createLinearGradient(0, horizon, 0, this.h);
    grad.addColorStop(0, p.ground);
    grad.addColorStop(1, p.ground2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, horizon, this.w, this.h - horizon);
    ctx.fillStyle = p.horizon;
    ctx.fillRect(0, horizon, this.w, 3);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(this.w / 2 + i * 30, horizon);
      ctx.lineTo(this.w / 2 + i * 200, this.h);
      ctx.stroke();
    }
  }

  drawForegroundProps(ctx) {
    // Burning Czech hedgehog at lower-left foreground (beach only)
    if (!this.fgHedgehog) return;
    const sw = Math.min(this.w, 1000);
    const cx = this.w * 0.18 + this.lateral * 12;
    const cy = this.h * 0.86;
    const sc = sw * 0.0009;
    ctx.save();
    ctx.translate(cx, cy);
    // Flame glow base
    const flameWob = Math.sin(this.time * 12) * 4;
    const flameSz = 60 * sc + flameWob;
    const flameGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, flameSz * 2.5);
    flameGrad.addColorStop(0, 'rgba(255, 180, 80, 0.85)');
    flameGrad.addColorStop(0.4, 'rgba(255, 100, 30, 0.45)');
    flameGrad.addColorStop(1, 'rgba(40, 10, 0, 0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath(); ctx.ellipse(0, 0, flameSz * 2, flameSz * 1.4, 0, 0, Math.PI * 2); ctx.fill();
    // Hedgehog beams
    const sz = 80 * sc;
    ctx.strokeStyle = '#1a0e06';
    ctx.lineWidth = 6 * sc + 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-sz, sz * 0.6); ctx.lineTo(sz * 1.1, -sz * 1.1);
    ctx.moveTo(sz * 1.1, sz * 0.6); ctx.lineTo(-sz, -sz * 1.1);
    ctx.moveTo(0, -sz * 1.5); ctx.lineTo(0, sz * 0.7);
    ctx.stroke();
    // Flicker flames on top
    ctx.fillStyle = 'rgba(255, 140, 40, ' + (0.6 + Math.sin(this.time * 18) * 0.3) + ')';
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + this.time * 3;
      const fr = flameSz * 0.7 + Math.sin(this.time * 10 + i) * 6;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 12, -10 + Math.sin(a) * 8, fr * 0.3, fr * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Foreground water splashes (animated)
    if (this.level.terrain === 'beach') {
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const t = (this.time * 1.2 + i * 0.7) % 2;
        const x = (i / 8) * this.w + Math.sin(i + this.time) * 30;
        const y = this.h * 0.72 - t * 80;
        const a = clamp(1 - t / 2, 0, 1);
        ctx.fillStyle = `rgba(220, 230, 240, ${a * 0.7})`;
        ctx.beginPath(); ctx.ellipse(x, y, 4 + t * 2, 4 + t * 2, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  drawDistantFlashes(ctx) {
    // Occasional artillery flash on the horizon
    this.distantFlashTimer -= 0.016;
    if (this.distantFlashTimer <= 0) {
      this.distantFlashTimer = rand(1.6, 4.2);
      this._flashX = rand(0.15, 0.85) * this.w;
      this._flashY = this.h * 0.48;
      this._flashAge = 0.4;
    }
    if (this._flashAge > 0) {
      this._flashAge -= 0.02;
      const a = clamp(this._flashAge / 0.4, 0, 1);
      const g = ctx.createRadialGradient(this._flashX, this._flashY, 4, this._flashX, this._flashY, 120);
      g.addColorStop(0, `rgba(255, 220, 150, ${a * 0.85})`);
      g.addColorStop(1, 'rgba(255, 100, 30, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(this._flashX - 130, this._flashY - 130, 260, 260);
    }
  }

  drawParallax(ctx) {
    for (const p of this.parallax) {
      const proj = this.projectParallax(p);
      if (!proj) continue;
      const sc = proj.scale * p.size * 0.4;
      ctx.save();
      ctx.translate(proj.cx, proj.cy);
      if (p.type === 'ship') {
        ctx.fillStyle = 'rgba(40,40,50,0.85)';
        ctx.fillRect(-40 * sc, -10 * sc, 80 * sc, 8 * sc);
        ctx.fillRect(-12 * sc, -22 * sc, 6 * sc, 12 * sc);
      } else if (p.type === 'tree') {
        ctx.fillStyle = 'rgba(30,40,20,0.85)';
        ctx.beginPath();
        ctx.arc(0, -16 * sc, 14 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3a2418';
        ctx.fillRect(-2 * sc, -4 * sc, 4 * sc, 8 * sc);
      } else if (p.type === 'cliff') {
        ctx.fillStyle = 'rgba(60,55,48,0.85)';
        ctx.beginPath();
        ctx.moveTo(-30 * sc, 0);
        ctx.lineTo(-26 * sc, -28 * sc);
        ctx.lineTo(0, -36 * sc);
        ctx.lineTo(26 * sc, -30 * sc);
        ctx.lineTo(30 * sc, 0);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'building') {
        ctx.fillStyle = 'rgba(80,70,60,0.85)';
        ctx.fillRect(-18 * sc, -22 * sc, 36 * sc, 24 * sc);
        ctx.fillStyle = 'rgba(50,40,30,0.6)';
        ctx.beginPath();
        ctx.moveTo(-20 * sc, -22 * sc);
        ctx.lineTo(0, -32 * sc);
        ctx.lineTo(20 * sc, -22 * sc);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#1a1208';
        for (let i = -1; i <= 1; i++) ctx.fillRect((-6 + i * 8) * sc, -16 * sc, 4 * sc, 6 * sc);
      } else if (p.type === 'steeple') {
        ctx.fillStyle = 'rgba(80,70,60,0.85)';
        ctx.fillRect(-12 * sc, -30 * sc, 24 * sc, 32 * sc);
        ctx.fillStyle = '#5a4838';
        ctx.beginPath();
        ctx.moveTo(-14 * sc, -30 * sc);
        ctx.lineTo(0, -54 * sc);
        ctx.lineTo(14 * sc, -30 * sc);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
  }

  drawSmokePillars(ctx) {
    const horizon = this.h * 0.5;
    for (const s of this.smokePillars) {
      const scale = 800 / s.z;
      const cx = this.w / 2 + (s.x * 800 / s.z) + (-this.lateral * this.w * 0.02);
      const h = this.h * s.h * (scale / 12);
      const w = 80 * (scale / 12);
      const baseY = horizon + 800 / s.z * 0.5;
      for (let i = 0; i < 6; i++) {
        const t = i / 6;
        const y = baseY - h * t;
        const wb = w * (1 + t * 0.6) + Math.sin(s.wob + i) * 3;
        ctx.fillStyle = `rgba(50,40,30,${0.5 - t * 0.35})`;
        ctx.beginPath();
        ctx.ellipse(cx + Math.sin(s.wob + i * 0.4) * 4, y, wb, h / 6 + 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawAllies(ctx) {
    const sorted = this.allies.filter(a => a.alive).slice().sort((a, b) => b.z - a.z);
    for (const a of sorted) {
      const p = this.projectAlly(a);
      if (!p) continue;
      const role = a.role;
      const sz = p.sizePx * 0.6;
      // Officer wears a cap, not helmet
      const helmet = role.id === 'officer' ? 'cap' : 'helmet';
      this.drawSoldier(ctx, p.cx, p.cy, sz, role.color, '#88c46a', helmet, false, a.anim);
      // Role-specific extras
      ctx.save();
      ctx.translate(p.cx, p.cy);
      if (role.extra === 'cross') {
        // Red cross on medic
        ctx.fillStyle = '#c83030';
        ctx.fillRect(-sz * 0.08, -sz * 0.85, sz * 0.16, sz * 0.05);
        ctx.fillRect(-sz * 0.03, -sz * 0.92, sz * 0.06, sz * 0.18);
      } else if (role.extra === 'antenna') {
        // Whip antenna from back
        ctx.strokeStyle = '#1a1008';
        ctx.lineWidth = Math.max(1, sz * 0.04);
        ctx.beginPath();
        ctx.moveTo(sz * 0.2, -sz * 0.5);
        ctx.lineTo(sz * 0.5, -sz * 2.0);
        ctx.stroke();
      } else if (role.extra === 'flag') {
        // Flag pole + small flag
        ctx.strokeStyle = '#3a2a18';
        ctx.lineWidth = Math.max(1, sz * 0.05);
        ctx.beginPath();
        ctx.moveTo(sz * 0.4, -sz * 0.4);
        ctx.lineTo(sz * 0.5, -sz * 1.8);
        ctx.stroke();
        ctx.fillStyle = '#c83030';
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, -sz * 1.8);
        ctx.lineTo(sz * 1.0, -sz * 1.55);
        ctx.lineTo(sz * 0.5, -sz * 1.4);
        ctx.closePath();
        ctx.fill();
      } else if (role.extra === 'tube') {
        // Bangalore tube
        ctx.fillStyle = '#1a1008';
        ctx.fillRect(-sz * 0.5, -sz * 0.4, sz * 1.4, sz * 0.06);
      } else if (role.extra === 'pack') {
        // Big backpack
        ctx.fillStyle = '#3a2a18';
        ctx.fillRect(-sz * 0.4, -sz * 0.9, sz * 0.3, sz * 0.55);
      } else if (role.extra === 'cap') {
        // Officer also wears insignia; cap already drawn by helmet=cap above
        ctx.fillStyle = '#d4a13a';
        ctx.fillRect(sz * 0.1, -sz * 0.85, sz * 0.06, sz * 0.06);
      }
      ctx.restore();
      // Role label
      const label = role.icon + ' ' + role.name;
      const fontSize = Math.max(10, Math.min(16, sz * 0.45));
      ctx.save();
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      const textW = ctx.measureText(label).width + 10;
      const labelY = p.cy - p.sizePx * 1.65;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(p.cx - textW / 2, labelY - fontSize + 2, textW, fontSize + 6);
      ctx.fillStyle = '#88c46a';
      ctx.fillText(label, p.cx, labelY);
      ctx.restore();
    }
  }

  drawEnemies(ctx) {
    const sorted = this.enemies.slice().sort((a, b) => b.z - a.z);
    for (const e of sorted) {
      const p = this.projectEnemy(e);
      if (!p) continue;
      const sz = p.w;
      if (e.dying > 0) {
        ctx.save();
        ctx.globalAlpha = e.dying * 1.5;
        this.drawSoldier(ctx, p.cx, p.cy + (1 - e.dying) * sz * 0.4, sz * 0.7, e.type.color, e.type.accent, e.type.helmet, e.hitFlash > 0, e.bobPhase, true);
        ctx.restore();
        continue;
      }
      if (e.type.isStatic && e.type.helmet === 'bunker') {
        this.drawBunker(ctx, p.cx, p.cy, sz, e);
      } else if (e.type.isVehicle) {
        this.drawTank(ctx, p.cx, p.cy, sz, e);
      } else {
        this.drawSoldier(ctx, p.cx, p.cy, sz * 0.7, e.type.color, e.type.accent, e.type.helmet, e.hitFlash > 0, e.bobPhase);
      }
      // HP bar
      if (e.hp < e.maxHp || e.boss) {
        const barW = sz * 0.9;
        const y = p.cy - p.h * 1.05;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(p.cx - barW / 2, y, barW, 4);
        ctx.fillStyle = e.boss ? '#c83040' : '#80c060';
        ctx.fillRect(p.cx - barW / 2, y, barW * (e.hp / e.maxHp), 4);
      }
    }
  }

  drawSoldier(ctx, cx, cy, sz, color, accent, helmetType, flash, anim, dying) {
    const bob = Math.sin(anim || 0) * sz * 0.04;
    ctx.save();
    ctx.translate(cx, cy + bob);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(0, 4, sz * 0.55, sz * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    // Legs
    ctx.fillStyle = flash ? '#fff' : color;
    ctx.fillRect(-sz * 0.18, -sz * 0.4, sz * 0.16, sz * 0.5);
    ctx.fillRect(sz * 0.02, -sz * 0.4, sz * 0.16, sz * 0.5);
    // Body
    ctx.fillStyle = flash ? '#fff' : color;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.7, sz * 0.42, sz * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = Math.max(1, sz * 0.04);
    ctx.stroke();
    // Head
    ctx.fillStyle = '#c89878';
    ctx.beginPath();
    ctx.arc(0, -sz * 1.3, sz * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = Math.max(1, sz * 0.03);
    ctx.stroke();
    // Helmet
    ctx.fillStyle = flash ? '#fff' : accent;
    if (helmetType === 'stahl') {
      // German Stahlhelm — wider, flares out
      ctx.beginPath();
      ctx.ellipse(0, -sz * 1.42, sz * 0.42, sz * 0.22, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(sz * 0.35, -sz * 1.34);
      ctx.lineTo(-sz * 0.35, -sz * 1.34);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1a1008'; ctx.stroke();
    } else if (helmetType === 'helmet') {
      // US M1
      ctx.beginPath();
      ctx.ellipse(0, -sz * 1.42, sz * 0.36, sz * 0.22, 0, Math.PI, Math.PI * 2);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1a1008'; ctx.stroke();
    } else if (helmetType === 'cap') {
      // Officer cap
      ctx.fillRect(-sz * 0.32, -sz * 1.5, sz * 0.64, sz * 0.16);
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(-sz * 0.34, -sz * 1.36, sz * 0.68, sz * 0.04);
    }
    // Gun (sticking out to one side)
    if (!dying) {
      ctx.fillStyle = '#2a1a0c';
      ctx.fillRect(sz * 0.3, -sz * 0.85, sz * 0.6, sz * 0.08);
    }
    // Eyes
    ctx.fillStyle = '#1a1008';
    ctx.beginPath(); ctx.arc(-sz * 0.1, -sz * 1.3, sz * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sz * 0.1, -sz * 1.3, sz * 0.04, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  drawBunker(ctx, cx, cy, sz, e) {
    ctx.save();
    ctx.translate(cx, cy);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(0, sz * 0.05, sz * 1.0, sz * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    // Concrete pillbox
    ctx.fillStyle = e.hitFlash > 0 ? '#fff' : '#5a5048';
    ctx.fillRect(-sz * 0.9, -sz * 1.2, sz * 1.8, sz * 1.3);
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 2; ctx.strokeRect(-sz * 0.9, -sz * 1.2, sz * 1.8, sz * 1.3);
    // Embrasure (gun slit)
    ctx.fillStyle = '#0a0604';
    ctx.fillRect(-sz * 0.6, -sz * 0.75, sz * 1.2, sz * 0.22);
    // MG barrel
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-sz * 0.05, -sz * 0.7, sz * 0.5, sz * 0.08);
    // Roof
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(-sz * 1.0, -sz * 1.3, sz * 2.0, sz * 0.12);
    ctx.restore();
  }

  drawTank(ctx, cx, cy, sz, e) {
    ctx.save();
    ctx.translate(cx, cy);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(0, sz * 0.05, sz * 1.1, sz * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    // Hull
    ctx.fillStyle = e.hitFlash > 0 ? '#fff' : '#4a4a3a';
    ctx.fillRect(-sz * 1.0, -sz * 0.55, sz * 2.0, sz * 0.55);
    // Tracks
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-sz * 1.05, -sz * 0.1, sz * 2.1, sz * 0.18);
    // Turret
    ctx.fillStyle = e.hitFlash > 0 ? '#fff' : '#5a5a4a';
    ctx.fillRect(-sz * 0.6, -sz * 1.0, sz * 1.2, sz * 0.45);
    // Gun barrel
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-sz * 0.05, -sz * 0.85, sz * 1.3, sz * 0.08);
    // Cross / insignia
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-sz * 0.55, -sz * 0.4, sz * 0.18, sz * 0.04);
    ctx.fillRect(-sz * 0.48, -sz * 0.5, sz * 0.04, sz * 0.18);
    ctx.restore();
  }

  drawGrenades(ctx) {
    for (const g of this.grenades) {
      if (g.exploded) continue;
      const p = clamp(g.age / g.dur, 0, 1);
      // Arc from bottom-center to ax/ay
      const startX = this.w / 2;
      const startY = this.h - 80;
      const x = lerp(startX, g.ax, p);
      const y = lerp(startY, g.ay, p) - Math.sin(p * Math.PI) * 80;
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

  drawTracers(ctx) {
    for (const t of this.tracers) {
      const a = 1 - t.age / 0.12;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = '#ffeb88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffeb88';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(this.w / 2, this.h - 80);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawForeground(ctx) {
    // Subtle vignette
    const grad = ctx.createRadialGradient(this.w / 2, this.h / 2, this.h * 0.3, this.w / 2, this.h / 2, this.h * 0.9);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  drawGun(ctx) {
    const sw = Math.min(this.w, 900);
    const sh = sw * 0.55;
    const cx = this.w / 2 + this.lateral * 30;
    const cy = this.h + sh * 0.18 - this.recoil * 1.8;
    ctx.save();
    ctx.translate(cx, cy);

    // Left sleeve (olive)
    ctx.fillStyle = '#4a5a38';
    ctx.beginPath();
    ctx.moveTo(-sw * 0.5, sh * 0.2);
    ctx.lineTo(-sw * 0.42, -sh * 0.05);
    ctx.lineTo(-sw * 0.2, -sh * 0.12);
    ctx.lineTo(-sw * 0.12, sh * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 2; ctx.stroke();

    // Right sleeve
    ctx.fillStyle = '#4a5a38';
    ctx.beginPath();
    ctx.moveTo(sw * 0.5, sh * 0.2);
    ctx.lineTo(sw * 0.42, -sh * 0.0);
    ctx.lineTo(sw * 0.15, -sh * 0.1);
    ctx.lineTo(sw * 0.05, sh * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.stroke();

    // Hands (gloves)
    ctx.fillStyle = '#5a4028';
    ctx.beginPath();
    ctx.ellipse(-sw * 0.25, -sh * 0.05, sw * 0.07, sh * 0.06, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(sw * 0.1, -sh * 0.08, sw * 0.07, sh * 0.06, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Rifle stock
    ctx.fillStyle = '#4a3420';
    ctx.beginPath();
    ctx.moveTo(sw * 0.1, sh * 0.0);
    ctx.lineTo(sw * 0.32, -sh * 0.06);
    ctx.lineTo(sw * 0.34, sh * 0.05);
    ctx.lineTo(sw * 0.12, sh * 0.12);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Receiver
    ctx.fillStyle = '#3a2818';
    ctx.fillRect(-sw * 0.05, -sh * 0.1, sw * 0.16, sh * 0.07);
    ctx.strokeRect(-sw * 0.05, -sh * 0.1, sw * 0.16, sh * 0.07);

    // Barrel — extends up + away
    ctx.fillStyle = '#2a2418';
    ctx.beginPath();
    ctx.moveTo(-sw * 0.05, -sh * 0.05);
    ctx.lineTo(-sw * 0.25, -sh * 0.32);
    ctx.lineTo(-sw * 0.22, -sh * 0.34);
    ctx.lineTo(-sw * 0.02, -sh * 0.08);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#0a0604'; ctx.stroke();

    // Front sight
    ctx.fillStyle = '#0a0604';
    ctx.fillRect(-sw * 0.27, -sh * 0.36, sw * 0.02, sh * 0.05);

    // Muzzle flash
    if (this.muzzleFlash > 0) {
      const a = this.muzzleFlash / 0.08;
      ctx.save();
      ctx.translate(-sw * 0.25, -sh * 0.36);
      ctx.fillStyle = `rgba(255,235,140,${a})`;
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const ang = i / 12 * Math.PI * 2;
        const r = sw * (0.05 + Math.random() * 0.05);
        if (i === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
        else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  drawFloats(ctx) {
    for (const f of this.floats) {
      ctx.save();
      ctx.globalAlpha = clamp(f.life, 0, 1);
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }
  }

  drawHitFlash(ctx) {
    if (this.flashHit > 0) {
      ctx.fillStyle = `rgba(180,30,30,${this.flashHit * 2})`;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    // Low-HP red overlay
    if (this.hp / this.maxHp < 0.35) {
      const a = (0.35 - this.hp / this.maxHp) / 0.35;
      const grad = ctx.createRadialGradient(this.w / 2, this.h / 2, this.h * 0.2, this.w / 2, this.h / 2, this.h * 0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(180,30,30,${a * 0.5})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.w, this.h);
    }
  }

  win() {
    if (this.over) return;
    this.over = true;
    state.score = this.score;
    state.wave = this.wave;
    state.kills = this.kills;
    if (this.score > state.best) {
      state.best = this.score;
      localStorage.setItem('dday_best', state.best);
    }
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
    state.score = this.score;
    state.wave = this.wave;
    state.kills = this.kills;
    if (this.score > state.best) {
      state.best = this.score;
      localStorage.setItem('dday_best', state.best);
    }
    setTimeout(() => go('lose'), 700);
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
  canvas.addEventListener('mouseleave', () => { mouseDown = false; if (game) game.firing = false; });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // Touch
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });
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

function onMouseMove(e) {
  mouseX = e.clientX; mouseY = e.clientY;
  if (game) { game.aimX = mouseX; game.aimY = mouseY; }
}
function onMouseDown(e) {
  mouseDown = true;
  if (game) {
    game.firing = true;
    game.tryFire();
  }
}
function onMouseUp() {
  mouseDown = false;
  if (game) game.firing = false;
}

let touchId = null;
function onTouchStart(e) {
  e.preventDefault();
  // Ignore touches on the floating buttons (they handle their own events)
  const t = e.changedTouches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  if (el && (el.id === 'dday-touch-ability' || el.id === 'dday-touch-reload' || el.id === 'dday-pause')) return;
  if (touchId === null) {
    touchId = t.identifier;
    if (game) {
      game.aimX = t.clientX;
      game.aimY = t.clientY;
      game.firing = true;
      game.tryFire();
    }
  }
}
function onTouchMove(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === touchId) {
      if (game) { game.aimX = t.clientX; game.aimY = t.clientY; }
    }
  }
}
function onTouchEnd(e) {
  for (const t of e.changedTouches) {
    if (t.identifier === touchId) {
      touchId = null;
      if (game) game.firing = false;
    }
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
  const options = quiz.options.map((opt, i) => `
    <button class="dday-quiz-opt" data-quiz="${i}">${escapeHtml(opt)}</button>
  `).join('');
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
