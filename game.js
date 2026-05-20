/* ============================================================
   D-DAY: BEACH ASSAULT
   Top-down arcade shooter — multiple roles, multiple levels.
   Stylised cartoon look (Brawl-Stars-ish). Pure vanilla JS,
   HTML5 Canvas. Works on desktop (WASD/arrows) and touch
   (virtual joystick). Auto-aim — focus on movement & dodging.
   ============================================================ */

const BUILD_VERSION = 'v5 · a161afa+';
console.log('%c[D-DAY: Beach Assault] build ' + BUILD_VERSION, 'color:#d4a13a;font-weight:bold');

(function () {
'use strict';

// ============================================================
// CONFIG — ROLES
// ============================================================

const ROLES = {
  rifleman: {
    id: 'rifleman',
    name: 'Rifleman',
    fullName: 'Pvt. James Miller',
    unit: '1st Infantry — Omaha Beach',
    icon: '🎯',
    color: '#4a8754',
    accent: '#88c46a',
    hp: 100,
    speed: 175,
    fireRate: 320,   // ms between shots
    damage: 28,
    bulletSpeed: 580,
    bulletColor: '#ffd95a',
    bulletSize: 5,
    range: 360,
    ability: { name: 'Aimed Shot', key: 'Q', cooldown: 7000, desc: '×3 damage piercing shot' },
    difficulty: 2,
    blurb: 'All-rounder with an M1 Garand. Balanced damage and range, no weaknesses, no surprises.'
  },
  paratrooper: {
    id: 'paratrooper',
    name: 'Paratrooper',
    fullName: 'Sgt. William O\'Connor',
    unit: '101st Airborne — Sainte-Mère-Église',
    icon: '🪂',
    color: '#6e7a3a',
    accent: '#c8d058',
    hp: 80,
    speed: 220,
    fireRate: 110,
    damage: 11,
    bulletSpeed: 520,
    bulletColor: '#ffaa44',
    bulletSize: 4,
    range: 280,
    spread: 0.18,
    ability: { name: 'Smoke Dash', key: 'Q', cooldown: 6000, desc: 'Sprint forward, briefly invincible' },
    difficulty: 3,
    blurb: 'Thompson SMG and a knack for speed. Hits often, hits soft. Get in close, stay alive.'
  },
  medic: {
    id: 'medic',
    name: 'Medic',
    fullName: 'Cpl. Samuel Cohen',
    unit: '4th Infantry — Utah Beach',
    icon: '⚕️',
    color: '#8a4040',
    accent: '#e07070',
    hp: 130,
    speed: 165,
    fireRate: 480,
    damage: 18,
    bulletSpeed: 520,
    bulletColor: '#ffd95a',
    bulletSize: 5,
    range: 320,
    ability: { name: 'Field Dressing', key: 'Q', cooldown: 9000, desc: 'Heal 60 HP instantly' },
    difficulty: 2,
    blurb: 'Tough body, soft punch. Self-heal turns close calls into close shaves.'
  },
  ranger: {
    id: 'ranger',
    name: 'Ranger',
    fullName: 'Cpl. Leonard Lomell',
    unit: '2nd Rangers — Pointe du Hoc',
    icon: '💣',
    color: '#4a5a78',
    accent: '#7090c0',
    hp: 90,
    speed: 180,
    fireRate: 380,
    damage: 22,
    bulletSpeed: 560,
    bulletColor: '#ffd95a',
    bulletSize: 5,
    range: 340,
    ability: { name: 'Grenade', key: 'Q', cooldown: 5500, desc: 'Throw a grenade that explodes on impact' },
    difficulty: 3,
    blurb: 'M1 carbine and a satchel of grenades. Crack open clusters of enemies in one bang.'
  },
  sniper: {
    id: 'sniper',
    name: 'Sniper',
    fullName: 'Sgt. Robert Watson',
    unit: '29th Infantry — Bocage',
    icon: '🔭',
    color: '#3a5a3a',
    accent: '#80a060',
    hp: 70,
    speed: 145,
    fireRate: 950,
    damage: 75,
    bulletSpeed: 950,
    bulletColor: '#f0f0ff',
    bulletSize: 4,
    range: 600,
    ability: { name: 'Piercing Shot', key: 'Q', cooldown: 8000, desc: 'One shot, goes through every enemy in line' },
    difficulty: 4,
    blurb: 'Springfield ’03. Slow, fragile, lethal. Keep your distance — or pay the price.'
  },
  heavy: {
    id: 'heavy',
    name: 'Heavy Gunner',
    fullName: 'Pvt. Dale Vandegrift',
    unit: '29th Infantry — Omaha Beach',
    icon: '⚙️',
    color: '#6a5028',
    accent: '#c89040',
    hp: 140,
    speed: 130,
    fireRate: 80,
    damage: 8,
    bulletSpeed: 500,
    bulletColor: '#ffaa44',
    bulletSize: 4,
    range: 300,
    spread: 0.22,
    ability: { name: 'Brace', key: 'Q', cooldown: 7000, desc: '2s of double damage & half knockback' },
    difficulty: 3,
    blurb: 'BAR automatic rifle. Walking thunder. Slow as a tank, hits like a hailstorm.'
  }
};

const ROLE_ORDER = ['rifleman', 'paratrooper', 'medic', 'ranger', 'sniper', 'heavy'];

// ============================================================
// CONFIG — LEVELS
// ============================================================

const LEVELS = [
  {
    id: 'omaha',
    name: 'Omaha Beach',
    subtitle: 'Easy Red Sector · 06:35',
    icon: '🌊',
    available: true,
    difficulty: 2,
    brief: 'You\'re off the Higgins boat. Sand, blood and machine-gun fire. Clear the seawall before the next wave lands.',
    historicalFact: 'Casualty rates on Omaha\'s first wave exceeded 50%. The 1st and 29th Divisions fought yard by yard up the bluffs.',
    waves: 3,
    enemyHP: 1.0,
    enemyCount: 1.0,
    palette: {
      sand: '#d8b67a',
      sandDark: '#b89858',
      water: '#3a6090',
      foliage: '#5a7848',
      stone: '#888076',
      blood: '#7a2020'
    },
    terrain: 'beach',
    boss: { type: 'mg_nest', hp: 480 },
    scoreGoal: 1000
  },
  {
    id: 'bocage',
    name: 'Bocage Country',
    subtitle: 'Hedgerows · 11:20',
    icon: '🌿',
    available: true,
    difficulty: 3,
    brief: 'Hedgerows ten feet tall. Germans dug in behind every one. Push through. Don\'t bunch up.',
    historicalFact: 'The Normandy hedgerows — bocage — were ancient earth banks topped with thick foliage. They forced US troops into yard-by-yard fighting for weeks.',
    waves: 4,
    enemyHP: 1.2,
    enemyCount: 1.2,
    palette: {
      sand: '#a8a060',
      sandDark: '#7a7040',
      water: '#3a6090',
      foliage: '#3a5a28',
      stone: '#706858',
      blood: '#7a2020'
    },
    terrain: 'bocage',
    boss: { type: 'tank', hp: 700 },
    scoreGoal: 1500
  },
  {
    id: 'pointe',
    name: 'Pointe du Hoc',
    subtitle: 'Cliffs · 07:10',
    icon: '⛰️',
    available: true,
    difficulty: 4,
    brief: 'You climbed the 100-foot cliff. Now find the guns — or what\'s left of them. Snipers in every direction.',
    historicalFact: '2nd Ranger Battalion scaled Pointe du Hoc under fire. The big guns had been moved, but the Rangers held the position for two days against repeated counter-attacks.',
    waves: 4,
    enemyHP: 1.35,
    enemyCount: 1.35,
    palette: {
      sand: '#8a8278',
      sandDark: '#605a50',
      water: '#2a4878',
      foliage: '#4a6038',
      stone: '#8a8278',
      blood: '#7a2020'
    },
    terrain: 'cliffs',
    boss: { type: 'mg_nest', hp: 600 },
    scoreGoal: 2000
  },
  {
    id: 'town',
    name: 'Sainte-Mère-Église',
    subtitle: 'Town Square · 04:30',
    icon: '⛪',
    available: true,
    difficulty: 5,
    brief: 'Paratroopers landed in the church square. Hold what you have. Reinforcements come at dawn.',
    historicalFact: 'Pvt. John Steele\'s parachute caught the church steeple in Sainte-Mère-Église, leaving him hanging through the night. The town was the first French town liberated.',
    waves: 5,
    enemyHP: 1.5,
    enemyCount: 1.5,
    palette: {
      sand: '#787068',
      sandDark: '#504840',
      water: '#1a2848',
      foliage: '#3a4828',
      stone: '#a8a098',
      blood: '#8a2020'
    },
    terrain: 'town',
    boss: { type: 'officer', hp: 850 },
    scoreGoal: 2500
  }
];

// ============================================================
// STATE
// ============================================================

const state = {
  screen: 'title',  // title, role, level, brief, play, win, lose
  role: 'rifleman',
  level: 0,
  score: 0,
  wave: 0,
  best: parseInt(localStorage.getItem('dday_best') || '0', 10),
  unlocked: parseInt(localStorage.getItem('dday_unlocked') || '1', 10) // index of highest level unlocked
};

const app = document.getElementById('app');

// ============================================================
// HELPERS
// ============================================================

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function dist2(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
function dist(a, b) { return Math.sqrt(dist2(a, b)); }
function angleTo(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============================================================
// SCREEN ROUTING
// ============================================================

function go(screen, opts) {
  state.screen = screen;
  if (opts) Object.assign(state, opts);
  if (gameLoopId) { cancelAnimationFrame(gameLoopId); gameLoopId = 0; }
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
        <p class="dday-title-blurb">
          Storm the beaches. Pick your soldier. Survive the waves.
        </p>
        <div class="dday-title-stats">
          <div><b>${state.best}</b><span>Best Score</span></div>
          <div><b>${state.unlocked}</b><span>Levels Unlocked</span></div>
          <div><b>${ROLE_ORDER.length}</b><span>Roles</span></div>
        </div>
        <button class="dday-btn dday-btn-primary" data-go="role">Deploy →</button>
        <div class="dday-title-hint">
          <kbd>WASD</kbd> or <kbd>↑←↓→</kbd> to move · auto-aim · <kbd>Q</kbd> or <kbd>Space</kbd> for special<br>
          Touch screen? You'll get a joystick.
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
    const selected = state.role === id ? 'selected' : '';
    return `
      <div class="dday-role-card ${selected}" data-pick-role="${id}" style="--accent:${r.accent};--accent-dark:${r.color}">
        <div class="dday-role-icon">${r.icon}</div>
        <div class="dday-role-name">${escapeHtml(r.name)}</div>
        <div class="dday-role-sub">${escapeHtml(r.fullName)}</div>
        <div class="dday-role-unit">${escapeHtml(r.unit)}</div>
        <p class="dday-role-blurb">${escapeHtml(r.blurb)}</p>
        <div class="dday-role-stats">
          <div><span>HP</span><div class="dday-stat-bar"><i style="width:${r.hp / 1.5}%"></i></div></div>
          <div><span>SPD</span><div class="dday-stat-bar"><i style="width:${r.speed / 2.5}%"></i></div></div>
          <div><span>DMG</span><div class="dday-stat-bar"><i style="width:${r.damage * 1.2}%"></i></div></div>
          <div><span>RoF</span><div class="dday-stat-bar"><i style="width:${100 - r.fireRate / 12}%"></i></div></div>
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
    el.addEventListener('click', () => {
      state.role = el.getAttribute('data-pick-role');
      renderRoleSelect();
    });
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
          <p>Survive ${l.waves} waves of enemies, then defeat the position. Stay alive.</p>
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
let game; // game instance
let gameLoopId = 0;
let lastFrame = 0;
let keys = {};
let touch = { active: false, baseX: 0, baseY: 0, x: 0, y: 0, special: false };

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
            <div class="dday-hud-hp-text"><span id="hud-hp-text">100</span> / ${r.hp}</div>
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
        <div class="dday-hud-bottom">
          <div class="dday-hud-ability" id="hud-ability">
            <div class="dday-hud-ability-fill"></div>
            <div class="dday-hud-ability-label">${escapeHtml(r.ability.name)}</div>
            <div class="dday-hud-ability-key">Q</div>
          </div>
        </div>
      </div>
      <div class="dday-touch" id="dday-touch">
        <div class="dday-touch-stick" id="dday-stick">
          <div class="dday-touch-knob" id="dday-knob"></div>
        </div>
        <button class="dday-touch-ability" id="dday-touch-ability">${r.icon}</button>
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

class Game {
  constructor(role, level) {
    this.role = role;
    this.level = level;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.paused = false;
    this.over = false;
    this.shake = 0;
    this.shakeMag = 0;
    this.time = 0;

    this.player = new Player(this.w / 2, this.h * 0.78, role);
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.pickups = [];
    this.floats = []; // floating damage numbers
    this.obstacles = this.makeObstacles();

    this.wave = 1;
    this.score = 0;
    this.kills = 0;
    this.waveAlive = 0;
    this.waveTimer = 1.5; // intro pause before first wave
    this.bossSpawned = false;
    this.boss = null;
    this.state = 'pre-wave';

    this.lastShot = 0;
    this.lastAbility = -999;
    this.abilityActive = 0;

    this.toast('Wave 1 incoming…', 1500);
  }

  toast(msg, dur) {
    const el = document.getElementById('dday-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.classList.remove('show'), dur || 1200);
  }

  onResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  pause() { this.paused = true; this.toast('Paused', 9999); }
  resume() {
    this.paused = false;
    const el = document.getElementById('dday-toast');
    if (el) el.classList.remove('show');
    lastFrame = performance.now();
  }

  makeObstacles() {
    const obs = [];
    const t = this.level.terrain;
    const W = this.w, H = this.h;
    if (t === 'beach') {
      // Czech hedgehogs scattered
      for (let i = 0; i < 6; i++) {
        obs.push({ x: rand(80, W - 80), y: rand(H * 0.35, H * 0.6), r: 26, type: 'hedgehog', hp: 0 });
      }
      // Sandbag wall mid
      for (let i = 0; i < 5; i++) {
        obs.push({ x: 120 + i * (W - 240) / 4, y: H * 0.25, r: 24, type: 'sandbag', hp: 0 });
      }
    } else if (t === 'bocage') {
      // Hedgerow blobs
      for (let i = 0; i < 12; i++) {
        obs.push({ x: rand(60, W - 60), y: rand(80, H - 200), r: rand(34, 50), type: 'bush', hp: 0 });
      }
    } else if (t === 'cliffs') {
      // Rocks
      for (let i = 0; i < 9; i++) {
        obs.push({ x: rand(60, W - 60), y: rand(80, H - 200), r: rand(26, 44), type: 'rock', hp: 0 });
      }
    } else if (t === 'town') {
      // Buildings — large rects (approximated as big circles for collision)
      for (let i = 0; i < 5; i++) {
        obs.push({ x: rand(100, W - 100), y: rand(100, H - 250), r: rand(38, 58), type: 'wall', hp: 0 });
      }
    }
    return obs;
  }

  spawnWave() {
    const baseCount = 5 + this.wave;
    const count = Math.round(baseCount * this.level.enemyCount);
    for (let i = 0; i < count; i++) {
      const type = this.pickEnemyType();
      const side = Math.floor(Math.random() * 3); // 0 top, 1 left, 2 right
      let x, y;
      if (side === 0) { x = rand(40, this.w - 40); y = -30; }
      else if (side === 1) { x = -30; y = rand(40, this.h * 0.6); }
      else { x = this.w + 30; y = rand(40, this.h * 0.6); }
      this.enemies.push(new Enemy(x, y, type, this.level.enemyHP, this.level.palette));
    }
    this.waveAlive = count;
    this.state = 'wave';
    this.toast(`Wave ${this.wave} of ${this.level.waves}`, 1200);
  }

  spawnBoss() {
    const b = this.level.boss;
    const boss = new Enemy(this.w / 2, -80, b.type, 1, this.level.palette, true);
    boss.maxHp = b.hp;
    boss.hp = b.hp;
    this.boss = boss;
    this.enemies.push(boss);
    this.bossSpawned = true;
    this.state = 'boss';
    this.toast('⚠ Boss incoming', 1800);
  }

  pickEnemyType() {
    // Variety based on wave
    const roll = Math.random();
    if (this.wave === 1) return roll < 0.85 ? 'infantry' : 'rifleman';
    if (this.wave === 2) return roll < 0.55 ? 'infantry' : roll < 0.85 ? 'rifleman' : 'mg';
    return roll < 0.4 ? 'infantry' : roll < 0.7 ? 'rifleman' : roll < 0.9 ? 'mg' : 'sniper';
  }

  update(dt) {
    this.time += dt;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 6);

    // State machine
    if (this.state === 'pre-wave') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.spawnWave();
    } else if (this.state === 'wave') {
      if (this.enemies.length === 0) {
        if (this.wave >= this.level.waves) {
          this.state = 'pre-boss';
          this.waveTimer = 1.8;
          this.toast('All waves cleared!', 1500);
        } else {
          this.state = 'pre-wave';
          this.wave++;
          this.waveTimer = 2.2;
          this.maybeDropHealth();
        }
        const wel = document.getElementById('hud-wave');
        if (wel) wel.textContent = this.wave;
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

    // Player update
    this.player.update(dt, this);

    // Enemies
    for (const e of this.enemies) e.update(dt, this);
    this.enemies = this.enemies.filter(e => !e.dead);

    // Bullets
    for (const b of this.bullets) b.update(dt, this);
    this.bullets = this.bullets.filter(b => b.life > 0);

    // Particles
    for (const p of this.particles) p.update(dt);
    this.particles = this.particles.filter(p => p.life > 0);

    // Pickups
    for (const p of this.pickups) p.update(dt, this);
    this.pickups = this.pickups.filter(p => !p.taken);

    // Floating texts
    for (const f of this.floats) { f.life -= dt; f.y -= dt * 40; }
    this.floats = this.floats.filter(f => f.life > 0);

    // Player firing — auto-aim closest enemy in range
    const r = this.player.role;
    if (this.time * 1000 - this.lastShot >= r.fireRate) {
      const target = this.closestEnemy(this.player, r.range);
      if (target) {
        this.fireFromPlayer(target);
        this.lastShot = this.time * 1000;
      }
    }

    // Ability cooldown UI
    const cd = r.ability.cooldown;
    const since = this.time * 1000 - this.lastAbility;
    const fillEl = document.querySelector('.dday-hud-ability-fill');
    if (fillEl) {
      const pct = clamp(since / cd, 0, 1);
      fillEl.style.width = (pct * 100) + '%';
      const ab = document.getElementById('hud-ability');
      if (ab) ab.classList.toggle('ready', pct >= 1);
    }
    if (this.abilityActive > 0) this.abilityActive -= dt;

    // HUD updates
    const hpEl = document.getElementById('hud-hp');
    const hpTextEl = document.getElementById('hud-hp-text');
    if (hpEl) hpEl.style.width = (this.player.hp / r.hp * 100) + '%';
    if (hpTextEl) hpTextEl.textContent = Math.max(0, Math.ceil(this.player.hp));
    const scoreEl = document.getElementById('hud-score');
    if (scoreEl) scoreEl.textContent = this.score;

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
      bossEl.querySelector('span').textContent = (this.boss.bossLabel || 'Position') + ' — ' + Math.ceil(this.boss.hp);
      bossEl.querySelector('i').style.width = (this.boss.hp / this.boss.maxHp * 100) + '%';
    } else {
      const bossEl = document.getElementById('dday-boss-bar');
      if (bossEl) bossEl.remove();
    }
  }

  maybeDropHealth() {
    if (Math.random() < 0.65 || this.player.hp < this.player.role.hp * 0.5) {
      this.pickups.push({
        x: rand(80, this.w - 80), y: rand(this.h * 0.3, this.h * 0.7),
        type: 'medkit', taken: false, bob: 0,
        update(dt) { this.bob += dt; }
      });
    }
  }

  fireFromPlayer(target) {
    const r = this.player.role;
    const dx = target.x - this.player.x;
    const dy = target.y - this.player.y;
    let ang = Math.atan2(dy, dx);
    if (r.spread) ang += rand(-r.spread, r.spread);
    this.player.facing = ang;
    const speed = r.bulletSpeed;
    const dmg = r.damage * (this.abilityActive > 0 && r.id === 'heavy' ? 2 : 1);
    this.bullets.push(new Bullet(
      this.player.x, this.player.y - 6,
      Math.cos(ang) * speed, Math.sin(ang) * speed,
      dmg, 'player', r.bulletColor, r.bulletSize, r.range / speed
    ));
    this.particles.push(new Particle(this.player.x + Math.cos(ang) * 16, this.player.y + Math.sin(ang) * 16 - 6, '#fff5b0', 8, 0.12));
  }

  useAbility() {
    const r = this.player.role;
    const since = this.time * 1000 - this.lastAbility;
    if (since < r.ability.cooldown) return;
    this.lastAbility = this.time * 1000;
    if (r.id === 'rifleman') {
      // Aimed shot ×3 dmg piercing
      const target = this.closestEnemy(this.player, r.range * 1.5) || { x: this.player.x, y: this.player.y - 200 };
      const ang = angleTo(this.player, target);
      const b = new Bullet(this.player.x, this.player.y - 6,
        Math.cos(ang) * (r.bulletSpeed * 1.5), Math.sin(ang) * (r.bulletSpeed * 1.5),
        r.damage * 3, 'player', '#ffeb6a', 8, 0.9);
      b.pierce = true;
      this.bullets.push(b);
      this.shakeFx(8);
    } else if (r.id === 'paratrooper') {
      // Smoke dash forward (facing direction)
      const ang = this.player.facing || -Math.PI / 2;
      this.player.x += Math.cos(ang) * 160;
      this.player.y += Math.sin(ang) * 160;
      this.player.x = clamp(this.player.x, 30, this.w - 30);
      this.player.y = clamp(this.player.y, 30, this.h - 30);
      this.player.iframes = 1.2;
      for (let i = 0; i < 18; i++) this.particles.push(new Particle(this.player.x + rand(-20, 20), this.player.y + rand(-20, 20), 'rgba(220,220,220,0.7)', rand(8, 16), 0.8));
    } else if (r.id === 'medic') {
      this.player.hp = Math.min(r.hp, this.player.hp + 60);
      for (let i = 0; i < 14; i++) this.particles.push(new Particle(this.player.x + rand(-18, 18), this.player.y + rand(-18, 18), '#ff8080', rand(6, 10), 0.6));
      this.floats.push({ x: this.player.x, y: this.player.y - 24, text: '+60 HP', color: '#ff8080', life: 1.0 });
    } else if (r.id === 'ranger') {
      // Grenade — lobs to target then explodes
      const target = this.closestEnemy(this.player, 800) || { x: this.player.x, y: this.player.y - 220 };
      this.bullets.push(new Grenade(this.player.x, this.player.y - 6, target.x, target.y, 80));
    } else if (r.id === 'sniper') {
      // Piercing rail shot
      const target = this.closestEnemy(this.player, 2000) || { x: this.player.x, y: this.player.y - 400 };
      const ang = angleTo(this.player, target);
      const b = new Bullet(this.player.x, this.player.y - 6,
        Math.cos(ang) * 1600, Math.sin(ang) * 1600,
        r.damage * 1.5, 'player', '#c0e0ff', 5, 1.0);
      b.pierce = true;
      b.trail = true;
      this.bullets.push(b);
      this.shakeFx(10);
    } else if (r.id === 'heavy') {
      this.abilityActive = 2.0;
      for (let i = 0; i < 16; i++) this.particles.push(new Particle(this.player.x + rand(-16, 16), this.player.y + rand(-16, 16), '#ffaa44', rand(6, 12), 0.7));
      this.floats.push({ x: this.player.x, y: this.player.y - 24, text: 'BRACED!', color: '#ffaa44', life: 1.4 });
    }
  }

  closestEnemy(from, maxRange) {
    let best = null, bestD2 = (maxRange || 99999) ** 2;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const d = dist2(from, e);
      if (d < bestD2) { best = e; bestD2 = d; }
    }
    return best;
  }

  shakeFx(mag) { this.shake = 0.35; this.shakeMag = mag; }

  hitEnemy(e, dmg, fromBullet) {
    e.hp -= dmg;
    e.hitFlash = 0.12;
    if (fromBullet) {
      const ang = Math.atan2(fromBullet.vy, fromBullet.vx);
      e.x += Math.cos(ang) * 4;
      e.y += Math.sin(ang) * 4;
      for (let i = 0; i < 5; i++) {
        this.particles.push(new Particle(e.x, e.y, '#ffd95a', rand(4, 7), rand(0.15, 0.35)));
      }
    }
    this.floats.push({ x: e.x + rand(-8, 8), y: e.y - 14, text: '' + Math.ceil(dmg), color: '#ffd95a', life: 0.7 });
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      this.kills++;
      this.score += (e.boss ? 250 : (e.type === 'sniper' || e.type === 'mg' ? 30 : 15));
      for (let i = 0; i < 14; i++) this.particles.push(new Particle(e.x, e.y, this.level.palette.blood, rand(6, 14), rand(0.4, 0.8)));
      // Small chance to drop ammo (heals)
      if (Math.random() < 0.12) {
        this.pickups.push({ x: e.x, y: e.y, type: 'ammo', taken: false, bob: 0, update(dt) { this.bob += dt; } });
      }
    }
  }

  damagePlayer(dmg) {
    if (this.player.iframes > 0) return;
    this.player.hp -= dmg;
    this.player.hitFlash = 0.18;
    this.shakeFx(6);
    this.floats.push({ x: this.player.x + rand(-8, 8), y: this.player.y - 18, text: '-' + Math.ceil(dmg), color: '#ff5060', life: 0.7 });
    if (this.player.hp <= 0) this.lose();
  }

  win() {
    if (this.over) return;
    this.over = true;
    state.score = this.score;
    state.wave = this.wave;
    if (this.score > state.best) {
      state.best = this.score;
      localStorage.setItem('dday_best', state.best);
    }
    const nextLvl = state.level + 2;
    if (nextLvl > state.unlocked) {
      state.unlocked = Math.min(LEVELS.length, nextLvl);
      localStorage.setItem('dday_unlocked', state.unlocked);
    }
    setTimeout(() => go('win'), 600);
  }

  lose() {
    if (this.over) return;
    this.over = true;
    state.score = this.score;
    state.wave = this.wave;
    if (this.score > state.best) {
      state.best = this.score;
      localStorage.setItem('dday_best', state.best);
    }
    setTimeout(() => go('lose'), 700);
  }

  // ---- RENDER ----
  render(ctx) {
    const W = this.w, H = this.h;
    let sx = 0, sy = 0;
    if (this.shake > 0) {
      sx = rand(-this.shakeMag, this.shakeMag);
      sy = rand(-this.shakeMag, this.shakeMag);
    }
    ctx.save();
    ctx.translate(sx, sy);
    this.drawTerrain(ctx);
    this.drawObstacles(ctx);

    for (const p of this.pickups) this.drawPickup(ctx, p);
    for (const b of this.bullets) b.render(ctx);
    for (const e of this.enemies) e.render(ctx);
    this.player.render(ctx, this);
    for (const p of this.particles) p.render(ctx);
    for (const f of this.floats) this.drawFloat(ctx, f);
    ctx.restore();
  }

  drawFloat(ctx, f) {
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

  drawPickup(ctx, p) {
    const yOff = Math.sin(p.bob * 3) * 4;
    ctx.save();
    ctx.translate(p.x, p.y + yOff);
    if (p.type === 'medkit') {
      ctx.fillStyle = '#f8f4e8';
      ctx.fillRect(-12, -10, 24, 20);
      ctx.fillStyle = '#c83030';
      ctx.fillRect(-8, -3, 16, 6);
      ctx.fillRect(-3, -8, 6, 16);
    } else if (p.type === 'ammo') {
      ctx.fillStyle = '#3a2a18';
      ctx.fillRect(-10, -7, 20, 14);
      ctx.fillStyle = '#c89040';
      ctx.fillRect(-7, -4, 14, 8);
    }
    ctx.restore();
  }

  drawTerrain(ctx) {
    const pal = this.level.palette;
    const t = this.level.terrain;
    // Base
    ctx.fillStyle = pal.sand;
    ctx.fillRect(0, 0, this.w, this.h);
    // Layers per terrain
    if (t === 'beach') {
      // Water at top
      ctx.fillStyle = pal.water;
      ctx.fillRect(0, 0, this.w, this.h * 0.18);
      // Foamy waves
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      const t0 = this.time * 30;
      for (let i = 0; i < 12; i++) {
        const x = ((i * 130 + t0) % (this.w + 200)) - 100;
        ctx.fillRect(x, this.h * 0.16, 40, 4);
      }
      // Wet sand band
      ctx.fillStyle = pal.sandDark;
      ctx.fillRect(0, this.h * 0.18, this.w, 30);
      // Distant dunes hint (top of beach near water)
    } else if (t === 'bocage') {
      // Grass patches
      ctx.fillStyle = pal.foliage;
      for (let i = 0; i < 60; i++) {
        const x = (i * 137 + 11) % this.w;
        const y = (i * 211 + 17) % this.h;
        ctx.fillRect(x, y, 6, 6);
      }
    } else if (t === 'cliffs') {
      // Rocky texture
      ctx.fillStyle = pal.sandDark;
      for (let i = 0; i < 80; i++) {
        const x = (i * 113 + 11) % this.w;
        const y = (i * 197 + 17) % this.h;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Cliff edge at top
      ctx.fillStyle = '#5a5048';
      ctx.fillRect(0, 0, this.w, 24);
    } else if (t === 'town') {
      // Cobble texture
      ctx.fillStyle = pal.sandDark;
      for (let y = 0; y < this.h; y += 22) {
        for (let x = 0; x < this.w; x += 22) {
          ctx.fillRect(x + (y / 22 % 2 === 0 ? 0 : 11), y, 10, 10);
        }
      }
    }
    // Subtle vignette
    const grad = ctx.createRadialGradient(this.w / 2, this.h / 2, this.h * 0.3, this.w / 2, this.h / 2, this.h * 0.85);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  drawObstacles(ctx) {
    for (const o of this.obstacles) {
      ctx.save();
      ctx.translate(o.x, o.y);
      if (o.type === 'hedgehog') {
        ctx.strokeStyle = '#3a2818';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
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
          ctx.ellipse(0, -8 + i * 10, o.r * 0.9, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = '#806040';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (o.type === 'bush') {
        ctx.fillStyle = this.level.palette.foliage;
        ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath(); ctx.arc(o.r * 0.3, o.r * 0.3, o.r * 0.6, 0, Math.PI * 2); ctx.fill();
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
        ctx.strokeStyle = '#4a4540';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (o.type === 'wall') {
        ctx.fillStyle = this.level.palette.stone;
        ctx.fillRect(-o.r, -o.r * 0.7, o.r * 2, o.r * 1.4);
        ctx.strokeStyle = '#3a3530';
        ctx.lineWidth = 2;
        ctx.strokeRect(-o.r, -o.r * 0.7, o.r * 2, o.r * 1.4);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let y = -1; y <= 1; y++)
          for (let x = -1; x <= 1; x++)
            ctx.fillRect(-o.r + 8 + x * 28, -o.r * 0.7 + 12 + y * 16, 14, 8);
      }
      ctx.restore();
    }
  }
}

// ============================================================
// PLAYER
// ============================================================

class Player {
  constructor(x, y, role) {
    this.x = x; this.y = y;
    this.role = role;
    this.hp = role.hp;
    this.r = 18;
    this.facing = -Math.PI / 2;
    this.hitFlash = 0;
    this.iframes = 0;
    this.step = 0;
  }
  update(dt, game) {
    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup'])    dy -= 1;
    if (keys['s'] || keys['arrowdown'])  dy += 1;
    if (keys['a'] || keys['arrowleft'])  dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;
    if (touch.active) {
      dx += touch.x;
      dy += touch.y;
    }
    const len = Math.hypot(dx, dy);
    if (len > 0) { dx /= len; dy /= len; }
    const sp = this.role.speed;
    this.x += dx * sp * dt;
    this.y += dy * sp * dt;
    this.x = clamp(this.x, 24, game.w - 24);
    this.y = clamp(this.y, 24, game.h - 24);

    // Obstacle collision (push out)
    for (const o of game.obstacles) {
      const d = dist(this, o);
      const minD = this.r + o.r * 0.8;
      if (d < minD) {
        const ang = Math.atan2(this.y - o.y, this.x - o.x);
        this.x = o.x + Math.cos(ang) * minD;
        this.y = o.y + Math.sin(ang) * minD;
      }
    }

    // Pickup collection
    for (const p of game.pickups) {
      if (!p.taken && dist(this, p) < 26) {
        p.taken = true;
        if (p.type === 'medkit') {
          this.hp = Math.min(this.role.hp, this.hp + 35);
          game.floats.push({ x: this.x, y: this.y - 24, text: '+35 HP', color: '#80ff80', life: 0.9 });
        } else if (p.type === 'ammo') {
          game.score += 50;
          game.floats.push({ x: this.x, y: this.y - 24, text: '+50', color: '#ffd95a', life: 0.9 });
        }
      }
    }

    if (len > 0) this.step += dt * 8;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.iframes > 0) this.iframes -= dt;
  }
  render(ctx, game) {
    const r = this.role;
    const t = game.time;
    const bob = Math.sin(this.step) * 1.8;
    ctx.save();
    ctx.translate(this.x, this.y + bob);

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(0, 14, 16, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : r.color;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    // Body outline
    ctx.strokeStyle = '#1a1008';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Helmet
    ctx.fillStyle = r.accent;
    ctx.beginPath(); ctx.arc(0, -4, 13, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-13, -4, 26, 2);

    // Face (small)
    ctx.fillStyle = '#1a1008';
    ctx.beginPath(); ctx.arc(-4, 2, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, 2, 1.6, 0, Math.PI * 2); ctx.fill();

    // Gun pointing in facing direction
    ctx.rotate(this.facing);
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(8, -2, 18, 4);
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(22, -1, 6, 2);

    // I-frame ring
    if (this.iframes > 0) {
      ctx.rotate(-this.facing);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.restore();
  }
}

// ============================================================
// ENEMY
// ============================================================

class Enemy {
  constructor(x, y, type, hpMul, palette, boss) {
    this.x = x; this.y = y;
    this.type = type;
    this.palette = palette;
    this.boss = boss || false;
    this.hitFlash = 0;
    this.dead = false;
    this.lastShot = 0;
    this.facing = Math.PI / 2;
    this.step = 0;

    const t = TYPES[type] || TYPES.infantry;
    this.hp = Math.max(1, t.hp * (hpMul || 1));
    this.maxHp = this.hp;
    this.speed = t.speed;
    this.damage = t.damage;
    this.fireRate = t.fireRate;
    this.range = t.range;
    this.bulletSpeed = t.bulletSpeed;
    this.r = t.r;
    this.color = t.color;
    this.accent = t.accent;
    this.shootingType = t.shootingType || 'single';
    this.bossLabel = t.bossLabel;
    if (boss) {
      this.r = t.bossR || 40;
      this.color = t.bossColor || t.color;
      this.speed *= 0.6;
      this.damage *= 1.2;
    }
  }
  update(dt, game) {
    this.step += dt * 4;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    const p = game.player;
    const d = dist(this, p);

    // Move toward player but stop at preferred range
    const preferred = this.range * 0.7;
    if (d > preferred) {
      const ang = angleTo(this, p);
      this.x += Math.cos(ang) * this.speed * dt;
      this.y += Math.sin(ang) * this.speed * dt;
      this.facing = ang;
    } else if (d < preferred * 0.6 && this.type !== 'mg') {
      // back away a bit
      const ang = angleTo(this, p);
      this.x -= Math.cos(ang) * this.speed * 0.5 * dt;
      this.y -= Math.sin(ang) * this.speed * 0.5 * dt;
      this.facing = ang;
    } else {
      this.facing = angleTo(this, p);
    }

    // Stay in bounds
    this.x = clamp(this.x, 18, game.w - 18);
    this.y = clamp(this.y, 18, game.h - 18);

    // Avoid obstacles
    for (const o of game.obstacles) {
      const od = dist(this, o);
      const minD = this.r + o.r * 0.8;
      if (od < minD) {
        const ang = Math.atan2(this.y - o.y, this.x - o.x);
        this.x = o.x + Math.cos(ang) * minD;
        this.y = o.y + Math.sin(ang) * minD;
      }
    }

    // Melee touch damage
    if (d < this.r + p.r) {
      game.damagePlayer(this.damage * 0.6 * dt);
    }

    // Ranged firing
    if (this.fireRate > 0 && d < this.range && (game.time * 1000 - this.lastShot) > this.fireRate) {
      const ang = angleTo(this, p);
      if (this.shootingType === 'burst') {
        for (let i = 0; i < 3; i++) setTimeout(() => {
          if (this.dead) return;
          const a = ang + rand(-0.05, 0.05);
          game.bullets.push(new Bullet(this.x, this.y, Math.cos(a) * this.bulletSpeed, Math.sin(a) * this.bulletSpeed, this.damage, 'enemy', '#ff6644', 4, 1.4));
        }, i * 80);
      } else {
        const a = ang + rand(-0.04, 0.04);
        game.bullets.push(new Bullet(this.x, this.y, Math.cos(a) * this.bulletSpeed, Math.sin(a) * this.bulletSpeed, this.damage, 'enemy', '#ff6644', 4, 1.4));
      }
      this.lastShot = game.time * 1000;
    }
  }
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(0, this.r * 0.8, this.r * 0.85, this.r * 0.3, 0, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 2; ctx.stroke();

    // Helmet (Stahlhelm style — flatter)
    ctx.fillStyle = this.accent;
    ctx.beginPath(); ctx.arc(0, -4, this.r * 0.85, Math.PI * 0.95, Math.PI * 2.05, true); ctx.closePath(); ctx.fill();
    // Helmet rim
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(-this.r * 0.9, -2, this.r * 1.8, 2);

    // Eyes
    ctx.fillStyle = '#1a1008';
    ctx.beginPath(); ctx.arc(-this.r * 0.25, 2, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(this.r * 0.25, 2, 1.5, 0, Math.PI * 2); ctx.fill();

    // Gun
    ctx.rotate(this.facing);
    ctx.fillStyle = '#2a1a0c';
    ctx.fillRect(this.r * 0.6, -2, this.r * 0.9, 3);

    // Boss crown indicator
    ctx.rotate(-this.facing);
    if (this.boss) {
      ctx.fillStyle = '#c0a040';
      ctx.beginPath();
      ctx.moveTo(-10, -this.r - 6);
      ctx.lineTo(-6, -this.r - 14);
      ctx.lineTo(-2, -this.r - 8);
      ctx.lineTo(2, -this.r - 16);
      ctx.lineTo(6, -this.r - 8);
      ctx.lineTo(10, -this.r - 14);
      ctx.lineTo(14, -this.r - 6);
      ctx.closePath();
      ctx.fill();
    }

    // HP bar
    if (!this.dead && (this.hp < this.maxHp || this.boss)) {
      const w = this.r * 2;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-w / 2, this.r + 4, w, 4);
      ctx.fillStyle = this.boss ? '#c83040' : '#80c060';
      ctx.fillRect(-w / 2, this.r + 4, w * (this.hp / this.maxHp), 4);
    }

    ctx.restore();
  }
}

const TYPES = {
  infantry: {
    hp: 50, speed: 90, damage: 8, fireRate: 1400, range: 240, bulletSpeed: 280,
    r: 16, color: '#5a5550', accent: '#7a7570', shootingType: 'single', bossLabel: 'Officer'
  },
  rifleman: {
    hp: 80, speed: 70, damage: 12, fireRate: 1100, range: 320, bulletSpeed: 360,
    r: 17, color: '#3a4a3a', accent: '#5a6850', shootingType: 'single'
  },
  mg: {
    hp: 140, speed: 30, damage: 6, fireRate: 200, range: 360, bulletSpeed: 380,
    r: 22, color: '#3a3a48', accent: '#5a5060', shootingType: 'single', bossLabel: 'MG Position',
    bossR: 50, bossColor: '#48485a'
  },
  sniper: {
    hp: 60, speed: 50, damage: 28, fireRate: 1800, range: 520, bulletSpeed: 700,
    r: 16, color: '#5a4848', accent: '#7a6868', shootingType: 'single'
  },
  tank: {
    hp: 800, speed: 25, damage: 18, fireRate: 1600, range: 400, bulletSpeed: 320,
    r: 36, color: '#4a4a3a', accent: '#6a6a4a', shootingType: 'single', bossLabel: 'Panzer IV',
    bossR: 54, bossColor: '#4a4a3a'
  },
  officer: {
    hp: 200, speed: 70, damage: 12, fireRate: 700, range: 320, bulletSpeed: 360,
    r: 18, color: '#48383a', accent: '#7a5860', shootingType: 'burst', bossLabel: 'SS Officer',
    bossR: 44, bossColor: '#3a2840'
  },
  mg_nest: { // alias for boss
    hp: 480, speed: 0, damage: 8, fireRate: 180, range: 420, bulletSpeed: 400,
    r: 28, color: '#3a3a48', accent: '#5a5060', shootingType: 'single', bossLabel: 'MG-42 Bunker',
    bossR: 56, bossColor: '#3a2828'
  }
};

// ============================================================
// BULLET
// ============================================================

class Bullet {
  constructor(x, y, vx, vy, dmg, owner, color, size, life) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.dmg = dmg; this.owner = owner;
    this.color = color || '#ffd95a';
    this.size = size || 4;
    this.life = life || 1.2;
    this.pierce = false;
    this.trail = false;
    this.hitSet = new Set();
  }
  update(dt, game) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.x < -20 || this.x > game.w + 20 || this.y < -20 || this.y > game.h + 20) { this.life = 0; return; }

    // Obstacle hit
    for (const o of game.obstacles) {
      if (o.type === 'bush') continue; // bushes are see-through-ish
      const d2 = (this.x - o.x) ** 2 + (this.y - o.y) ** 2;
      if (d2 < (o.r * 0.7 + this.size) ** 2) {
        this.life = 0;
        game.particles.push(new Particle(this.x, this.y, '#888', 6, 0.2));
        return;
      }
    }

    if (this.owner === 'player') {
      for (const e of game.enemies) {
        if (e.dead) continue;
        if (this.hitSet.has(e)) continue;
        const d2 = (this.x - e.x) ** 2 + (this.y - e.y) ** 2;
        if (d2 < (e.r + this.size) ** 2) {
          game.hitEnemy(e, this.dmg, this);
          this.hitSet.add(e);
          if (!this.pierce) { this.life = 0; return; }
        }
      }
    } else {
      // hits player
      const p = game.player;
      const d2 = (this.x - p.x) ** 2 + (this.y - p.y) ** 2;
      if (d2 < (p.r + this.size) ** 2) {
        game.damagePlayer(this.dmg);
        this.life = 0;
        return;
      }
    }

    if (this.trail) {
      game.particles.push(new Particle(this.x, this.y, this.color, 3, 0.15));
    }
  }
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// ============================================================
// GRENADE
// ============================================================

class Grenade {
  constructor(sx, sy, tx, ty, dmg) {
    this.x = sx; this.y = sy;
    this.tx = tx; this.ty = ty;
    this.t = 0;
    this.dur = 0.6;
    this.dmg = dmg;
    this.life = this.dur;
    this.owner = 'player';
    this.sx = sx; this.sy = sy;
  }
  update(dt, game) {
    this.t += dt;
    this.life -= dt;
    const p = clamp(this.t / this.dur, 0, 1);
    this.x = this.sx + (this.tx - this.sx) * p;
    this.y = this.sy + (this.ty - this.sy) * p - Math.sin(p * Math.PI) * 80;
    if (this.life <= 0) {
      // Explode
      const radius = 90;
      for (const e of game.enemies) {
        if (e.dead) continue;
        if (dist(this, e) < radius) {
          game.hitEnemy(e, this.dmg, this);
        }
      }
      for (let i = 0; i < 28; i++) {
        const ang = Math.random() * Math.PI * 2;
        const d = Math.random() * radius;
        game.particles.push(new Particle(this.x + Math.cos(ang) * d, this.y + Math.sin(ang) * d, '#ffaa44', rand(10, 18), rand(0.4, 0.7)));
      }
      game.shakeFx(12);
    }
  }
  render(ctx) {
    ctx.save();
    ctx.fillStyle = '#1a2a18';
    ctx.beginPath(); ctx.arc(this.x, this.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a4a30';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}

// ============================================================
// PARTICLE
// ============================================================

class Particle {
  constructor(x, y, color, size, life) {
    this.x = x; this.y = y;
    this.vx = rand(-30, 30); this.vy = rand(-30, 30);
    this.color = color; this.size = size; this.life = life; this.maxLife = life;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.92; this.vy *= 0.92;
    this.life -= dt;
  }
  render(ctx) {
    const a = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// ============================================================
// INPUT
// ============================================================

function setupInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Touch joystick
  const stick = document.getElementById('dday-stick');
  const knob = document.getElementById('dday-knob');
  const ability = document.getElementById('dday-touch-ability');
  if (stick && knob) {
    let stickId = null;
    let baseX = 0, baseY = 0;
    const RAD = 50;
    function start(e) {
      const t = e.changedTouches[0];
      stickId = t.identifier;
      const rect = stick.getBoundingClientRect();
      baseX = rect.left + rect.width / 2;
      baseY = rect.top + rect.height / 2;
      stick.style.opacity = 1;
      touch.active = true;
    }
    function move(e) {
      if (stickId === null) return;
      for (const t of e.changedTouches) {
        if (t.identifier === stickId) {
          let dx = t.clientX - baseX;
          let dy = t.clientY - baseY;
          const len = Math.hypot(dx, dy);
          if (len > RAD) { dx = dx / len * RAD; dy = dy / len * RAD; }
          knob.style.transform = `translate(${dx}px, ${dy}px)`;
          touch.x = dx / RAD;
          touch.y = dy / RAD;
        }
      }
    }
    function end(e) {
      for (const t of e.changedTouches) {
        if (t.identifier === stickId) {
          stickId = null;
          knob.style.transform = 'translate(0,0)';
          touch.active = false; touch.x = 0; touch.y = 0;
        }
      }
    }
    stick.addEventListener('touchstart', e => { e.preventDefault(); start(e); }, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
  }
  if (ability) {
    ability.addEventListener('click', e => { e.preventDefault(); if (game) game.useAbility(); });
    ability.addEventListener('touchstart', e => { e.preventDefault(); if (game) game.useAbility(); }, { passive: false });
  }
}

function onKeyDown(e) {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === 'q' || k === ' ') { e.preventDefault(); if (game) game.useAbility(); }
  if (k === 'p' || k === 'escape') {
    if (game) { game.paused ? game.resume() : game.pause(); }
  }
}
function onKeyUp(e) { keys[e.key.toLowerCase()] = false; }

// ============================================================
// SCREEN: RESULT (WIN/LOSE)
// ============================================================

function renderResult(won) {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  keys = {};
  const l = LEVELS[state.level];
  const r = ROLES[state.role];
  const newBest = state.score === state.best && state.score > 0;
  app.innerHTML = `
    <section class="dday-screen dday-result ${won ? 'dday-result-win' : 'dday-result-lose'}">
      <div class="dday-result-card">
        <div class="dday-result-icon">${won ? '🎖' : '☠'}</div>
        <h2 class="dday-result-title">${won ? 'Position Secured' : 'KIA'}</h2>
        <div class="dday-result-sub">${escapeHtml(l.name)} · ${escapeHtml(r.name)}</div>
        <div class="dday-result-stats">
          <div><b>${state.score}</b><span>Score</span></div>
          <div><b>${state.wave}</b><span>Wave</span></div>
          <div><b>${state.best}</b><span>Best</span></div>
        </div>
        ${newBest ? '<div class="dday-result-new">⭐ NEW BEST</div>' : ''}
        ${won && state.unlocked > state.level + 1 ? `<div class="dday-result-unlock">🔓 Unlocked: <b>${escapeHtml(LEVELS[Math.min(state.level + 1, LEVELS.length - 1)].name)}</b></div>` : ''}
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
}

// ============================================================
// COMMON
// ============================================================

function wireButtons() {
  app.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => go(el.getAttribute('data-go')));
  });
}

// ============================================================
// BOOT
// ============================================================

function boot() {
  go('title');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
