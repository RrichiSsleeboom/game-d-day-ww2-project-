/* ============================================================
   D-DAY: BEACH ASSAULT — v10
   TRUE 3D FIRST-PERSON SHOOTER (Three.js).
   WASD to move, mouse to look (click canvas for pointer-lock),
   click to fire, R reload, Q ability, Shift sprint.
   Touch: dual joysticks + fire button.
   ============================================================ */

const BUILD_VERSION = 'v10 · 3D FPS';
console.log('%c[D-DAY: Beach Assault] build ' + BUILD_VERSION, 'color:#d4a13a;font-weight:bold');

(function () {
'use strict';

// ============================================================
// CONFIG — ROLES
// ============================================================

const ROLES = {
  rifleman: { id:'rifleman', name:'Rifleman', fullName:'Pvt. James Miller', unit:'1st Infantry · Omaha Beach', icon:'🎯',
    color:0x4a8754, accentHex:'#88c46a', colorHex:'#4a8754',
    hp:100,
    weapon:{ name:'M1 Garand', mag:8, reserve:64, fireMs:240, reloadMs:2000, dmg:38, auto:false, spread:0.012, recoil:0.04, range:90 },
    ability:{ name:'Aimed Shot', key:'Q', cooldown:7000, desc:'Next shot deals 3× damage' },
    difficulty:2,
    blurb:'M1 Garand. 8-round clip, semi-auto. Steady, accurate, deadly.'
  },
  paratrooper: { id:'paratrooper', name:'Paratrooper', fullName:'Sgt. William O\'Connor', unit:'101st Airborne · Sainte-Mère-Église', icon:'🪂',
    color:0x6e7a3a, accentHex:'#c8d058', colorHex:'#6e7a3a',
    hp:80,
    weapon:{ name:'Thompson M1A1', mag:30, reserve:120, fireMs:90, reloadMs:2400, dmg:14, auto:true, spread:0.045, recoil:0.02, range:50 },
    ability:{ name:'Sprint', key:'Q', cooldown:6500, desc:'2s of much faster movement' },
    difficulty:3,
    blurb:'Thompson SMG. 30-round mag. Spray and pray, get up close.'
  },
  medic: { id:'medic', name:'Medic', fullName:'Cpl. Samuel Cohen', unit:'4th Infantry · Utah Beach', icon:'⚕️',
    color:0x8a4040, accentHex:'#e07070', colorHex:'#8a4040',
    hp:130,
    weapon:{ name:'Colt M1911', mag:7, reserve:56, fireMs:260, reloadMs:1800, dmg:24, auto:false, spread:0.02, recoil:0.03, range:55 },
    ability:{ name:'Field Dressing', key:'Q', cooldown:9000, desc:'Heal 60 HP instantly' },
    difficulty:2,
    blurb:'Sidearm and a medic bag. Heal in a pinch. .45 ACP packs a punch.'
  },
  ranger: { id:'ranger', name:'Ranger', fullName:'Cpl. Leonard Lomell', unit:'2nd Rangers · Pointe du Hoc', icon:'💣',
    color:0x4a5a78, accentHex:'#7090c0', colorHex:'#4a5a78',
    hp:90,
    weapon:{ name:'M1 Carbine', mag:15, reserve:90, fireMs:200, reloadMs:2200, dmg:20, auto:false, spread:0.018, recoil:0.03, range:75 },
    ability:{ name:'Grenade', key:'Q', cooldown:5500, desc:'Lob a grenade at your crosshair' },
    difficulty:3,
    blurb:'M1 Carbine and a satchel of frags. Crack open clusters of enemies.'
  },
  sniper: { id:'sniper', name:'Sniper', fullName:'Sgt. Robert Watson', unit:'29th Infantry · Bocage', icon:'🔭',
    color:0x3a5a3a, accentHex:'#80a060', colorHex:'#3a5a3a',
    hp:70,
    weapon:{ name:'Springfield M1903', mag:5, reserve:30, fireMs:1100, reloadMs:3000, dmg:120, auto:false, spread:0.002, recoil:0.08, range:160 },
    ability:{ name:'Piercing Shot', key:'Q', cooldown:8000, desc:'Next shot passes through everything' },
    difficulty:4,
    blurb:'Bolt-action with a scope. Slow, fragile, lethal. One shot, one kill.'
  },
  heavy: { id:'heavy', name:'Heavy Gunner', fullName:'Pvt. Dale Vandegrift', unit:'29th Infantry · Omaha Beach', icon:'⚙️',
    color:0x6a5028, accentHex:'#c89040', colorHex:'#6a5028',
    hp:140,
    weapon:{ name:'BAR M1918A2', mag:20, reserve:100, fireMs:110, reloadMs:2800, dmg:24, auto:true, spread:0.035, recoil:0.025, range:65 },
    ability:{ name:'Brace', key:'Q', cooldown:7000, desc:'2s of double damage, less spread' },
    difficulty:3,
    blurb:'BAR automatic rifle. Hits hard, eats ammo.'
  }
};
const ROLE_ORDER = ['rifleman','paratrooper','medic','ranger','sniper','heavy'];

// ============================================================
// CONFIG — LEVELS
// ============================================================

const LEVELS = [
  { id:'omaha', name:'Omaha Beach', subtitle:'Easy Red Sector · 06:35', icon:'🌊',
    difficulty:2, waves:3, enemyHP:1.0, enemyCount:1.0,
    brief:'You\'re off the Higgins boat in waist-deep water. Sand, blood and machine-gun fire ahead. Reach the seawall — use cover.',
    historicalFact:'Casualty rates on Omaha\'s first wave exceeded 50%. The 1st and 29th Divisions fought yard by yard up the bluffs.',
    palette:{ sky:0x88a0b8, fog:0xa0b0c0, ground:0xc8a878, water:0x3a6080, stone:0x807870 },
    terrain:'beach',
    facts:[
      { title:'MG-42 — "Hitler\'s Buzzsaw"', text:'The MG-42 fired 1,200 rounds per minute, triple the rate of comparable US machine guns. Its distinctive ripping sound terrified Allied troops.' },
      { title:'Czech Hedgehogs', text:'The steel-beam obstacles on the beach were designed to tear out the bottoms of landing craft and trap vehicles.' },
      { title:'Naval Bombardment', text:'USS Texas and destroyers closed to under 1,000 yards to fire on bunkers point-blank — air bombing had missed German positions.' }
    ],
    quiz:{ q:'How many men landed on Omaha Beach on D-Day?', options:['~12,000','~34,000','~60,000','~100,000'], correct:1,
      explain:'~34,000 men landed on Omaha alone. ~2,400 became casualties — the bloodiest of the five D-Day beaches.' },
    boss:{ type:'mg_nest', hp:520 }
  },
  { id:'bocage', name:'Bocage Country', subtitle:'Hedgerows · 11:20', icon:'🌿',
    difficulty:3, waves:4, enemyHP:1.2, enemyCount:1.2,
    brief:'Hedgerows ten feet tall. Germans dug in behind every one. Push through. Don\'t bunch up.',
    historicalFact:'The Normandy hedgerows — bocage — were ancient earth banks topped with thick foliage, forcing US troops into yard-by-yard fighting for weeks.',
    palette:{ sky:0xa0b0a0, fog:0xb0c0b0, ground:0x6a7848, water:0x3a6080, stone:0x706858 },
    terrain:'bocage',
    facts:[
      { title:'Rhino Tanks', text:'US troops welded steel "tusks" from German beach obstacles onto Sherman tanks. These "Rhinos" could plough through hedgerows.' },
      { title:'The Sunken Lanes', text:'Between hedgerows ran narrow lanes, often below ground level. Germans turned them into death traps with pre-sighted MGs.' },
      { title:'Cobra Breakout', text:'Operation Cobra broke the front open near St-Lô with massive carpet bombing.' }
    ],
    quiz:{ q:'What does "bocage" mean?', options:['Forest','Marsh','Patchwork of fields edged with hedges','Coastal cliff'], correct:2,
      explain:'Bocage is the patchwork of small fields bounded by ancient earth banks topped with dense hedgerows.' },
    boss:{ type:'tank', hp:760 }
  },
  { id:'pointe', name:'Pointe du Hoc', subtitle:'Cliffs · 07:10', icon:'⛰️',
    difficulty:4, waves:4, enemyHP:1.35, enemyCount:1.35,
    brief:'You climbed the 100-foot cliff under fire. Now find the guns — or what\'s left of them. Snipers everywhere.',
    historicalFact:'2nd Ranger Battalion scaled Pointe du Hoc under fire. The big guns had been moved inland, but the Rangers held the position for two days.',
    palette:{ sky:0x8090a4, fog:0x9aaab8, ground:0x9a9080, water:0x2a4878, stone:0x8a8278 },
    terrain:'cliffs',
    facts:[
      { title:'Rocket-Propelled Grapnels', text:'Rangers fired rocket-launched grapples trailing ropes up the 100-foot cliff. Many ropes were too wet from surf to hold.' },
      { title:'The Missing Guns', text:'Lt. Lomell and Sgt. Kuhn found the five missing guns hidden a mile inland — and destroyed them with thermite grenades.' },
      { title:'Holding On', text:'Of 225 Rangers who landed at Pointe du Hoc, only 90 were still able to fight when they were relieved two days later.' }
    ],
    quiz:{ q:'What did the Rangers find at the top of Pointe du Hoc?', options:['The German command HQ','Empty gun emplacements — artillery had been moved','A large minefield','A captured American unit'], correct:1,
      explain:'The big coastal guns had been moved a mile inland. The Rangers tracked them down and destroyed them.' },
    boss:{ type:'mg_nest', hp:640 }
  },
  { id:'town', name:'Sainte-Mère-Église', subtitle:'Town Square · 04:30', icon:'⛪',
    difficulty:5, waves:5, enemyHP:1.5, enemyCount:1.5,
    brief:'Paratroopers landed in the church square at night. Hold what you have. Reinforcements come at dawn.',
    historicalFact:'Pvt. John Steele\'s parachute caught the church steeple, leaving him hanging through the night. The town was the first French town liberated.',
    palette:{ sky:0x1a2848, fog:0x2a3858, ground:0x5a4838, water:0x1a2848, stone:0xa8a098 },
    terrain:'town',
    facts:[
      { title:'John Steele', text:'Steele played dead for two hours while hanging from the steeple. The Germans eventually cut him down and took him prisoner — he later escaped.' },
      { title:'The Pathfinders', text:'Pathfinders jumped first to mark drop zones with lights. Many were scattered miles off-target by weather and AA fire.' },
      { title:'First Town Liberated', text:'Sainte-Mère-Église became the first French town liberated on D-Day, secured around 04:30 by the 505th PIR.' }
    ],
    quiz:{ q:'What happened to Pvt. John Steele during the drop?', options:['He landed on the church and was killed','His chute caught the steeple and he hung for hours','He led the assault on the German HQ','He was first into the square'], correct:1,
      explain:'Steele\'s chute snagged the steeple of the Église Notre-Dame. He hung from the side of the church playing dead before being taken prisoner.' },
    boss:{ type:'officer', hp:900 }
  }
];

// ============================================================
// ENEMY TYPES
// ============================================================

const ENEMY_TYPES = {
  infantry: { name:'Wehrmacht Heer', weapon:'Mauser K98k', hp:55, speed:2.8, dmg:10, fireMs:1500, accuracy:0.45, range:55, score:15, color:0x5a5550, accent:0x7a7570 },
  rifleman: { name:'Wehrmacht Grenadier', weapon:'Gewehr 43', hp:85, speed:2.5, dmg:14, fireMs:1100, accuracy:0.55, range:65, score:25, color:0x3a4a3a, accent:0x5a6850 },
  mg:       { name:'MG-42 Gunner', weapon:'MG-42', hp:130, speed:1.0, dmg:7, fireMs:180, accuracy:0.5, range:80, burst:5, score:60, color:0x3a3a48, accent:0x5a5060 },
  sniper:   { name:'Scharfschütze', weapon:'K98k w/ Zeiss', hp:60, speed:2.0, dmg:32, fireMs:1900, accuracy:0.85, range:120, score:70, color:0x5a4848, accent:0x7a6868 },
  ss:       { name:'Waffen-SS', weapon:'MP 40', hp:100, speed:3.4, dmg:11, fireMs:350, accuracy:0.55, range:50, burst:3, score:50, color:0x2a2a30, accent:0x48485a },
  mg_nest:  { name:'MG-42 Bunker', weapon:'Twin MG-42', hp:520, speed:0, dmg:11, fireMs:150, accuracy:0.65, range:100, isStatic:true, score:400, color:0x3a3030, accent:0x5a4848 },
  tank:     { name:'Panzer IV', weapon:'75mm KwK 40', hp:760, speed:1.0, dmg:45, fireMs:2200, accuracy:0.8, range:80, isVehicle:true, score:300, color:0x4a4a3a, accent:0x6a6a4a },
  officer:  { name:'SS-Hauptsturmführer', weapon:'MP 40 + Luger', hp:900, speed:2.6, dmg:14, fireMs:320, accuracy:0.75, range:55, burst:4, score:600, color:0x3a2840, accent:0x7a5860 }
};

// ============================================================
// STATE
// ============================================================

const state = {
  screen:'title', role:'rifleman', level:0,
  score:0, wave:0, kills:0,
  best: parseInt(localStorage.getItem('dday_best')||'0',10),
  unlocked: parseInt(localStorage.getItem('dday_unlocked')||'1',10)
};

const app = document.getElementById('app');

// ============================================================
// HELPERS
// ============================================================

function rand(a,b){ return Math.random()*(b-a)+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function lerp(a,b,t){ return a+(b-a)*t; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ============================================================
// SCREEN ROUTING
// ============================================================

let scene, camera, renderer, fpsGame=null, raf=0, lastFrame=0;
let keys={}, mouseDown=false;
let touchMove={active:false,x:0,y:0}, touchLook={active:false,x:0,y:0,fire:false};
let pointerLocked=false;
let lookYaw=0, lookPitch=0;

function go(screen, opts){
  state.screen = screen;
  if (opts) Object.assign(state, opts);
  if (raf) { cancelAnimationFrame(raf); raf=0; }
  if (fpsGame) { fpsGame.cleanup(); fpsGame=null; }
  if (renderer) { renderer.dispose && renderer.dispose(); renderer=null; }
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  document.exitPointerLock && document.exitPointerLock();
  switch(screen){
    case 'title': renderTitle(); break;
    case 'role':  renderRoleSelect(); break;
    case 'level': renderLevelSelect(); break;
    case 'brief': renderBriefing(); break;
    case 'play':  startGameplay(); break;
    case 'win':   renderResult(true); break;
    case 'lose':  renderResult(false); break;
  }
}
function wireButtons(){
  app.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', ()=> go(el.getAttribute('data-go')));
  });
}

// ============================================================
// SCREEN: TITLE
// ============================================================

function renderTitle(){
  const threeOK = !!window.THREE;
  app.innerHTML = `
    <section class="dday-screen dday-title">
      <div class="dday-stars"></div>
      <div class="dday-title-inner">
        <div class="dday-title-tag">June 6, 1944</div>
        <h1 class="dday-title-heading">D-DAY<span>Beach Assault</span></h1>
        <div class="dday-title-line"></div>
        <p class="dday-title-blurb">True 3D first-person. Run out of the surf. Find cover. Take the seawall.</p>
        <div class="dday-title-stats">
          <div><b>${state.best}</b><span>Best Score</span></div>
          <div><b>${state.unlocked}</b><span>Levels</span></div>
          <div><b>${ROLE_ORDER.length}</b><span>Roles</span></div>
        </div>
        <button class="dday-btn dday-btn-primary" data-go="role">Deploy →</button>
        <div class="dday-title-hint">
          <kbd>WASD</kbd> walk · <kbd>Mouse</kbd> look · <kbd>Click</kbd> fire · <kbd>R</kbd> reload · <kbd>Q</kbd> ability · <kbd>Shift</kbd> sprint<br>
          Touch: left stick = walk, right stick = look, FIRE button = shoot
        </div>
        ${threeOK ? '' : '<div class="dday-warn">⚠ Three.js (3D engine) failed to load — check your internet.</div>'}
        <div class="dday-build">build ${BUILD_VERSION}</div>
      </div>
    </section>
  `;
  wireButtons();
}

// ============================================================
// SCREEN: ROLE SELECT
// ============================================================

function renderRoleSelect(){
  const cards = ROLE_ORDER.map(id=>{
    const r=ROLES[id], w=r.weapon;
    const selected = state.role===id ? 'selected' : '';
    return `
      <div class="dday-role-card ${selected}" data-pick-role="${id}" style="--accent:${r.accentHex};--accent-dark:${r.colorHex}">
        <div class="dday-role-icon">${r.icon}</div>
        <div class="dday-role-name">${escapeHtml(r.name)}</div>
        <div class="dday-role-sub">${escapeHtml(r.fullName)}</div>
        <div class="dday-role-unit">${escapeHtml(r.unit)}</div>
        <p class="dday-role-blurb">${escapeHtml(r.blurb)}</p>
        <div class="dday-role-weapon"><b>${escapeHtml(w.name)}</b><span>${w.mag} rnd · ${w.auto?'auto':'semi'}</span></div>
        <div class="dday-role-stats">
          <div><span>HP</span><div class="dday-stat-bar"><i style="width:${r.hp/1.5}%"></i></div></div>
          <div><span>DMG</span><div class="dday-stat-bar"><i style="width:${clamp(w.dmg*0.9,10,100)}%"></i></div></div>
          <div><span>RoF</span><div class="dday-stat-bar"><i style="width:${clamp(100-w.fireMs/12,10,100)}%"></i></div></div>
          <div><span>RNG</span><div class="dday-stat-bar"><i style="width:${clamp(w.range,30,100)}%"></i></div></div>
        </div>
        <div class="dday-role-ability"><b>${escapeHtml(r.ability.name)}</b> <span>(Q)</span><br><em>${escapeHtml(r.ability.desc)}</em></div>
      </div>`;
  }).join('');
  app.innerHTML = `
    <section class="dday-screen dday-role-select">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="title">← Back</button>
        <h2>Choose Your Soldier</h2><span class="dday-spacer"></span>
      </div>
      <div class="dday-roles-grid">${cards}</div>
      <div class="dday-bottom"><button class="dday-btn dday-btn-primary" data-go="level">Continue →</button></div>
    </section>`;
  wireButtons();
  app.querySelectorAll('[data-pick-role]').forEach(el=>{
    el.addEventListener('click',()=>{ state.role=el.getAttribute('data-pick-role'); renderRoleSelect(); });
  });
}

// ============================================================
// SCREEN: LEVEL SELECT
// ============================================================

function renderLevelSelect(){
  const cards = LEVELS.map((l,i)=>{
    const locked = i >= state.unlocked;
    const stars = '★'.repeat(l.difficulty)+'☆'.repeat(5-l.difficulty);
    return `
      <div class="dday-level-card ${locked?'locked':''}" data-pick-level="${i}">
        <div class="dday-level-icon">${l.icon}</div>
        <div class="dday-level-name">${escapeHtml(l.name)}</div>
        <div class="dday-level-sub">${escapeHtml(l.subtitle)}</div>
        <div class="dday-level-stars">${stars}</div>
        ${locked?'<div class="dday-level-locked">🔒 Beat previous to unlock</div>':''}
      </div>`;
  }).join('');
  app.innerHTML = `
    <section class="dday-screen dday-level-select">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="role">← Back</button>
        <h2>Choose Your Mission</h2><span class="dday-spacer"></span>
      </div>
      <div class="dday-current-role">Playing as <b style="color:${ROLES[state.role].accentHex}">${ROLES[state.role].icon} ${escapeHtml(ROLES[state.role].name)}</b></div>
      <div class="dday-levels-grid">${cards}</div>
    </section>`;
  wireButtons();
  app.querySelectorAll('[data-pick-level]').forEach(el=>{
    el.addEventListener('click',()=>{
      const i = parseInt(el.getAttribute('data-pick-level'),10);
      if (i >= state.unlocked) return;
      state.level = i; go('brief');
    });
  });
}

// ============================================================
// SCREEN: BRIEFING
// ============================================================

function renderBriefing(){
  const l=LEVELS[state.level], r=ROLES[state.role];
  app.innerHTML = `
    <section class="dday-screen dday-brief">
      <div class="dday-top">
        <button class="dday-btn-back" data-go="level">← Back</button>
        <h2>Mission Briefing</h2><span class="dday-spacer"></span>
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
            <div class="dday-brief-role" style="background:${r.colorHex};color:#fff">${r.icon} ${escapeHtml(r.name)}</div>
            <div class="dday-brief-sub">${escapeHtml(r.fullName)}</div>
          </div>
        </div>
        <div class="dday-brief-divider"></div>
        <p class="dday-brief-text">${escapeHtml(l.brief)}</p>
        <div class="dday-brief-fact"><span>📜 Historical Note</span><p>${escapeHtml(l.historicalFact)}</p></div>
        <div class="dday-brief-objective"><span>OBJECTIVE</span><p>True 3D first-person. Click canvas to lock mouse. Survive ${l.waves} waves and take down the position.</p></div>
        <button class="dday-btn dday-btn-primary dday-btn-large" data-go="play">Engage</button>
      </div>
    </section>`;
  wireButtons();
}

// ============================================================
// GAMEPLAY — Three.js FPS
// ============================================================

function startGameplay(){
  if (!window.THREE) {
    app.innerHTML = '<section class="dday-screen dday-error"><h2>3D engine failed to load</h2><p>Three.js could not be reached. Check your internet, then try again.</p><button class="dday-btn dday-btn-primary" data-go="title">Back to Title</button></section>';
    wireButtons();
    return;
  }
  const l=LEVELS[state.level], r=ROLES[state.role];
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
        <div class="dday-fps-crosshair"></div>
        <div class="dday-fps-gun" id="dday-fps-gun"></div>
      </div>
      <div class="dday-pointer-prompt" id="dday-prompt">
        <h3>Click to play</h3>
        <p>Mouse will be captured for looking around. Press <kbd>Esc</kbd> to release.</p>
      </div>
      <div class="dday-mobile-controls">
        <div class="dday-mobile-stick" id="mob-move"><div class="dday-mobile-knob" id="mob-move-knob"></div></div>
        <div class="dday-mobile-stick dday-mobile-stick-right" id="mob-aim">
          <div class="dday-mobile-knob" id="mob-aim-knob"></div>
          <div class="dday-mobile-fire" id="mob-fire">FIRE</div>
        </div>
        <button class="dday-touch-ability" id="dday-touch-ability">${r.icon}</button>
        <button class="dday-touch-reload" id="dday-touch-reload">⟳</button>
      </div>
      <button class="dday-pause" id="dday-pause">⏸</button>
      <div class="dday-toast" id="dday-toast"></div>
    </section>`;
  const canvas = document.getElementById('dday-canvas');
  fpsGame = new FpsGame(r, l, canvas);
  setupInput(canvas);
  document.getElementById('dday-pause').addEventListener('click', ()=>{
    if (fpsGame.paused) fpsGame.resume(); else fpsGame.pause();
  });
  const tAb = document.getElementById('dday-touch-ability');
  const tRl = document.getElementById('dday-touch-reload');
  if (tAb) tAb.addEventListener('click', e=>{ e.preventDefault(); if (fpsGame) fpsGame.useAbility(); });
  if (tRl) tRl.addEventListener('click', e=>{ e.preventDefault(); if (fpsGame) fpsGame.reload(); });
  lastFrame = performance.now();
  raf = requestAnimationFrame(loop);
}

function loop(now){
  const dt = Math.min(0.05, (now-lastFrame)/1000);
  lastFrame = now;
  if (fpsGame && !fpsGame.paused) {
    fpsGame.update(dt);
    fpsGame.render();
  }
  raf = requestAnimationFrame(loop);
}

// ============================================================
// FPS GAME CLASS
// ============================================================

class FpsGame {
  constructor(role, level, canvas) {
    this.role = role;
    this.level = level;
    this.canvas = canvas;

    // Three.js setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(level.palette.sky);
    this.scene.fog = new THREE.Fog(level.palette.fog, 20, 140);

    const aspect = window.innerWidth/window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 500);
    this.camera.position.set(0, 1.7, 60);  // spawn at "water" end of beach
    this.camera.rotation.order = 'YXZ';
    lookYaw = Math.PI; // face -Z (into the beach)
    lookPitch = 0;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    renderer = this.renderer;
    scene = this.scene;
    camera = this.camera;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(8, 20, 5);
    this.scene.add(sun);

    // Build map
    this.obstacles = [];   // {mesh, x, z, r, type, blocks}
    this.enemies = [];     // FpsEnemy instances
    this.allies = [];      // ally meshes
    this.bullets = [];     // {mesh, from, to, t, dur, owner, dmg}
    this.tracers = [];     // visual hits
    this.particles = [];   // small puff meshes
    this.grenades = [];

    this.buildMap();

    // Player
    this.hp = role.hp;
    this.maxHp = role.hp;
    this.mag = role.weapon.mag;
    this.reserve = role.weapon.reserve;
    this.reloading = false;
    this.reloadTimer = 0;
    this.lastFire = 0;
    this.iframes = 0;
    this.sprintActive = false;
    this.firing = false;
    this.lastAbility = -99999;
    this.abilityActive = 0;
    this.nextShotMul = 1;
    this.nextShotPierce = false;

    // Wave system
    this.wave = 1;
    this.waveTimer = 2.0;
    this.state = 'pre-wave';
    this.boss = null;
    this.bossSpawned = false;

    // Scoring
    this.score = 0;
    this.kills = 0;
    this.factIndex = 0;

    this.paused = false;
    this.over = false;
    this.time = 0;
    this.shake = 0;
    this.flashHit = 0;
    this.gunBob = 0;
    this.gunRecoil = 0;
    this.muzzleFlash = 0;

    window.addEventListener('resize', this._resize = ()=>{
      this.camera.aspect = window.innerWidth/window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.toast('Off the boat — find cover and push up the beach', 2400);
    this.drawGun();
  }

  cleanup() {
    window.removeEventListener('resize', this._resize);
    if (this.renderer) {
      this.renderer.dispose();
      // Dispose geometry/materials
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m=>m.dispose());
          else obj.material.dispose();
        }
      });
    }
  }

  // ---- WORLD ----

  buildMap() {
    const pal = this.level.palette;
    const t = this.level.terrain;

    // Ground
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshLambertMaterial({ color: pal.ground });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI/2;
    ground.position.set(0, 0, 0);
    this.scene.add(ground);

    if (t === 'beach') {
      // Water at the player-spawn end (positive Z)
      const waterGeo = new THREE.PlaneGeometry(200, 50);
      const waterMat = new THREE.MeshLambertMaterial({ color: pal.water });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.rotation.x = -Math.PI/2;
      water.position.set(0, 0.02, 75);
      this.scene.add(water);
      this.water = water;

      // Seawall at far end
      const wallMat = new THREE.MeshLambertMaterial({ color: 0x5a5048 });
      const wall = new THREE.Mesh(new THREE.BoxGeometry(200, 3, 2), wallMat);
      wall.position.set(0, 1.5, -55);
      this.scene.add(wall);

      // Bunkers at the far end
      this.makeBunker(-25, -52);
      this.makeBunker( 25, -52);

      // Czech hedgehogs scattered through middle (cover)
      for (let i=0; i<18; i++) {
        this.makeHedgehog(rand(-45,45), rand(0, 35));
      }
      // Sandbag walls near front (cover)
      for (let i=0; i<8; i++) {
        this.makeSandbag(rand(-40,40), rand(-30,-10));
      }
    } else if (t === 'bocage') {
      // Two long hedgerow walls with a gap, repeated
      for (let row=0; row<3; row++) {
        const z = 30 - row*40;
        const gapX = rand(-15, 15);
        for (let x=-50; x<=50; x+=8) {
          if (Math.abs(x-gapX) < 8) continue;
          this.makeHedge(x, z);
        }
      }
    } else if (t === 'cliffs') {
      // Lots of rocks
      for (let i=0; i<32; i++) this.makeRock(rand(-50,50), rand(-50, 50));
      // Edge wall at one side
      const edgeMat = new THREE.MeshLambertMaterial({ color: 0x4a4030 });
      const edge = new THREE.Mesh(new THREE.BoxGeometry(200, 4, 4), edgeMat);
      edge.position.set(0, 2, -60);
      this.scene.add(edge);
    } else if (t === 'town') {
      // Buildings
      for (let i=0; i<8; i++) this.makeBuilding(rand(-45,45), rand(-50, 50));
      // Church steeple in middle-far
      this.makeChurch(0, -50);
    }

    // Allies near player spawn
    for (let i=0; i<5; i++) {
      const ally = this.makeAllyMesh(rand(-12,12), 0, 55 + rand(-5, 5));
      this.allies.push(ally);
    }
  }

  addObstacle(mesh, x, z, r) {
    this.obstacles.push({ mesh, x, z, r });
  }
  makeHedgehog(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2a1a0e });
    const beam = new THREE.BoxGeometry(0.3, 0.3, 3);
    const g = new THREE.Group();
    const b1 = new THREE.Mesh(beam, mat); b1.rotation.set(0, Math.PI/4, Math.PI/4); g.add(b1);
    const b2 = new THREE.Mesh(beam, mat); b2.rotation.set(0, -Math.PI/4, Math.PI/4); g.add(b2);
    const b3 = new THREE.Mesh(beam, mat); b3.rotation.set(Math.PI/2, 0, 0); g.add(b3);
    g.position.set(x, 0.9, z);
    this.scene.add(g);
    this.addObstacle(g, x, z, 1.0);
  }
  makeSandbag(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xa89070 });
    for (let i=0; i<3; i++) {
      const bag = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1), mat);
      bag.position.y = 0.25 + i*0.5;
      bag.position.x = (i%2)*0.2;
      g.add(bag);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rand(0, Math.PI*2);
    this.scene.add(g);
    this.addObstacle(g, x, z, 1.1);
  }
  makeBunker(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x5a5048 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 5), mat);
    body.position.y = 1.5; g.add(body);
    // gun slit
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const slit = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 0.2), slitMat);
    slit.position.set(0, 2.0, 2.51); g.add(slit);
    // roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 6), new THREE.MeshLambertMaterial({ color: 0x3a3530 }));
    roof.position.y = 3.2; g.add(roof);
    g.position.set(x, 0, z);
    this.scene.add(g);
    this.addObstacle(g, x, z, 4);
  }
  makeHedge(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2a3a18 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 1.5), mat);
    m.position.set(x, 1.5, z);
    this.scene.add(m);
    this.addObstacle(m, x, z, 1.5);
  }
  makeRock(x, z) {
    const mat = new THREE.MeshLambertMaterial({ color: this.level.palette.stone });
    const r = rand(0.7, 1.4);
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), mat);
    m.position.set(x, r*0.6, z);
    m.rotation.set(rand(0,Math.PI), rand(0,Math.PI), rand(0,Math.PI));
    this.scene.add(m);
    this.addObstacle(m, x, z, r);
  }
  makeBuilding(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: this.level.palette.stone });
    const w = rand(4, 7), h = rand(3, 5), d = rand(4, 7);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    body.position.y = h/2; g.add(body);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.7, 2, 4), new THREE.MeshLambertMaterial({ color: 0x5a3828 }));
    roof.position.y = h + 1; roof.rotation.y = Math.PI/4;
    g.add(roof);
    g.position.set(x, 0, z);
    g.rotation.y = rand(0, Math.PI*2);
    this.scene.add(g);
    this.addObstacle(g, x, z, Math.max(w, d)*0.5);
  }
  makeChurch(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x7a7060 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), mat);
    body.position.y = 3; g.add(body);
    const steeple = new THREE.Mesh(new THREE.ConeGeometry(2, 8, 4), new THREE.MeshLambertMaterial({ color: 0x4a3828 }));
    steeple.position.y = 10; steeple.rotation.y = Math.PI/4;
    g.add(steeple);
    g.position.set(x, 0, z);
    this.scene.add(g);
    this.addObstacle(g, x, z, 3.5);
  }
  makeAllyMesh(x, y, z) {
    const g = new THREE.Group();
    // legs
    const legMat = new THREE.MeshLambertMaterial({ color: 0x4a6741 });
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), legMat);
    legs.position.y = 0.45; g.add(legs);
    // body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.5), new THREE.MeshLambertMaterial({ color: 0x4a6741 }));
    body.position.y = 1.4; g.add(body);
    // head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0xc89878 }));
    head.position.y = 2.1; g.add(head);
    // helmet (M1)
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshLambertMaterial({ color: 0x5a6840 }));
    helmet.position.y = 2.32; helmet.scale.y = 0.6; g.add(helmet);
    // rifle
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 1.2), new THREE.MeshLambertMaterial({ color: 0x3a2a18 }));
    rifle.position.set(0.4, 1.35, 0.3); rifle.rotation.x = -0.1; g.add(rifle);
    g.position.set(x, y, z);
    this.scene.add(g);
    return { mesh: g, hp: 50, dead: false, lastShot: 0, targetZ: rand(0, 20) };
  }

  // ---- ENEMIES ----

  spawnWave() {
    const baseCount = 4 + this.wave;
    const count = Math.round(baseCount * this.level.enemyCount);
    for (let i=0; i<count; i++) {
      const type = this.pickEnemyType();
      const x = rand(-40, 40);
      const z = rand(-50, -25);
      this.spawnEnemy(type, x, z);
    }
    this.state = 'wave';
    this.toast(`Wave ${this.wave} of ${this.level.waves}`, 1200);
  }
  pickEnemyType() {
    const w = this.wave, r = Math.random();
    if (w===1) return r<0.75 ? 'infantry' : 'rifleman';
    if (w===2) return r<0.5 ? 'infantry' : r<0.85 ? 'rifleman' : 'mg';
    if (w===3) return r<0.35 ? 'infantry' : r<0.65 ? 'rifleman' : r<0.88 ? 'mg' : 'sniper';
    return r<0.25 ? 'infantry' : r<0.5 ? 'rifleman' : r<0.75 ? 'mg' : r<0.9 ? 'sniper' : 'ss';
  }
  spawnEnemy(typeId, x, z) {
    const t = ENEMY_TYPES[typeId];
    const g = new THREE.Group();
    // legs
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), new THREE.MeshLambertMaterial({ color: t.color })));
    g.children[0].position.y = 0.45;
    // body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.5), new THREE.MeshLambertMaterial({ color: t.color }));
    body.position.y = 1.4; g.add(body);
    // head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0xa88060 }));
    head.position.y = 2.1; g.add(head);
    // Stahlhelm (wider, flatter)
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshLambertMaterial({ color: t.accent }));
    helmet.position.y = 2.3; helmet.scale.y = 0.5; helmet.scale.x = 1.1; helmet.scale.z = 1.1;
    g.add(helmet);
    // rifle
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.2), new THREE.MeshLambertMaterial({ color: 0x1a1008 }));
    rifle.position.set(0.4, 1.35, 0.3); g.add(rifle);
    g.position.set(x, 0, z);
    this.scene.add(g);

    const hpBarGeo = new THREE.PlaneGeometry(1, 0.08);
    const hpBg = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 }));
    hpBg.position.y = 2.8;
    g.add(hpBg);
    const hpFg = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x80c060 }));
    hpFg.position.set(0, 2.8, 0.01);
    g.add(hpFg);

    this.enemies.push({
      typeId, type:t, mesh:g, hpBg, hpFg,
      x, z,
      hp: t.hp * this.level.enemyHP,
      maxHp: t.hp * this.level.enemyHP,
      lastShot: 0,
      dead: false, dying: 0,
      hitFlash: 0,
      boss: false
    });
  }
  spawnBoss() {
    const b = this.level.boss;
    const t = ENEMY_TYPES[b.type];
    // Build a bigger soldier or bunker
    const g = new THREE.Group();
    if (t.isStatic) {
      // MG bunker (big)
      const mat = new THREE.MeshLambertMaterial({ color: 0x3a2828 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 6), mat);
      body.position.y = 2; g.add(body);
      const slit = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 0.3), new THREE.MeshBasicMaterial({ color: 0 }));
      slit.position.set(0, 2.5, 3.01); g.add(slit);
    } else if (t.isVehicle) {
      // Tank
      const mat = new THREE.MeshLambertMaterial({ color: t.color });
      const hull = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 7), mat);
      hull.position.y = 0.8; g.add(hull);
      const turret = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 3.5), new THREE.MeshLambertMaterial({ color: t.accent }));
      turret.position.y = 2.1; g.add(turret);
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 4), new THREE.MeshLambertMaterial({ color: 0x1a1008 }));
      barrel.position.set(0, 2.1, 4); g.add(barrel);
      // tracks
      const trackMat = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
      const tL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 7.5), trackMat);
      tL.position.set(-2.2, 0.3, 0); g.add(tL);
      const tR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 7.5), trackMat);
      tR.position.set( 2.2, 0.3, 0); g.add(tR);
    } else {
      // Officer (bigger soldier)
      const mat = new THREE.MeshLambertMaterial({ color: t.color });
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.5), mat));
      g.children[0].position.y = 0.55;
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.6), mat);
      body.position.y = 1.6; g.add(body);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0xa88060 }));
      head.position.y = 2.4; g.add(head);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.6), new THREE.MeshLambertMaterial({ color: t.accent }));
      cap.position.y = 2.7; g.add(cap);
    }
    g.position.set(0, 0, -50);
    this.scene.add(g);
    const hpBarGeo = new THREE.PlaneGeometry(2, 0.15);
    const hpBg = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 }));
    hpBg.position.y = 4.5;
    g.add(hpBg);
    const hpFg = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0xc83040 }));
    hpFg.position.set(0, 4.5, 0.01);
    g.add(hpFg);

    const e = {
      typeId: b.type, type: t, mesh: g, hpBg, hpFg,
      x: 0, z: -50,
      hp: b.hp, maxHp: b.hp,
      lastShot: 0,
      dead: false, dying: 0,
      hitFlash: 0,
      boss: true
    };
    this.enemies.push(e);
    this.boss = e;
    this.bossSpawned = true;
    this.state = 'boss';
    this.toast('⚠ Boss approaching', 1800);
  }

  // ---- PLAYER ACTIONS ----

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
    // Aim direction = camera forward + spread
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const spread = w.spread + (this.abilityActive > 0 && this.role.id === 'heavy' ? 0 : 0);
    if (spread > 0) {
      dir.x += rand(-spread, spread);
      dir.y += rand(-spread, spread);
      dir.normalize();
    }
    // Raycast for hit
    const origin = this.camera.position.clone();
    let dmg = w.dmg * this.nextShotMul;
    this.nextShotMul = 1;
    if (this.abilityActive > 0 && this.role.id === 'heavy') dmg *= 2;
    const pierce = this.nextShotPierce;
    this.nextShotPierce = false;

    const ray = new THREE.Raycaster(origin, dir, 0, w.range);
    // Build hit list: enemies (sorted by distance) + obstacles
    const enemyMeshes = this.enemies.filter(e=>!e.dead).map(e=>e.mesh);
    const obstacleMeshes = this.obstacles.map(o=>o.mesh);
    const targets = [...enemyMeshes, ...obstacleMeshes];
    const hits = ray.intersectObjects(targets, true);
    // Filter only those with distance > 0; find first enemy or obstacle
    let hitPoint = origin.clone().add(dir.clone().multiplyScalar(w.range));
    if (hits.length > 0) {
      // Process hits in order
      for (const h of hits) {
        // Find enemy this mesh belongs to
        const e = this.enemies.find(en => en.mesh === h.object || en.mesh.children.includes(h.object));
        if (e && !e.dead) {
          this.hitEnemy(e, dmg);
          hitPoint = h.point;
          if (!pierce) break;
          continue;
        }
        // Otherwise it's an obstacle — bullet stops
        if (!pierce) {
          hitPoint = h.point;
          break;
        }
      }
    }
    // Visual: tracer
    this.spawnTracer(this.camera.position.clone().add(dir.clone().multiplyScalar(0.5)), hitPoint);
    this.muzzleFlash = 0.07;
    this.gunRecoil = w.recoil;
    this.shake = Math.max(this.shake, 0.03);
    // Add pitch kickback
    lookPitch -= w.recoil * 0.6;
    if (this.mag === 0) this.toast('Out of ammo — press R', 900);
    this.updateAmmoHUD();
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
    } else if (r.id === 'paratrooper') {
      this.abilityActive = 2.0;
      this.sprintActive = true;
      this.toast('Sprint!', 1200);
    } else if (r.id === 'medic') {
      this.hp = Math.min(this.maxHp, this.hp + 60);
      this.updateHpHUD();
      this.toast('+60 HP', 1100);
    } else if (r.id === 'ranger') {
      // Grenade: throw forward
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      const start = this.camera.position.clone();
      const target = start.clone().add(dir.multiplyScalar(20));
      target.y = 0.5;
      this.grenades.push({ start, target, t: 0, dur: 0.8, exploded: false, mesh: null });
    } else if (r.id === 'sniper') {
      this.nextShotPierce = true;
      this.nextShotMul = 1.5;
      this.toast('Piercing shot ready', 1300);
    } else if (r.id === 'heavy') {
      this.abilityActive = 2.0;
      this.toast('Braced — ×2 damage', 1200);
    }
  }

  spawnTracer(from, to) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffeb88 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, life: 0.06 });
  }

  hitEnemy(e, dmg) {
    e.hp -= dmg;
    e.hitFlash = 0.15;
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      e.dying = 0.5;
      this.score += e.boss ? 700 : e.type.score;
      this.kills++;
      this.updateScoreHUD();
    }
  }
  damagePlayer(dmg) {
    if (this.over || this.iframes > 0) return;
    this.hp = Math.max(0, this.hp - dmg);
    this.flashHit = 0.18;
    this.shake = Math.min(0.3, this.shake + 0.08);
    this.updateHpHUD();
    if (this.hp <= 0) this.lose();
  }

  // ---- UPDATE ----

  update(dt) {
    this.time += dt;

    // Movement
    const sp = 6 * (this.sprintActive || keys['shift'] ? 1.6 : 1);
    let mx = 0, mz = 0;
    if (keys['w'] || keys['arrowup'])    mz -= 1;
    if (keys['s'] || keys['arrowdown'])  mz += 1;
    if (keys['a'] || keys['arrowleft'])  mx -= 1;
    if (keys['d'] || keys['arrowright']) mx += 1;
    if (touchMove.active) { mx += touchMove.x; mz += touchMove.y; }
    const len = Math.hypot(mx, mz);
    if (len > 0) { mx /= len; mz /= len; this.gunBob += dt * (sp/2); }

    // Touch look (relative input)
    if (touchLook.active) {
      lookYaw   -= touchLook.x * dt * 2.2;
      lookPitch -= touchLook.y * dt * 1.8;
      lookPitch = clamp(lookPitch, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
    }

    // Apply yaw/pitch to camera
    this.camera.rotation.y = lookYaw;
    this.camera.rotation.x = lookPitch;

    // Resolve movement relative to yaw
    const cosY = Math.cos(lookYaw), sinY = Math.sin(lookYaw);
    let dx = (mx * cosY + mz * sinY) * sp * dt;
    let dz = (-mx * sinY + mz * cosY) * sp * dt;
    // Slower in water
    const inWater = this.camera.position.z > 50;
    if (inWater) { dx *= 0.6; dz *= 0.6; }
    // Apply with obstacle collision
    this.movePlayer(dx, dz);

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
    // Auto-fire when held (autoweapons) + touch fire button
    const wantFire = (mouseDown || touchLook.fire);
    if (wantFire) {
      if (this.role.weapon.auto) this.tryFire();
    }

    // Ability
    if (this.abilityActive > 0) {
      this.abilityActive -= dt;
      if (this.abilityActive <= 0) this.sprintActive = false;
    }
    if (this.iframes > 0) this.iframes -= dt;
    if (this.flashHit > 0) this.flashHit -= dt;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 1.2);
    if (this.muzzleFlash > 0) this.muzzleFlash -= dt;
    if (this.gunRecoil > 0) this.gunRecoil = Math.max(0, this.gunRecoil - dt * 1.5);

    // Wave system
    if (this.state === 'pre-wave') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) this.spawnWave();
    } else if (this.state === 'wave') {
      const alive = this.enemies.filter(e=>!e.dead).length;
      if (alive === 0) {
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

    // Update enemies
    for (const e of this.enemies) this.updateEnemy(e, dt);
    // Remove dead-and-faded
    this.enemies = this.enemies.filter(e => {
      if (e.dead && e.dying <= 0) { this.scene.remove(e.mesh); return false; }
      return true;
    });

    // Allies
    for (const a of this.allies) this.updateAlly(a, dt);
    this.allies = this.allies.filter(a => {
      if (a.dead) { this.scene.remove(a.mesh); return false; }
      return true;
    });

    // Tracers fade
    for (const t of this.tracers) {
      t.life -= dt;
      if (t.line.material) t.line.material.opacity = Math.max(0, t.life / 0.06);
      t.line.material.transparent = true;
    }
    this.tracers = this.tracers.filter(t => {
      if (t.life <= 0) { this.scene.remove(t.line); return false; }
      return true;
    });

    // Grenades
    for (const g of this.grenades) this.updateGrenade(g, dt);
    this.grenades = this.grenades.filter(g => {
      if (g.age >= g.dur + 0.4) {
        if (g.mesh) this.scene.remove(g.mesh);
        return false;
      }
      return true;
    });

    // Camera shake (apply small offset)
    if (this.shake > 0) {
      this.camera.position.x += rand(-this.shake*0.05, this.shake*0.05);
      this.camera.position.y += rand(-this.shake*0.05, this.shake*0.05);
    }

    // HP bar billboarding
    for (const e of this.enemies) {
      if (e.hpBg) { e.hpBg.lookAt(this.camera.position); }
      if (e.hpFg) {
        e.hpFg.lookAt(this.camera.position);
        const pct = Math.max(0, e.hp / e.maxHp);
        e.hpFg.scale.x = pct;
        e.hpFg.position.x = -(1-pct) * 0.5 * (e.boss ? 2 : 1);
      }
    }

    // Boss HP bar in DOM
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

    // Ability HUD
    const cd = this.role.ability.cooldown;
    const since = this.time * 1000 - this.lastAbility;
    const fillEl = document.querySelector('.dday-hud-ability-fill');
    if (fillEl) {
      const pct = clamp(since / cd, 0, 1);
      fillEl.style.width = (pct * 100) + '%';
      const ab = document.getElementById('hud-ability');
      if (ab) ab.classList.toggle('ready', pct >= 1);
    }

    // Update gun overlay
    this.drawGun();

    // Update hit flash overlay
    this.updateFlashOverlay();
  }

  movePlayer(dx, dz) {
    const p = this.camera.position;
    const r = 0.5;
    let nx = p.x + dx;
    if (!this.collidesObstacle(nx, p.z, r)) p.x = nx;
    let nz = p.z + dz;
    if (!this.collidesObstacle(p.x, nz, r)) p.z = nz;
    // Clamp to map
    p.x = clamp(p.x, -90, 90);
    p.z = clamp(p.z, -65, 90);
    p.y = 1.7;
  }
  collidesObstacle(x, z, r) {
    for (const o of this.obstacles) {
      const dx = x - o.x, dz = z - o.z;
      if (dx*dx + dz*dz < (r + o.r) ** 2) return true;
    }
    return false;
  }
  lineOfSight(ax, az, bx, bz) {
    // Step along segment, check no obstacle in the way
    const dx = bx - ax, dz = bz - az;
    const dist = Math.hypot(dx, dz);
    const steps = Math.max(2, Math.floor(dist * 2));
    for (let i=1; i<steps; i++) {
      const t = i/steps;
      const x = ax + dx*t, z = az + dz*t;
      for (const o of this.obstacles) {
        const odx = x - o.x, odz = z - o.z;
        if (odx*odx + odz*odz < (o.r*0.85)**2) return false;
      }
    }
    return true;
  }

  updateEnemy(e, dt) {
    if (e.dead) {
      e.dying -= dt;
      if (e.mesh) {
        e.mesh.rotation.z = (1 - e.dying * 2) * Math.PI / 2;
        e.mesh.position.y = (1 - e.dying * 2) * -0.3;
      }
      return;
    }
    if (e.hitFlash > 0) e.hitFlash -= dt;
    // Update mesh tint via material
    // (skipped — too costly per frame)

    const px = this.camera.position.x;
    const pz = this.camera.position.z;
    const dx = px - e.x, dz = pz - e.z;
    const d = Math.hypot(dx, dz);
    // Face player
    e.mesh.rotation.y = Math.atan2(dx, dz);

    // Move toward player but stop at range
    if (!e.type.isStatic && d > 25) {
      const sp = e.type.speed;
      const ang = Math.atan2(dx, dz);
      const nx = e.x + Math.sin(ang) * sp * dt;
      const nz = e.z + Math.cos(ang) * sp * dt;
      // Avoid obstacles
      if (!this.collidesObstacle(nx, nz, 0.6)) { e.x = nx; e.z = nz; }
      e.mesh.position.x = e.x; e.mesh.position.z = e.z;
    }

    // Touch damage
    if (d < 2) this.damagePlayer(e.type.dmg * 0.5 * dt);

    // Fire if LOS + in range
    const now = this.time * 1000;
    if (d < e.type.range && now - e.lastShot > e.type.fireMs && this.lineOfSight(e.x, e.z, px, pz)) {
      e.lastShot = now;
      const burst = e.type.burst || 1;
      for (let i=0; i<burst; i++) {
        setTimeout(()=>{
          if (e.dead || !fpsGame || fpsGame.over || fpsGame.paused) return;
          // Hit chance based on accuracy and distance
          const dd = Math.hypot(this.camera.position.x - e.x, this.camera.position.z - e.z);
          const distFactor = clamp(1 - dd / e.type.range, 0.2, 1);
          const hit = Math.random() < e.type.accuracy * distFactor;
          if (hit) this.damagePlayer(e.type.dmg * (e.boss ? 1.2 : 1));
          // Visual tracer from enemy to camera
          const from = new THREE.Vector3(e.x, 1.5, e.z);
          const to = this.camera.position.clone();
          this.spawnEnemyTracer(from, to);
        }, i * 110);
      }
    }
  }

  spawnEnemyTracer(from, to) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({ color: 0xff5040 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, life: 0.07 });
  }

  updateAlly(a, dt) {
    if (a.dead) return;
    // Advance forward (negative Z)
    if (a.mesh.position.z > a.targetZ) {
      a.mesh.position.z -= 1.0 * dt;
    } else {
      // Shoot at nearest enemy
      let target = null, bd = 40;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const dx = e.x - a.mesh.position.x, dz = e.z - a.mesh.position.z;
        const d = Math.hypot(dx, dz);
        if (d < bd) { target = e; bd = d; }
      }
      if (target) {
        a.mesh.rotation.y = Math.atan2(target.x - a.mesh.position.x, target.z - a.mesh.position.z);
        const now = this.time * 1000;
        if (now - a.lastShot > 1300) {
          a.lastShot = now;
          if (Math.random() < 0.5) this.hitEnemy(target, 10);
          this.spawnTracer(
            new THREE.Vector3(a.mesh.position.x, 1.6, a.mesh.position.z),
            new THREE.Vector3(target.x, 1.5, target.z)
          );
        }
      }
    }
  }

  updateGrenade(g, dt) {
    g.age = (g.age || 0) + dt;
    if (!g.mesh) {
      g.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshLambertMaterial({ color: 0x1a2a18 }));
      this.scene.add(g.mesh);
    }
    if (!g.exploded) {
      const p = clamp(g.age / g.dur, 0, 1);
      const x = lerp(g.start.x, g.target.x, p);
      const y = lerp(g.start.y, g.target.y, p) + Math.sin(p * Math.PI) * 4;
      const z = lerp(g.start.z, g.target.z, p);
      g.mesh.position.set(x, y, z);
      if (g.age >= g.dur) {
        g.exploded = true;
        const R = 6;
        for (const e of this.enemies) {
          if (e.dead) continue;
          const dx = e.x - g.target.x, dz = e.z - g.target.z;
          if (dx*dx + dz*dz < R*R) this.hitEnemy(e, 140);
        }
        // FX: expand a sphere
        const flash = new THREE.Mesh(new THREE.SphereGeometry(R, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.7 }));
        flash.position.copy(g.mesh.position);
        this.scene.add(flash);
        setTimeout(()=> this.scene.remove(flash), 200);
        this.shake = Math.max(this.shake, 0.3);
      }
    }
  }

  showIntelFact() {
    const facts = this.level.facts;
    if (!facts || facts.length === 0) return;
    const f = facts[this.factIndex % facts.length];
    this.factIndex++;
    const el = document.getElementById('dday-intel');
    if (!el) return;
    el.innerHTML = `<div class="dday-intel-card"><span>📜 INTEL</span><b>${escapeHtml(f.title)}</b><p>${escapeHtml(f.text)}</p></div>`;
    el.classList.add('show');
    clearTimeout(this._intelT);
    this._intelT = setTimeout(()=> el.classList.remove('show'), 5500);
  }

  toast(msg, dur) {
    const el = document.getElementById('dday-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(()=> el.classList.remove('show'), dur || 1200);
  }
  pause() { this.paused = true; this.toast('Paused — click ⏸ to resume', 99999); document.exitPointerLock && document.exitPointerLock(); }
  resume() { this.paused = false; const el = document.getElementById('dday-toast'); if (el) el.classList.remove('show'); lastFrame = performance.now(); }

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
  updateFlashOverlay() {
    let ov = document.querySelector('.dday-flash-ov');
    if (!ov) {
      ov = document.createElement('div');
      ov.className = 'dday-flash-ov';
      document.querySelector('.dday-play').appendChild(ov);
    }
    const a = (this.flashHit > 0 ? this.flashHit * 2.5 : 0);
    const lowHp = (this.hp / this.maxHp < 0.35) ? (0.35 - this.hp/this.maxHp)/0.35 * 0.45 : 0;
    ov.style.background = `radial-gradient(ellipse at center, rgba(180,30,30,${a + lowHp*0.5}) 0%, rgba(180,30,30,${a + lowHp}) 100%)`;
  }
  drawGun() {
    const el = document.getElementById('dday-fps-gun');
    if (!el) return;
    const recoil = this.gunRecoil * 30;
    const bobX = Math.sin(this.gunBob * 2) * 6;
    const bobY = Math.abs(Math.cos(this.gunBob)) * 4;
    el.style.transform = `translate(${bobX}px, ${recoil + bobY}px)`;
    if (this.muzzleFlash > 0) el.classList.add('flashing'); else el.classList.remove('flashing');
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
    setTimeout(()=> go('win'), 700);
  }
  lose() {
    if (this.over) return;
    this.over = true;
    state.score = this.score; state.wave = this.wave; state.kills = this.kills;
    if (this.score > state.best) { state.best = this.score; localStorage.setItem('dday_best', state.best); }
    setTimeout(()=> go('lose'), 700);
  }

  render() {
    if (!this.renderer) return;
    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================
// INPUT
// ============================================================

function setupInput(canvas) {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Pointer lock
  canvas.addEventListener('click', ()=>{
    if (!pointerLocked) {
      canvas.requestPointerLock && canvas.requestPointerLock();
    } else if (fpsGame) {
      fpsGame.tryFire();
    }
  });
  document.addEventListener('pointerlockchange', ()=>{
    pointerLocked = (document.pointerLockElement === canvas);
    const prompt = document.getElementById('dday-prompt');
    if (prompt) prompt.style.display = pointerLocked ? 'none' : 'flex';
  });
  document.addEventListener('mousemove', e=>{
    if (pointerLocked) {
      lookYaw   -= e.movementX * 0.002;
      lookPitch -= e.movementY * 0.002;
      lookPitch = clamp(lookPitch, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
    }
  });
  document.addEventListener('mousedown', ()=>{ if (pointerLocked) { mouseDown = true; if (fpsGame) fpsGame.tryFire(); } });
  document.addEventListener('mouseup', ()=>{ mouseDown = false; });
  document.addEventListener('contextmenu', e=>{ if (pointerLocked) e.preventDefault(); });

  setupTouchSticks();
}

function onKeyDown(e) {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === 'q') { e.preventDefault(); if (fpsGame) fpsGame.useAbility(); }
  if (k === 'r') { e.preventDefault(); if (fpsGame) fpsGame.reload(); }
  if (k === ' ') { e.preventDefault(); if (fpsGame) fpsGame.tryFire(); }
  if (k === 'p') { if (fpsGame) { fpsGame.paused ? fpsGame.resume() : fpsGame.pause(); } }
  if (k === 'escape') { /* pointer lock auto-releases */ }
}
function onKeyUp(e) { keys[e.key.toLowerCase()] = false; }

// Touch sticks (mobile)
let moveTouchId = null, aimTouchId = null;
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
    const rect = move.getBoundingClientRect();
    move._cx = rect.left + rect.width/2;
    move._cy = rect.top + rect.height/2;
  }
  function moveMove(e) {
    if (moveTouchId === null) return;
    for (const t of e.changedTouches) if (t.identifier === moveTouchId) {
      let dx = t.clientX - move._cx, dy = t.clientY - move._cy;
      const len = Math.hypot(dx, dy);
      if (len > RAD) { dx = dx/len*RAD; dy = dy/len*RAD; }
      moveKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      touchMove.x = dx / RAD; touchMove.y = dy / RAD;
    }
  }
  function endMove(e) {
    for (const t of e.changedTouches) if (t.identifier === moveTouchId) {
      moveTouchId = null;
      moveKnob.style.transform = 'translate(0,0)';
      touchMove.active = false; touchMove.x = 0; touchMove.y = 0;
    }
  }
  move.addEventListener('touchstart', e=>{ e.preventDefault(); startMove(e); }, { passive:false });
  window.addEventListener('touchmove', moveMove, { passive:false });
  window.addEventListener('touchend', endMove);
  window.addEventListener('touchcancel', endMove);

  function startAim(e) {
    const t = e.changedTouches[0];
    aimTouchId = t.identifier;
    touchLook.active = true;
    const rect = aim.getBoundingClientRect();
    aim._cx = rect.left + rect.width/2;
    aim._cy = rect.top + rect.height/2;
  }
  function moveAim(e) {
    if (aimTouchId === null) return;
    for (const t of e.changedTouches) if (t.identifier === aimTouchId) {
      let dx = t.clientX - aim._cx, dy = t.clientY - aim._cy;
      const len = Math.hypot(dx, dy);
      if (len > RAD) { dx = dx/len*RAD; dy = dy/len*RAD; }
      aimKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      touchLook.x = dx / RAD; touchLook.y = dy / RAD;
    }
  }
  function endAim(e) {
    for (const t of e.changedTouches) if (t.identifier === aimTouchId) {
      aimTouchId = null;
      aimKnob.style.transform = 'translate(0,0)';
      touchLook.active = false; touchLook.x = 0; touchLook.y = 0;
    }
  }
  aim.addEventListener('touchstart', e=>{ e.preventDefault(); startAim(e); }, { passive:false });
  window.addEventListener('touchmove', moveAim, { passive:false });
  window.addEventListener('touchend', endAim);
  window.addEventListener('touchcancel', endAim);

  if (fireBtn) {
    fireBtn.addEventListener('touchstart', e=>{ e.preventDefault(); touchLook.fire = true; if (fpsGame) fpsGame.tryFire(); }, { passive:false });
    fireBtn.addEventListener('touchend',   e=>{ e.preventDefault(); touchLook.fire = false; });
    fireBtn.addEventListener('mousedown',  e=>{ e.preventDefault(); touchLook.fire = true; if (fpsGame) fpsGame.tryFire(); });
    fireBtn.addEventListener('mouseup',    e=>{ e.preventDefault(); touchLook.fire = false; });
  }
}

// ============================================================
// SCREEN: RESULT (with quiz)
// ============================================================

function renderResult(won) {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  keys = {};
  const l = LEVELS[state.level], r = ROLES[state.role];
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
    </section>`;
  wireButtons();
  let quizAnswered = false;
  app.querySelectorAll('[data-quiz]').forEach(btn => {
    btn.addEventListener('click', ()=>{
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
