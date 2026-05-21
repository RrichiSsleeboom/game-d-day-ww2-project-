/* ============================================================
   D-DAY: BEACH ASSAULT — v10
   TRUE 3D FIRST-PERSON SHOOTER (Three.js).
   WASD to move, mouse to look (click canvas for pointer-lock),
   click to fire, R reload, Q ability, Shift sprint.
   Touch: dual joysticks + fire button.
   ============================================================ */

const BUILD_VERSION = 'v18 · cockpit';

// ============================================================
// PER-ROLE WEAPON SVGs  (overlay at the bottom of the screen)
// ============================================================

// Each is a 360x220 SVG showing the weapon in first-person hold.
// Distinct silhouettes so each role feels different.
function gunSVG(svgInner) {
  return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220">${svgInner}</svg>`
  ) + '")';
}

const GUN_SVGS = {
  rifleman: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a5a38"/><stop offset="1" stop-color="#2a3420"/></linearGradient></defs>
    <path d="M50,220 L60,150 Q90,135 150,130 L210,140 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M250,220 L240,140 Q280,130 360,140 L360,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="170" cy="140" rx="30" ry="20" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="244" cy="142" rx="28" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="200" y="135" width="40" height="14" fill="#3a2818" stroke="#000"/>
    <rect x="170" y="135" width="40" height="12" fill="#6a4a28" stroke="#000"/>
    <rect x="120" y="138" width="60" height="8" fill="#4a3420" stroke="#000"/>
    <rect x="100" y="140" width="22" height="6" fill="#3a2418" stroke="#000"/>
    <rect x="240" y="124" width="80" height="6" fill="#2a2218" stroke="#000"/>
    <rect x="318" y="124" width="6" height="6" fill="#1a1008"/>
    <rect x="218" y="118" width="14" height="14" fill="#3a2818" stroke="#000"/>
  `),
  paratrooper: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6e7a3a"/><stop offset="1" stop-color="#3a4220"/></linearGradient></defs>
    <path d="M60,220 L60,160 Q100,150 160,148 L210,150 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M250,220 L250,160 Q300,150 360,158 L360,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="178" cy="152" rx="32" ry="20" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="248" cy="155" rx="28" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="200" y="135" width="60" height="22" fill="#2a2018" stroke="#000"/>
    <rect x="210" y="155" width="32" height="40" fill="#3a3020" stroke="#000"/>
    <rect x="118" y="138" width="80" height="8" fill="#2a2018" stroke="#000"/>
    <rect x="105" y="136" width="14" height="12" fill="#3a2818" stroke="#000"/>
    <rect x="125" y="135" width="6" height="13" fill="#1a1008"/>
    <rect x="145" y="135" width="6" height="13" fill="#1a1008"/>
    <rect x="165" y="135" width="6" height="13" fill="#1a1008"/>
    <rect x="248" y="115" width="6" height="18" fill="#2a2018"/>
  `),
  medic: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a4040"/><stop offset="1" stop-color="#4a1818"/></linearGradient></defs>
    <path d="M80,220 L80,170 Q120,158 170,160 L210,170 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M240,220 L240,170 Q290,160 350,168 L350,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="190" cy="160" rx="28" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="245" cy="162" rx="26" ry="16" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="200" y="150" width="48" height="16" fill="#3a2818" stroke="#000"/>
    <rect x="205" y="166" width="14" height="20" fill="#2a1a08" stroke="#000"/>
    <rect x="246" y="148" width="24" height="6" fill="#2a2018" stroke="#000"/>
    <rect x="248" y="138" width="6" height="12" fill="#1a1008"/>
    <rect x="100" y="170" width="14" height="20" fill="#c83030" stroke="#000"/>
    <rect x="104" y="174" width="6" height="12" fill="#fff"/>
    <rect x="98" y="178" width="18" height="4" fill="#fff"/>
  `),
  ranger: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a5a78"/><stop offset="1" stop-color="#2a3450"/></linearGradient></defs>
    <path d="M60,220 L60,158 Q100,148 160,146 L210,150 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M250,220 L250,158 Q300,148 360,156 L360,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="178" cy="150" rx="30" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="246" cy="152" rx="26" ry="16" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="195" y="138" width="55" height="14" fill="#3a2818" stroke="#000"/>
    <rect x="200" y="152" width="18" height="26" fill="#3a2818" stroke="#000"/>
    <rect x="135" y="140" width="60" height="8" fill="#6a4a28" stroke="#000"/>
    <rect x="248" y="124" width="60" height="6" fill="#2a2218" stroke="#000"/>
    <ellipse cx="320" cy="180" rx="14" ry="14" fill="#3a4528" stroke="#000"/>
    <ellipse cx="320" cy="180" rx="8" ry="8" fill="#5a6840"/>
  `),
  sniper: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a5a3a"/><stop offset="1" stop-color="#1a3020"/></linearGradient></defs>
    <path d="M40,220 L50,150 Q90,140 150,138 L210,144 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M250,220 L240,144 Q280,138 360,148 L360,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="170" cy="148" rx="30" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="244" cy="150" rx="26" ry="16" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="195" y="135" width="60" height="14" fill="#5a4028" stroke="#000"/>
    <rect x="115" y="140" width="80" height="6" fill="#6a4a28" stroke="#000"/>
    <rect x="250" y="125" width="100" height="6" fill="#1a1008" stroke="#000"/>
    <rect x="200" y="118" width="55" height="14" fill="#1a1008" stroke="#000"/>
    <ellipse cx="205" cy="125" rx="6" ry="6" fill="#3a3a3a" stroke="#000"/>
    <ellipse cx="248" cy="125" rx="6" ry="6" fill="#3a3a3a" stroke="#000"/>
    <rect x="218" y="148" width="14" height="14" fill="#3a2818" stroke="#000"/>
  `),
  heavy: gunSVG(`
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6a5028"/><stop offset="1" stop-color="#3a2810"/></linearGradient></defs>
    <path d="M50,220 L55,155 Q95,142 150,140 L210,148 L210,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <path d="M250,220 L245,150 Q295,140 360,148 L360,220 Z" fill="url(#g)" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="172" cy="148" rx="32" ry="20" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="246" cy="152" rx="28" ry="18" fill="#5a4028" stroke="#000" stroke-width="1.5"/>
    <rect x="190" y="132" width="70" height="20" fill="#3a2818" stroke="#000"/>
    <rect x="200" y="152" width="42" height="32" fill="#2a1a08" stroke="#000"/>
    <rect x="116" y="138" width="80" height="8" fill="#6a4a28" stroke="#000"/>
    <rect x="248" y="120" width="100" height="6" fill="#2a2218" stroke="#000"/>
    <line x1="160" y1="148" x2="142" y2="200" stroke="#1a1008" stroke-width="3"/>
    <line x1="180" y1="148" x2="200" y2="200" stroke="#1a1008" stroke-width="3"/>
  `)
};

console.log('%c[D-DAY: Beach Assault] build ' + BUILD_VERSION, 'color:#d4a13a;font-weight:bold');

(function () {
'use strict';

// ============================================================
// CONFIG — ROLES
// ============================================================

const ROLES = {
  rifleman: { id:'rifleman', name:'Rifleman', fullName:'Pvt. James Miller', unit:'1st Infantry · Omaha Beach', icon:'🎯',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:120,
    weapon:{ name:'M1 Garand', mag:8, reserve:64, fireMs:240, reloadMs:2000, dmg:45, auto:false, spread:0.012, recoil:0.04, range:200 },
    ability:{ name:'Aimed Shot', key:'Q', cooldown:7000, desc:'Next shot deals 3× damage' },
    difficulty:2,
    blurb:'M1 Garand. 8-round clip, semi-auto. Steady, accurate, deadly.'
  },
  paratrooper: { id:'paratrooper', name:'Paratrooper', fullName:'Sgt. William O\'Connor', unit:'101st Airborne · Sainte-Mère-Église', icon:'🪂',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:100,
    weapon:{ name:'Thompson M1A1', mag:30, reserve:120, fireMs:90, reloadMs:2400, dmg:18, auto:true, spread:0.045, recoil:0.02, range:120 },
    ability:{ name:'Sprint', key:'Q', cooldown:6500, desc:'2s of much faster movement' },
    difficulty:3,
    blurb:'Thompson SMG. 30-round mag. Spray and pray, get up close.'
  },
  medic: { id:'medic', name:'Medic', fullName:'Cpl. Samuel Cohen', unit:'4th Infantry · Utah Beach', icon:'⚕️',
    color:0x3060a0, accentHex:'#e07070', colorHex:'#3060a0',
    hp:150,
    weapon:{ name:'Colt M1911', mag:7, reserve:56, fireMs:260, reloadMs:1800, dmg:30, auto:false, spread:0.02, recoil:0.03, range:120 },
    ability:{ name:'Field Dressing', key:'Q', cooldown:9000, desc:'Heal 60 HP instantly' },
    difficulty:2,
    blurb:'Sidearm and a medic bag. Heal in a pinch. .45 ACP packs a punch.'
  },
  ranger: { id:'ranger', name:'Ranger', fullName:'Cpl. Leonard Lomell', unit:'2nd Rangers · Pointe du Hoc', icon:'💣',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:110,
    weapon:{ name:'M1 Carbine', mag:15, reserve:90, fireMs:200, reloadMs:2200, dmg:26, auto:false, spread:0.018, recoil:0.03, range:160 },
    ability:{ name:'Grenade', key:'Q', cooldown:5500, desc:'Lob a grenade at your crosshair' },
    difficulty:3,
    blurb:'M1 Carbine and a satchel of frags. Crack open clusters of enemies.'
  },
  sniper: { id:'sniper', name:'Sniper', fullName:'Sgt. Robert Watson', unit:'29th Infantry · Bocage', icon:'🔭',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:90,
    weapon:{ name:'Springfield M1903', mag:5, reserve:30, fireMs:1100, reloadMs:3000, dmg:160, auto:false, spread:0.002, recoil:0.08, range:350 },
    ability:{ name:'Piercing Shot', key:'Q', cooldown:8000, desc:'Next shot passes through everything' },
    difficulty:4,
    blurb:'Bolt-action with a scope. Slow, fragile, lethal. One shot, one kill.'
  },
  heavy: { id:'heavy', name:'Heavy Gunner', fullName:'Pvt. Dale Vandegrift', unit:'29th Infantry · Omaha Beach', icon:'⚙️',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:170,
    weapon:{ name:'BAR M1918A2', mag:20, reserve:100, fireMs:110, reloadMs:2800, dmg:30, auto:true, spread:0.035, recoil:0.025, range:140 },
    ability:{ name:'Brace', key:'Q', cooldown:7000, desc:'2s of double damage, less spread' },
    difficulty:3,
    blurb:'BAR automatic rifle. Hits hard, eats ammo.'
  },
  pilot: { id:'pilot', name:'Pilot', fullName:'Lt. Frank Kowalski', unit:'9th Air Force · P-47 Thunderbolt', icon:'✈️',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:100,
    weapon:{ name:'8× .50 BMG', mag:200, reserve:0, fireMs:50, reloadMs:0, dmg:20, auto:true, spread:0.025, recoil:0.01, range:300 },
    ability:{ name:'Rocket Pod', key:'Q', cooldown:6000, desc:'Salvo of 6 unguided rockets' },
    difficulty:3,
    blurb:'P-47 Thunderbolt. Strafe German positions from the air. WASD fly, V toggles cockpit/chase camera.'
  },
  tankdriver: { id:'tankdriver', name:'Tank Driver', fullName:'Cpl. Frank Davis', unit:'743rd Tank Battalion · Sherman DD', icon:'🛡',
    color:0x3060a0, accentHex:'#5090d0', colorHex:'#3060a0',
    hp:240,
    weapon:{ name:'75mm M3 + .30 cal', mag:30, reserve:120, fireMs:1100, reloadMs:1500, dmg:150, auto:false, spread:0.01, recoil:0.05, range:220 },
    ability:{ name:'Smoke Round', key:'Q', cooldown:9000, desc:'Lay a smoke screen 30m ahead' },
    difficulty:2,
    blurb:'Sherman tank crew. Heavy armor, devastating 75mm gun. Lead the armored breach.'
  },
  captain: { id:'captain', name:'Captain', fullName:'Cpt. Joseph Dawson', unit:'16th Infantry · Easy Company CO', icon:'⭐',
    color:0x3060a0, accentHex:'#ffd75a', colorHex:'#3060a0',
    hp:150,
    weapon:{ name:'M1A1 Carbine', mag:15, reserve:90, fireMs:200, reloadMs:2200, dmg:28, auto:false, spread:0.015, recoil:0.03, range:150 },
    ability:{ name:'Rally', key:'Q', cooldown:7000, desc:'5s allied accuracy ×2 + advance faster' },
    difficulty:2,
    blurb:'Easy Company CO. Rides a landing craft to the beach, then leads a double-strength squad inland.'
  }
};
const ROLE_ORDER = ['rifleman','paratrooper','medic','ranger','sniper','heavy','pilot','tankdriver','captain'];

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

// Germans wear bold red uniforms in this stylised version — instantly visible against
// the blue-uniformed Allies. (Historically feldgrau, but the user wants clear teams.)
const ENEMY_TYPES = {
  infantry: { name:'Wehrmacht Heer', weapon:'Mauser K98k', hp:45, speed:2.5, dmg:7, fireMs:1700, accuracy:0.32, range:80, score:15, color:0xc83030, accent:0x801818 },
  rifleman: { name:'Wehrmacht Grenadier', weapon:'Gewehr 43', hp:70, speed:2.3, dmg:10, fireMs:1300, accuracy:0.42, range:100, score:25, color:0xc83030, accent:0x801818 },
  mg:       { name:'MG-42 Gunner', weapon:'MG-42', hp:110, speed:0.8, dmg:5, fireMs:220, accuracy:0.4, range:120, burst:5, score:60, color:0xb02020, accent:0x701010 },
  sniper:   { name:'Scharfschütze', weapon:'K98k w/ Zeiss', hp:50, speed:1.8, dmg:22, fireMs:2200, accuracy:0.75, range:200, score:70, color:0xc83030, accent:0x801818 },
  ss:       { name:'Waffen-SS', weapon:'MP 40', hp:85, speed:3.0, dmg:8, fireMs:420, accuracy:0.45, range:80, burst:3, score:50, color:0x801010, accent:0x300505 },
  mg_nest:  { name:'MG-42 Bunker', weapon:'Twin MG-42', hp:420, speed:0, dmg:8, fireMs:180, accuracy:0.55, range:140, isStatic:true, score:400, color:0xb02828, accent:0x601010 },
  tank:     { name:'Panzer IV', weapon:'75mm KwK 40', hp:640, speed:0.8, dmg:35, fireMs:2500, accuracy:0.7, range:120, isVehicle:true, score:300, color:0xa83030, accent:0x701010 },
  officer:  { name:'SS-Hauptsturmführer', weapon:'MP 40 + Luger', hp:720, speed:2.3, dmg:11, fireMs:380, accuracy:0.65, range:90, burst:4, score:600, color:0x801010, accent:0xc83030 }
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
      <div class="dday-enter-tank" id="dday-enter-tank">🛡 Press <kbd>E</kbd> to drive Sherman</div>
      <div class="dday-exit-tank" id="dday-exit-tank">🛡 <kbd>E</kbd> exit · click fires 75mm</div>
      <div class="dday-scope" id="dday-scope"></div>
      <div class="dday-jump-prompt" id="dday-jump-prompt">
        <h3>🪂 OVER THE DROP ZONE</h3>
        <p>You are above the German rear lines. Press <kbd>ENTER</kbd> to jump.</p>
      </div>
      <div class="dday-objective" id="dday-objective">
        <span>OBJECTIVE</span>
        <p>Break through the German line — reach the seawall</p>
        <div class="dday-objective-bar"><i id="dday-obj-bar"></i></div>
      </div>
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
    // Per-role spawn position
    let spawnX = 0, spawnY = 1.7, spawnZ = 60;
    this.paraDrop = false;
    this.paraInPlane = false;       // sitting in C-47, waiting to jump
    this.controlsLocked = false;
    this.pilotMode = false;
    this.tankDriverMode = false;
    this.captainMode = false;
    if (role.id === 'paratrooper') {
      // Start in plane high above (Z=-80 = far behind German line). Press Enter to jump.
      spawnX = rand(-15, 15); spawnY = 60; spawnZ = -80;
      this.paraInPlane = true;
      this.controlsLocked = true;
    } else if (role.id === 'pilot') {
      // Start over the Channel, flying toward Normandy
      spawnX = 0; spawnY = 35; spawnZ = 90;
      this.pilotMode = true;
      this.pilotPitch = -0.1;
      this.pilotRoll = 0;
      this.pilotThirdPerson = false;  // toggle with V
      this.planeMesh = this.makePilotPlane();
    } else if (role.id === 'tankdriver') {
      // Spawn already in a Sherman ready to drive
      this.tankDriverMode = true;
      spawnX = 0; spawnY = 3.0; spawnZ = 55;
    } else if (role.id === 'captain') {
      this.captainMode = true;
      this.captainOnShip = true;
      this.captainShipMesh = null;     // built in init
      spawnX = 0; spawnY = 3.0; spawnZ = 130;  // start far out on the Channel
      this.controlsLocked = true;       // ride the ship until landing
    } else if (role.id === 'ranger') {
      spawnZ = 35;  // closer to action — cliff assault feel
    }
    // Whether the player starts on the friendly side (positive Z) → breach objective applies
    this.spawnedOnFriendlySide = (spawnZ > 0);
    this.camera.position.set(spawnX, spawnY, spawnZ);
    this.camera.rotation.order = 'YXZ';
    lookYaw = Math.PI; // face -Z (into the beach)
    lookPitch = this.paraDrop ? -0.3 : 0;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    renderer = this.renderer;
    scene = this.scene;
    camera = this.camera;

    // Lighting — brighter, more cinematic
    const ambient = new THREE.AmbientLight(0xb0c0d0, 0.55);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5d8, 1.2);
    sun.position.set(8, 24, 6);
    this.scene.add(sun);
    // Hemisphere light for soft sky/ground bounce
    const hemi = new THREE.HemisphereLight(0xb8d4f0, 0xb89878, 0.45);
    this.scene.add(hemi);
    // Rim light from behind for character separation
    const rim = new THREE.DirectionalLight(0xffbb88, 0.35);
    rim.position.set(-6, 12, -8);
    this.scene.add(rim);

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

    // Per-role weapon overlay
    const gunEl = document.getElementById('dday-fps-gun');
    if (gunEl && GUN_SVGS[role.id]) gunEl.style.backgroundImage = GUN_SVGS[role.id];

    // Sky things: planes, paratroopers, bombs
    this.planes = [];
    this.paratroopers = [];
    this.bombs = [];
    this.spawnPlane();
    this.nextBomb = rand(3, 7);
    this.nextPlane = rand(8, 14);

    // Paratrooper: parachute mesh attached above the camera
    if (this.paraDrop) {
      const white = new THREE.MeshLambertMaterial({ color: 0xeae0c8, side: THREE.DoubleSide });
      const dark = new THREE.MeshLambertMaterial({ color: 0x2a2018 });
      const para = new THREE.Group();
      const chute = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 8, 0, Math.PI*2, 0, Math.PI/2), white);
      chute.position.y = 3.5; para.add(chute);
      [[-2,-2],[2,-2],[-2,2],[2,2]].forEach(([sx,sz])=>{
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 4), dark);
        rope.position.set(sx*0.4, 1.5, sz*0.4);
        rope.rotation.z = Math.atan2(0 - sx, 4);
        para.add(rope);
      });
      this.scene.add(para);
      this.paraMesh = para;
    }

    // Tank driving state
    this.inTank = null;       // currently driven tank (Sherman vehicle)
    this.nearTank = null;     // closest tank within enter range
    this._tankInteract = 0;   // throttle for E key

    // Sniper ADS (zoom)
    this.adsActive = false;
    this.adsTransition = 0;
    this.baseFov = 75;
    this.adsFov = 32;

    // Medic heal aura tick
    this._healAuraTimer = 0;

    // Captain: spawn extra allies on top of standard wave
    if (this.captainMode) {
      for (let i=0; i<20; i++) {
        const ally = this.makeAllyMesh(rand(-70,70), 0, 50 + rand(-15, 30));
        this.allies.push(ally);
      }
      this.maxAllies = 90;
    }

    // Tank driver: spawn a dedicated Sherman and put player in it
    if (this.tankDriverMode) {
      this.makeAllyTank(0, 55);
      const t = this._allyTanks[this._allyTanks.length - 1];
      // Auto-enter
      this.nearTank = t;
      this.enterTank();
    }

    // Initial toast
    const intro = {
      rifleman:   'Off the Higgins boat — push up the beach',
      paratrooper:'Above the drop zone — press ENTER to jump',
      medic:      'Stay alive — your heal aura keeps allies up',
      ranger:     'Forward position — assault the bunkers',
      sniper:     'Right-click to scope · pick your shots',
      heavy:      'Belt-fed — Q to brace for ×2 damage',
      pilot:      'P-47 inbound to Normandy — WASD fly · click strafes · V toggles cockpit/3rd person',
      tankdriver: 'Sherman ready — WASD drive · click 75mm',
      captain:    'On the landing craft — riding in toward Omaha Beach'
    }[role.id] || 'Engage';
    this.toast(intro, 3000);
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
      // Wide water area extending behind player
      const waterGeo = new THREE.PlaneGeometry(400, 200);
      const waterMat = new THREE.MeshLambertMaterial({ color: pal.water });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.rotation.x = -Math.PI/2;
      water.position.set(0, 0.02, 130);
      this.scene.add(water);
      this.water = water;

      // Seawall at far end
      const wallMat = new THREE.MeshLambertMaterial({ color: 0x5a5048 });
      const wall = new THREE.Mesh(new THREE.BoxGeometry(200, 3, 2), wallMat);
      wall.position.set(0, 1.5, -55);
      this.scene.add(wall);

      // Bunkers + flanking AT cannons at the far end
      this.makeBunker(-25, -52);
      this.makeBunker( 25, -52);
      this.makePakCannon(-40, -50);
      this.makePakCannon( 40, -50);

      // Czech hedgehogs scattered through middle (cover)
      for (let i=0; i<18; i++) {
        this.makeHedgehog(rand(-45,45), rand(0, 35));
      }
      // Sandbag walls near front (cover)
      for (let i=0; i<8; i++) {
        this.makeSandbag(rand(-40,40), rand(-30,-10));
      }

      // Knocked-out Sherman DD tanks — cover on the beach
      this.makeShermanWreck(-18, 20);
      this.makeShermanWreck( 22, 5);
      this.makeShermanWreck(-30, -5);

      // Higgins landing craft — multiple, sailing in continuously
      this.makeHiggins(-22, 75, 0);
      this.makeHiggins( 18, 80, 0);
      this.makeHiggins( 50, 95, 0);
      this.makeHiggins(-55, 100, 0);
      this.makeHiggins(-10, 115, 0);
      this.makeHiggins( 30, 125, 0);
      this.makeHiggins(-40, 135, 0);
      this.makeHiggins( 60, 145, 0);
      this.makeHiggins(  0, 155, 0);

      // Active Allied Sherman tanks advancing up the beach
      this.makeAllyTank(-15, 45);
      this.makeAllyTank( 22, 55);
      this.makeAllyTank(-40, 65);

      // Active German Panzer (drives slowly toward beach, fires)
      this.makeEnemyTank(-35, -42);
      this.makeEnemyTank( 30, -40);

      // Distant destroyers in deep water
      this.makeDestroyer(-70, 160, 0.1);
      this.makeDestroyer( 0, 175, 0);
      this.makeDestroyer( 80, 165, -0.05);
      this.makeDestroyer(-30, 190, 0.2);
      this.makeDestroyer( 50, 200, 0.1);
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
      // Knocked-out Sherman halfway through the field
      this.makeShermanWreck(rand(-10, 10), -5);
      // A burning halftrack at the far end
      this.makeShermanWreck(rand(-25, 25), -45);
      // A German PaK gun guarding the back hedgerow
      this.makePakCannon(0, -52);
    } else if (t === 'cliffs') {
      // Lots of rocks
      for (let i=0; i<32; i++) this.makeRock(rand(-50,50), rand(-50, 50));
      // Edge wall at one side
      const edgeMat = new THREE.MeshLambertMaterial({ color: 0x4a4030 });
      const edge = new THREE.Mesh(new THREE.BoxGeometry(200, 4, 4), edgeMat);
      edge.position.set(0, 2, -60);
      this.scene.add(edge);
      // Destroyed German gun emplacements
      this.makePakCannon(-22, -50);
      this.makePakCannon( 18, -45);
      this.makePakCannon( 35, -52);
      // Distant ships off-shore (one side is sea)
      this.makeDestroyer(-60, 90, 0.05);
      this.makeDestroyer( 30, 110, -0.1);
      this.makeDestroyer( 80, 95, 0);
    } else if (t === 'town') {
      // Buildings
      for (let i=0; i<8; i++) this.makeBuilding(rand(-45,45), rand(-50, 50));
      // Church steeple in middle-far
      this.makeChurch(0, -50);
      // Wrecked Panzer in the square
      this.makeShermanWreck(15, -25);
      // PaK gun at end of street
      this.makePakCannon(-20, -45);
      // Jeep near the player spawn
      this.makeJeep(8, 50);
    }

    // Allies near player spawn — massive initial wave
    for (let i=0; i<35; i++) {
      const ally = this.makeAllyMesh(rand(-70,70), 0, 55 + rand(-20, 40));
      this.allies.push(ally);
    }
    // Continuous reinforcements pouring out of the surf
    this.allyRespawnTimer = 1.0;
    this.maxAllies = 70;
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
  // ---- Vehicles & gun emplacements ----

  makeShermanWreck(x, z) {
    const g = new THREE.Group();
    const hullMat = new THREE.MeshLambertMaterial({ color: 0x4a4a3a });
    const burntMat = new THREE.MeshLambertMaterial({ color: 0x1a1208 });
    // Hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 5.5), hullMat);
    hull.position.y = 0.8; g.add(hull);
    // Tracks
    const trackMat = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    const tL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 5.8), trackMat);
    tL.position.set(-1.6, 0.3, 0); g.add(tL);
    const tR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 5.8), trackMat);
    tR.position.set( 1.6, 0.3, 0); g.add(tR);
    // Turret (askew — knocked out)
    const turret = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 2.6), burntMat);
    turret.position.y = 1.85; turret.rotation.y = rand(-0.6, 0.6); g.add(turret);
    // Barrel (drooping)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 8), trackMat);
    barrel.rotation.z = Math.PI/2; barrel.rotation.y = turret.rotation.y;
    barrel.position.set(Math.sin(turret.rotation.y) * 2.4, 1.5, Math.cos(turret.rotation.y) * 2.4);
    g.add(barrel);
    // Smoke plume from hatches
    const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6), new THREE.MeshLambertMaterial({ color: 0x3a3028, transparent: true, opacity: 0.7 }));
    smoke.position.set(0, 3.2, 0); g.add(smoke);
    const smoke2 = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), new THREE.MeshLambertMaterial({ color: 0x2a2218, transparent: true, opacity: 0.5 }));
    smoke2.position.set(0.3, 4.3, 0.2); g.add(smoke2);
    g.position.set(x, 0, z);
    g.rotation.y = rand(0, Math.PI * 2);
    this.scene.add(g);
    this.addObstacle(g, x, z, 2.2);
    // animate smoke wobble
    g.userData.smoke = [smoke, smoke2];
    g.userData.t0 = Math.random() * 10;
    if (!this._wrecks) this._wrecks = [];
    this._wrecks.push(g);
  }

  makePakCannon(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x3a4a3a });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a2018 });
    // Gun shield
    const shield = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 0.15), mat);
    shield.position.set(0, 1.0, 0.4); g.add(shield);
    // Trail (legs splayed back)
    const trailL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 2.4), dark);
    trailL.position.set(-0.6, 0.3, -1.0); trailL.rotation.y = -0.3; g.add(trailL);
    const trailR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 2.4), dark);
    trailR.position.set( 0.6, 0.3, -1.0); trailR.rotation.y = 0.3; g.add(trailR);
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.18, 14);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    const wL = new THREE.Mesh(wheelGeo, wheelMat);
    wL.rotation.z = Math.PI/2; wL.position.set(-1.2, 0.6, 0.2); g.add(wL);
    const wR = new THREE.Mesh(wheelGeo, wheelMat);
    wR.rotation.z = Math.PI/2; wR.position.set( 1.2, 0.6, 0.2); g.add(wR);
    // Barrel (long)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.6, 10), dark);
    barrel.rotation.x = Math.PI/2; barrel.position.set(0, 1.05, 2.0); g.add(barrel);
    // Breech block
    const breech = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.8), dark);
    breech.position.set(0, 1.0, 0.6); g.add(breech);
    g.position.set(x, 0, z);
    g.rotation.y = Math.atan2(0 - x, 60 - z); // roughly face the beach center
    this.scene.add(g);
    this.addObstacle(g, x, z, 1.6);
  }

  makeHiggins(x, z, yawOffset) {
    const g = new THREE.Group();
    const hullMat = new THREE.MeshLambertMaterial({ color: 0x3a4a3a });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1a18 });
    const wood = new THREE.MeshLambertMaterial({ color: 0x6a5028 });
    // Main hull (boat shape — wider at back, pointed front)
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 8), hullMat);
    hull.position.y = 0.7; g.add(hull);
    // Sides higher
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 7.5), hullMat);
    sideL.position.set(-1.85, 1.4, 0); g.add(sideL);
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 7.5), hullMat);
    sideR.position.set( 1.85, 1.4, 0); g.add(sideR);
    // Open ramp at front (facing -Z = toward beach), tilted down
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.18, 3.2), wood);
    ramp.position.set(0, 0.35, -5.0);
    ramp.rotation.x = -0.45;
    g.add(ramp);
    // Back wall (control area)
    const back = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 0.4), hullMat);
    back.position.set(0, 1.5, 3.9); g.add(back);
    // Small wheelhouse on the back
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.7), dark);
    cab.position.set(0, 2.4, 3.6); g.add(cab);
    g.position.set(x, 0.2, z);
    g.rotation.y = yawOffset || 0;
    this.scene.add(g);
    // Track for sailing animation (do NOT add as obstacle — they're moving)
    if (!this._higgins) this._higgins = [];
    this._higgins.push({
      mesh: g,
      vz: -rand(1.6, 2.4),       // sails toward beach (negative Z)
      stopZ: 72 + rand(-2, 4),    // stops at surf
      resetZ: 130 + rand(0, 30),  // when past stopZ, reset to far back
      bob: rand(0, Math.PI*2)
    });
  }

  makeDestroyer(x, z, yawOffset) {
    const g = new THREE.Group();
    const hullMat = new THREE.MeshLambertMaterial({ color: 0x2a3a4a });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a2530 });
    const light = new THREE.MeshLambertMaterial({ color: 0x5a6878 });
    // Hull — long thin
    const hull = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.5, 22), hullMat);
    hull.position.y = 1.2; g.add(hull);
    // Bow taper (smaller box up front)
    const bow = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 3), hullMat);
    bow.position.set(0, 1.2, -12); g.add(bow);
    // Deck superstructure
    const deck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 8), light);
    deck.position.set(0, 3.2, 0); g.add(deck);
    // Bridge tower
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.8, 2.5), light);
    bridge.position.set(0, 5.0, -1.5); g.add(bridge);
    // Funnels
    const funMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 2.0, 12), funMat);
    f1.position.set(0, 5.0, 1.5); g.add(f1);
    const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.8, 12), funMat);
    f2.position.set(0, 4.9, 4.0); g.add(f2);
    // Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 8, 6), dark);
    mast.position.set(0, 8, -2); g.add(mast);
    // Forward gun turret
    const turret = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.8), dark);
    turret.position.set(0, 3.0, -7); g.add(turret);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.0, 8), dark);
    barrel.rotation.x = Math.PI/2; barrel.position.set(0, 3.2, -8.8);
    g.add(barrel);
    // Aft gun
    const turret2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 1.6), dark);
    turret2.position.set(0, 3.0, 9); g.add(turret2);
    g.position.set(x, 0.5, z);
    g.rotation.y = (yawOffset || 0);
    this.scene.add(g);
    if (!this._destroyers) this._destroyers = [];
    this._destroyers.push({ mesh: g, baseY: 0.5, phase: rand(0, Math.PI*2) });
    // Decorative only (no collision — too far away)
  }

  // Paratrooper: jump out of the plane on Enter
  jumpFromPlane() {
    if (!this.paraInPlane) return;
    this.paraInPlane = false;
    this.paraDrop = true;
    const promptEl = document.getElementById('dday-jump-prompt');
    if (promptEl) promptEl.classList.remove('show');
    // Attach parachute mesh (build it now)
    const white = new THREE.MeshLambertMaterial({ color: 0xeae0c8, side: THREE.DoubleSide });
    const dark = new THREE.MeshLambertMaterial({ color: 0x2a2018 });
    const para = new THREE.Group();
    const chute = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 8, 0, Math.PI*2, 0, Math.PI/2), white);
    chute.position.y = 3.5; para.add(chute);
    [[-2,-2],[2,-2],[-2,2],[2,2]].forEach(([sx,sz])=>{
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 4), dark);
      rope.position.set(sx*0.4, 1.5, sz*0.4);
      rope.rotation.z = Math.atan2(0 - sx, 4);
      para.add(rope);
    });
    this.scene.add(para);
    this.paraMesh = para;
    this.toast('Chute open — landing behind enemy line', 2200);
  }

  // Build a P-47 Thunderbolt mesh for the pilot
  makePilotPlane() {
    const g = new THREE.Group();
    const olive = new THREE.MeshLambertMaterial({ color: 0x586848 });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    const glass = new THREE.MeshLambertMaterial({ color: 0x1a2838 });
    // Fuselage — long cigar
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 8, 10), olive);
    body.rotation.x = Math.PI/2; g.add(body);
    // Wings
    const wings = new THREE.Mesh(new THREE.BoxGeometry(12, 0.25, 1.6), olive);
    wings.position.set(0, -0.1, 0.5); g.add(wings);
    // Tail horizontal
    const tail = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.8), olive);
    tail.position.set(0, 0, -3.5); g.add(tail);
    // Tail vertical
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 1.2), olive);
    fin.position.set(0, 0.65, -3.5); g.add(fin);
    // Cockpit canopy
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8, 0, Math.PI*2, 0, Math.PI/2), glass);
    canopy.position.set(0, 0.55, 0.6); canopy.scale.z = 1.6;
    g.add(canopy);
    // Engine cowling
    const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.2, 12), dark);
    cowl.rotation.x = Math.PI/2; cowl.position.set(0, 0, 3.5); g.add(cowl);
    // Propeller (will spin)
    const propHub = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), dark);
    propHub.position.set(0, 0, 4.2); g.add(propHub);
    const propBlade = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 0.05), dark);
    propBlade.position.set(0, 0, 4.2); g.add(propBlade);
    g.userData.prop = propBlade;
    // White star on left wing
    const star = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    star.position.set(-3.5, 0.05, 0.5); star.rotation.x = -Math.PI/2;
    g.add(star);
    this.scene.add(g);
    return g;
  }

  // Pilot mode update — fly the P-47 with proper FPS-flight controls
  updatePilot(dt) {
    // Input
    let pitchInput = 0, yawInput = 0;
    if (keys['w'] || keys['arrowup'])    pitchInput += 1;  // climb
    if (keys['s'] || keys['arrowdown'])  pitchInput -= 1;  // dive
    if (keys['a'] || keys['arrowleft'])  yawInput -= 1;
    if (keys['d'] || keys['arrowright']) yawInput += 1;
    if (touchMove.active) { pitchInput -= touchMove.y; yawInput += touchMove.x; }
    if (touchLook.active) {
      lookYaw -= touchLook.x * dt * 1.5;
      this.pilotPitch += -touchLook.y * dt * 1.0;
    }
    // Apply pitch + yaw
    this.pilotPitch += pitchInput * 0.7 * dt;
    this.pilotPitch = clamp(this.pilotPitch, -0.5, 0.5);
    lookYaw -= yawInput * 0.9 * dt;
    // Visual roll
    this.pilotRoll = lerp(this.pilotRoll, yawInput * -0.5, Math.min(1, dt * 5));

    // Move forward in camera direction
    const dir = new THREE.Vector3();
    dir.set(0, 0, -1).applyEuler(new THREE.Euler(this.pilotPitch, lookYaw, 0, 'YXZ'));
    const speed = 28;
    this.camera.position.addScaledVector(dir, speed * dt);
    // Clamp altitude
    this.camera.position.y = clamp(this.camera.position.y, 14, 80);
    // Wrap horizontally so you can keep looping over the battle
    if (this.camera.position.x > 110)  this.camera.position.x = -110;
    if (this.camera.position.x < -110) this.camera.position.x = 110;
    if (this.camera.position.z > 130)  this.camera.position.z = -110;
    if (this.camera.position.z < -120) this.camera.position.z = 130;

    // Position the visible plane mesh
    if (this.planeMesh) {
      this.planeMesh.position.copy(this.camera.position);
      this.planeMesh.rotation.set(0, lookYaw, 0);
      this.planeMesh.rotateX(this.pilotPitch);
      this.planeMesh.rotateZ(this.pilotRoll);
      // Spin propeller
      if (this.planeMesh.userData.prop) this.planeMesh.userData.prop.rotation.z += dt * 50;
      // In FPV, hide the plane; in third-person, show it and offset camera back
      this.planeMesh.visible = this.pilotThirdPerson;
    }

    // Apply camera rotation. In third person, offset camera back+up behind plane.
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = lookYaw;
    this.camera.rotation.x = this.pilotPitch;
    this.camera.rotation.z = this.pilotRoll;
    if (this.pilotThirdPerson && this.planeMesh) {
      const back = new THREE.Vector3();
      back.set(0, 0, 1).applyEuler(new THREE.Euler(this.pilotPitch, lookYaw, 0, 'YXZ'));
      this.camera.position.addScaledVector(back, 9);
      this.camera.position.y += 2.5;
    }

    // Firing strafe — auto fire while button held
    if ((mouseDown || touchLook.fire) && !this.reloading) {
      const now = this.time * 1000;
      const w = this.role.weapon;
      if (now - (this.lastFire || 0) > w.fireMs) {
        this.lastFire = now;
        const ray = new THREE.Raycaster(this.camera.position.clone(), dir.clone(), 0, w.range);
        const targets = this.enemies.filter(e=>!e.dead).map(e=>e.mesh);
        const hits = ray.intersectObjects(targets, true);
        if (hits.length > 0) {
          const e = this.enemies.find(en => en.mesh === hits[0].object || en.mesh.children.includes(hits[0].object));
          if (e && !e.dead) this.hitEnemy(e, w.dmg * 2);
        }
        this.spawnTracer(this.camera.position.clone().add(dir.clone().multiplyScalar(2)),
                         this.camera.position.clone().add(dir.clone().multiplyScalar(w.range)));
        this.muzzleFlash = 0.05;
      }
    }
    // Wave system still ticks
    this.tickWaves(dt);
  }

  // Captain mode — riding a landing craft toward the beach
  updateCaptainShip(dt) {
    // Build the LCT mesh on first tick
    if (!this.captainShipMesh) {
      const g = new THREE.Group();
      const hullMat = new THREE.MeshLambertMaterial({ color: 0x3a4a3a });
      const dark = new THREE.MeshLambertMaterial({ color: 0x1a1a18 });
      const hull = new THREE.Mesh(new THREE.BoxGeometry(8, 2.4, 18), hullMat);
      hull.position.y = 1.2; g.add(hull);
      const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 16), hullMat);
      sideL.position.set(-4.2, 2.6, 0); g.add(sideL);
      const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 16), hullMat);
      sideR.position.set( 4.2, 2.6, 0); g.add(sideR);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 1.5), dark);
      cab.position.set(0, 3.5, 8); g.add(cab);
      // Bow ramp
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.3, 6), new THREE.MeshLambertMaterial({ color: 0x6a5028 }));
      ramp.position.set(0, 0.6, -10);
      ramp.rotation.x = -0.45;
      g.add(ramp);
      this.scene.add(g);
      this.captainShipMesh = g;
    }
    // Ship moves forward toward beach
    this.captainShipMesh.position.set(this.camera.position.x, 0, this.camera.position.z);
    this.captainShipMesh.rotation.y = lookYaw;
    // Bob
    this.captainShipMesh.position.y = Math.sin(this.time * 1.2) * 0.2;
    // Move ship + camera forward
    const speed = 10;
    this.camera.position.z -= speed * dt;
    // Slight side wobble from waves
    this.camera.position.x += Math.sin(this.time * 0.8) * 0.3 * dt;
    this.camera.position.y = 3.0 + Math.sin(this.time * 1.4) * 0.15;
    // Allow looking around
    if (touchLook.active) {
      lookYaw   -= touchLook.x * dt * 2.0;
      lookPitch -= touchLook.y * dt * 1.6;
      lookPitch = clamp(lookPitch, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
    }
    this.camera.rotation.y = lookYaw;
    this.camera.rotation.x = lookPitch;
    // When ship reaches surf (Z=70), captain disembarks
    if (this.camera.position.z <= 70) {
      this.captainOnShip = false;
      this.controlsLocked = false;
      this.camera.position.set(0, 1.7, 65);
      // Remove the ship mesh
      if (this.captainShipMesh) {
        this.scene.remove(this.captainShipMesh);
        this.captainShipMesh = null;
      }
      this.toast('On the beach! Push to the seawall!', 2500);
    }
  }

  enterTank() {
    if (!this.nearTank || this.inTank) return;
    this.inTank = this.nearTank;
    this.inTank.driven = true;
    this.inTank.lastShot = -99999;  // ready to fire immediately
    // Hide gun overlay
    const gunEl = document.getElementById('dday-fps-gun');
    if (gunEl) gunEl.style.display = 'none';
    const tEl = document.getElementById('dday-enter-tank');
    if (tEl) tEl.style.display = 'none';
    const exit = document.getElementById('dday-exit-tank');
    if (exit) exit.style.display = 'block';
    this.toast('Driving Sherman — WASD to drive, click to fire 75mm, E to exit', 3500);
  }
  exitTank() {
    if (!this.inTank) return;
    const t = this.inTank;
    t.driven = false;
    // Position player next to tank (offset right)
    const ang = (t.yaw || 0);
    this.camera.position.x = t.x + Math.cos(ang) * 3;
    this.camera.position.z = t.z + Math.sin(ang) * 3;
    this.camera.position.y = 1.7;
    this.inTank = null;
    const gunEl = document.getElementById('dday-fps-gun');
    if (gunEl) gunEl.style.display = '';
    const exit = document.getElementById('dday-exit-tank');
    if (exit) exit.style.display = 'none';
    this.toast('Out of tank', 1500);
  }

  updateTankDriving(dt) {
    const t = this.inTank;
    if (!t) return;
    // Controls: WASD drives the tank
    let throttle = 0, steer = 0;
    if (keys['w'] || keys['arrowup'])    throttle += 1;
    if (keys['s'] || keys['arrowdown'])  throttle -= 1;
    if (keys['a'] || keys['arrowleft'])  steer -= 1;
    if (keys['d'] || keys['arrowright']) steer += 1;
    if (touchMove.active) { throttle += -touchMove.y; steer += touchMove.x; }
    t.yaw = (t.yaw || 0) + steer * 1.2 * dt;
    const speed = 8 * throttle;
    const dx = Math.sin(t.yaw) * speed * dt;
    const dz = Math.cos(t.yaw) * speed * dt;
    // Crude collision check (skip obstacles since tank is heavy)
    t.x = clamp(t.x + dx, -85, 85);
    t.z = clamp(t.z + dz, -55, 85);
    t.mesh.position.set(t.x, 0, t.z);
    t.mesh.rotation.y = t.yaw + Math.PI;  // model faces -Z by default

    // Look: mouse turns turret (in addition to base yaw)
    if (touchLook.active) {
      lookYaw   -= touchLook.x * dt * 2.0;
      lookPitch -= touchLook.y * dt * 1.6;
      lookPitch = clamp(lookPitch, -Math.PI/4, Math.PI/4);
    }
    this.camera.rotation.y = lookYaw;
    this.camera.rotation.x = lookPitch;

    // Camera sits on top of turret, behind, looking forward
    const camOff = 1.2;
    this.camera.position.x = t.x - Math.sin(t.yaw) * camOff;
    this.camera.position.z = t.z - Math.cos(t.yaw) * camOff;
    this.camera.position.y = 3.0;
  }

  tankFire() {
    if (!this.inTank) return;
    const t = this.inTank;
    const now = this.time * 1000;
    if (now - (t.lastShot || 0) < 1200) return;
    t.lastShot = now;
    // Fire shell from camera forward
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const start = new THREE.Vector3(t.x + Math.sin(t.yaw)*2.5, 2.0, t.z + Math.cos(t.yaw)*2.5);
    const target = start.clone().add(dir.multiplyScalar(80));
    this.fireTankShell(start.x, start.y, start.z, target.x, Math.max(0.5, target.y), target.z, 'ally');
    this.shake = Math.max(this.shake, 0.15);
  }

  makeAllyTank(x, z) {
    const g = new THREE.Group();
    const olive = new THREE.MeshLambertMaterial({ color: 0x4a5a38 });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    // Hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 6.0), olive);
    hull.position.y = 0.8; g.add(hull);
    // Tracks
    const tL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 6.4), dark);
    tL.position.set(-1.8, 0.3, 0); g.add(tL);
    const tR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 6.4), dark);
    tR.position.set( 1.8, 0.3, 0); g.add(tR);
    // Turret
    const turret = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 2.8), olive);
    turret.position.y = 1.95; g.add(turret);
    // Barrel (pointing forward = -Z)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 3.4, 8), dark);
    barrel.rotation.x = Math.PI/2; barrel.position.set(0, 1.95, -2.4);
    g.add(barrel);
    // White star on turret
    const star = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    star.position.set(0, 2.46, 0); star.rotation.x = -Math.PI/2;
    g.add(star);
    g.position.set(x, 0, z);
    this.scene.add(g);
    if (!this._allyTanks) this._allyTanks = [];
    this._allyTanks.push({
      mesh: g, barrel,
      x, z,
      vz: -rand(1.4, 2.4),  // advancing slowly toward enemy line
      lastShot: 0,
      shotCooldown: rand(3500, 5500),
      trackPhase: 0
    });
  }

  makeEnemyTank(x, z) {
    const g = new THREE.Group();
    const grey = new THREE.MeshLambertMaterial({ color: 0x4a4a3a });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    // Hull (Panzer IV-like)
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 6.0), grey);
    hull.position.y = 0.75; g.add(hull);
    // Tracks
    const tL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 6.3), dark);
    tL.position.set(-1.7, 0.3, 0); g.add(tL);
    const tR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 6.3), dark);
    tR.position.set( 1.7, 0.3, 0); g.add(tR);
    // Turret
    const turret = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.9, 2.6), grey);
    turret.position.y = 1.8; g.add(turret);
    // Long 75mm barrel pointing forward (+Z toward player)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 4.0, 8), dark);
    barrel.rotation.x = Math.PI/2; barrel.position.set(0, 1.8, 2.6);
    g.add(barrel);
    // Black cross marking on side
    const cross = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide }));
    cross.position.set(1.55, 1.0, 0); cross.rotation.y = Math.PI/2;
    g.add(cross);
    g.position.set(x, 0, z);
    this.scene.add(g);
    if (!this._enemyTanks) this._enemyTanks = [];
    this._enemyTanks.push({
      mesh: g, barrel,
      x, z,
      vz: rand(0.4, 0.9),  // slowly advancing toward beach (+Z)
      lastShot: 0,
      shotCooldown: rand(3000, 5000),
      hp: 200, maxHp: 200,
      hpBar: null
    });
  }

  fireTankShell(fromX, fromY, fromZ, toX, toY, toZ, owner) {
    const g = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffcc44 }));
    g.position.set(fromX, fromY, fromZ);
    this.scene.add(g);
    // Muzzle flash
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 6), new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 1 }));
    flash.position.set(fromX, fromY, fromZ);
    this.scene.add(flash);
    setTimeout(()=> this.scene.remove(flash), 90);
    if (!this._tankShells) this._tankShells = [];
    this._tankShells.push({
      mesh: g,
      sx: fromX, sy: fromY, sz: fromZ,
      tx: toX, ty: toY, tz: toZ,
      age: 0, dur: 0.7,
      owner: owner || 'ally'
    });
  }

  updateVehicles(dt) {
    // Higgins boats sailing toward beach
    if (this._higgins) {
      for (const h of this._higgins) {
        h.mesh.position.z += h.vz * dt;
        h.bob = (h.bob||0) + dt * 1.2;
        h.mesh.position.y = 0.2 + Math.sin(h.bob) * 0.12;
        h.mesh.rotation.z = Math.sin(h.bob * 0.7) * 0.03;
        if (h.mesh.position.z < h.stopZ) {
          // Reached the surf — reset to far back to keep flow continuous
          h.mesh.position.z = h.resetZ;
          h.mesh.position.x = rand(-65, 65);
        }
      }
    }
    // Allied Sherman tanks advancing
    if (this._allyTanks) {
      for (const t of this._allyTanks) {
        if (t.driven) continue;  // player is driving this one — skip auto AI
        t.z += t.vz * dt;
        t.mesh.position.z = t.z;
        t.mesh.position.x = t.x;
        // Track wobble (subtle vertical jitter)
        t.trackPhase += dt * 8;
        t.mesh.position.y = Math.abs(Math.sin(t.trackPhase)) * 0.04;
        const now = this.time * 1000;
        if (now - t.lastShot > t.shotCooldown) {
          t.lastShot = now;
          t.shotCooldown = rand(3500, 6000);
          // Target a random enemy if any, else random point on enemy side
          let tx = rand(-30, 30), ty = 1, tz = -45;
          const alive = this.enemies.filter(e=>!e.dead);
          if (alive.length) {
            const e = alive[Math.floor(Math.random()*alive.length)];
            tx = e.x; tz = e.z; ty = 1;
          }
          this.fireTankShell(t.x, 2.0, t.z - 2.6, tx, ty, tz, 'ally');
        }
        // Reset when past enemy line
        if (t.z < -60) {
          t.z = 70 + rand(0, 10);
          t.x = rand(-50, 50);
        }
      }
    }
    // Enemy Panzers advancing toward player
    if (this._enemyTanks) {
      for (const t of this._enemyTanks) {
        if (t.hp <= 0) {
          this.scene.remove(t.mesh);
          continue;
        }
        t.z += t.vz * dt;
        t.mesh.position.z = t.z;
        t.mesh.position.x = t.x;
        const now = this.time * 1000;
        if (now - t.lastShot > t.shotCooldown) {
          t.lastShot = now;
          t.shotCooldown = rand(3000, 5500);
          // Fire at player
          const px = this.camera.position.x;
          const pz = this.camera.position.z;
          this.fireTankShell(t.x, 2.0, t.z + 2.8, px, 1.5, pz, 'enemy');
        }
      }
      this._enemyTanks = this._enemyTanks.filter(t=>t.hp>0);
    }
    // Shells flying
    if (this._tankShells) {
      for (const s of this._tankShells) {
        s.age += dt;
        const p = clamp(s.age / s.dur, 0, 1);
        s.mesh.position.x = lerp(s.sx, s.tx, p);
        s.mesh.position.y = lerp(s.sy, s.ty, p) + Math.sin(p * Math.PI) * 8;
        s.mesh.position.z = lerp(s.sz, s.tz, p);
        if (p >= 1 && !s.exploded) {
          s.exploded = true;
          // Explosion
          const ex = new THREE.Mesh(new THREE.SphereGeometry(4, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.9 }));
          ex.position.set(s.tx, Math.max(0.5, s.ty), s.tz);
          this.scene.add(ex);
          s.ex = ex; s.exLife = 0.5;
          const sm = new THREE.Mesh(new THREE.SphereGeometry(3.0, 10, 8), new THREE.MeshLambertMaterial({ color: 0x2a2218, transparent: true, opacity: 0.8 }));
          sm.position.set(s.tx, 3, s.tz);
          this.scene.add(sm);
          s.sm = sm; s.smLife = 2.0;
          this.scene.remove(s.mesh);
          // Damage
          if (s.owner === 'ally') {
            for (const e of this.enemies) {
              if (e.dead) continue;
              const dx = e.x - s.tx, dz = e.z - s.tz;
              if (dx*dx + dz*dz < 25) this.hitEnemy(e, 110);
            }
          } else {
            // enemy shell - damage player if close
            const dx = this.camera.position.x - s.tx;
            const dz = this.camera.position.z - s.tz;
            if (dx*dx + dz*dz < 16) this.damagePlayer(60);
            this.shake = Math.max(this.shake, 0.4);
          }
        }
        if (s.exploded) {
          s.exLife -= dt;
          s.smLife -= dt;
          if (s.ex) {
            s.ex.scale.setScalar(1 + (1 - s.exLife/0.5) * 1.5);
            s.ex.material.opacity = Math.max(0, s.exLife / 0.5 * 0.9);
          }
          if (s.sm) {
            s.sm.position.y += dt * 0.5;
            s.sm.material.opacity = Math.max(0, s.smLife / 2.0 * 0.8);
          }
        }
      }
      this._tankShells = this._tankShells.filter(s => {
        if (s.exploded && s.smLife <= 0) {
          if (s.ex) this.scene.remove(s.ex);
          if (s.sm) this.scene.remove(s.sm);
          return false;
        }
        return true;
      });
    }
  }

  makeJeep(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a6741 });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 3.2), mat);
    body.position.y = 0.7; g.add(body);
    // Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.0), mat);
    hood.position.set(0, 0.9, 1.4); g.add(hood);
    // Windshield (folded down)
    const wind = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.6), dark);
    wind.position.set(0, 1.15, 0.7); g.add(wind);
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 10);
    [[-0.8,-1.0],[ 0.8,-1.0],[-0.8, 1.0],[ 0.8, 1.0]].forEach(([wx, wz])=>{
      const w = new THREE.Mesh(wheelGeo, dark);
      w.rotation.z = Math.PI/2; w.position.set(wx, 0.4, wz); g.add(w);
    });
    // White star on hood
    const star = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    star.position.set(0, 1.21, 1.4); star.rotation.x = -Math.PI/2; g.add(star);
    g.position.set(x, 0, z);
    g.rotation.y = rand(-0.5, 0.5);
    this.scene.add(g);
    this.addObstacle(g, x, z, 1.2);
  }

  // ---- Sky: planes, paratroopers, bombs ----

  spawnPlane() {
    const g = new THREE.Group();
    const oliveMat = new THREE.MeshLambertMaterial({ color: 0x4a5a38 });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    // Fuselage
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 7, 8), oliveMat);
    body.rotation.z = Math.PI/2; g.add(body);
    // Wings
    const wings = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 1.5), oliveMat);
    wings.position.y = 0; g.add(wings);
    // Tail
    const tail = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 0.8), oliveMat);
    tail.position.x = -3.2; g.add(tail);
    // Vertical fin
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.15), oliveMat);
    fin.position.set(-3.2, 0.6, 0); g.add(fin);
    // Cockpit
    const cock = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.8), dark);
    cock.position.set(0.6, 0.4, 0); g.add(cock);
    // Engine nose
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 10), dark);
    eng.rotation.z = Math.PI/2; eng.position.x = 3.5; g.add(eng);
    // Star marking on wing (Allies)
    const star = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    star.rotation.x = -Math.PI/2; star.position.set(-2.5, 0.15, 0); g.add(star);
    // Start far side, fly across, with some altitude
    const fromLeft = Math.random() < 0.5;
    const z = rand(-30, 30);
    const y = rand(28, 42);
    const x0 = fromLeft ? -160 : 160;
    g.position.set(x0, y, z);
    g.rotation.y = fromLeft ? -Math.PI/2 : Math.PI/2;
    this.scene.add(g);
    const plane = {
      mesh: g,
      vx: (fromLeft ? 1 : -1) * rand(14, 22),
      dropTimer: rand(0.8, 2.0),
      dropsLeft: Math.random() < 0.7 ? Math.floor(rand(2, 5)) : 0
    };
    this.planes.push(plane);
  }

  dropParatrooper(px, py, pz) {
    const g = new THREE.Group();
    const white = new THREE.MeshLambertMaterial({ color: 0xeae0c8 });
    const olive = new THREE.MeshLambertMaterial({ color: 0x4a5a38 });
    const dark = new THREE.MeshLambertMaterial({ color: 0x1a1008 });
    // Parachute (hemisphere)
    const chute = new THREE.Mesh(new THREE.SphereGeometry(1.8, 14, 8, 0, Math.PI*2, 0, Math.PI/2), white);
    chute.position.y = 2.6;
    g.add(chute);
    // Rim shadow
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.05, 6, 14), dark);
    rim.position.y = 2.6; rim.rotation.x = Math.PI/2;
    g.add(rim);
    // Rope lines (4 simple cylinders)
    const ropeMat = new THREE.MeshLambertMaterial({ color: 0x2a2018 });
    [[-1.4,2.2],[1.4,2.2],[-1.0,1.8],[1.0,1.8]].forEach(([sx, sy])=>{
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.0, 4), ropeMat);
      rope.position.set(sx/2, sy/2 + 0.5, 0);
      rope.rotation.z = Math.atan2(0 - sx, 0.4);
      g.add(rope);
    });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 0.4), olive);
    body.position.y = 0.4; g.add(body);
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), new THREE.MeshLambertMaterial({ color: 0xc89878 }));
    head.position.y = 1.15; g.add(head);
    // Helmet
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 6, 0, Math.PI*2, 0, Math.PI/2), olive);
    helm.position.y = 1.32; helm.scale.y = 0.55; g.add(helm);
    g.position.set(px, py, pz);
    this.scene.add(g);
    this.paratroopers.push({ mesh: g, vy: -2.5, drift: rand(-0.3, 0.3) });
  }

  spawnBomb() {
    // Drop a bomb on the enemy side
    const x = rand(-50, 50);
    const z = rand(-50, -10);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.1, 8), new THREE.MeshLambertMaterial({ color: 0x2a2218 }));
    body.rotation.x = Math.PI/2; g.add(body);
    // Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 8), new THREE.MeshLambertMaterial({ color: 0x3a2818 }));
    nose.rotation.x = Math.PI/2; nose.position.z = -0.7;
    g.add(nose);
    // Tail fins
    const finMat = new THREE.MeshLambertMaterial({ color: 0x3a2818 });
    [0, Math.PI/2].forEach(a => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.4), finMat);
      fin.position.z = 0.55; fin.rotation.z = a;
      g.add(fin);
    });
    g.position.set(x, 50, z);
    this.scene.add(g);
    this.bombs.push({ mesh: g, vy: -28, x, z });
  }

  updateSky(dt) {
    // Planes
    for (const p of this.planes) {
      p.mesh.position.x += p.vx * dt;
      p.dropTimer -= dt;
      if (p.dropsLeft > 0 && p.dropTimer <= 0) {
        // Drop a paratrooper from current plane position (only behind enemy line — Z < -40)
        if (p.mesh.position.z < -10 || rand(0, 1) < 0.5) {
          // drop somewhere behind enemy line
          const dx = p.mesh.position.x + rand(-3, 3);
          const dy = p.mesh.position.y - 1;
          const dz = clamp(-60 + rand(-15, 5), -70, -30);
          this.dropParatrooper(dx, dy, dz);
        }
        p.dropsLeft--;
        p.dropTimer = rand(0.6, 1.4);
      }
    }
    this.planes = this.planes.filter(p => {
      if (Math.abs(p.mesh.position.x) > 200) {
        this.scene.remove(p.mesh);
        return false;
      }
      return true;
    });
    // New plane sometimes
    this.nextPlane -= dt;
    if (this.nextPlane <= 0) {
      this.spawnPlane();
      this.nextPlane = rand(10, 18);
    }

    // Paratroopers descend + drift
    for (const p of this.paratroopers) {
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.x += p.drift * dt;
      if (p.mesh.position.y <= 0.5) {
        // Landed — fade out then remove
        p.landed = (p.landed || 0) + dt;
        if (p.landed > 2.5) p.dead = true;
      }
    }
    this.paratroopers = this.paratroopers.filter(p => {
      if (p.dead) { this.scene.remove(p.mesh); return false; }
      return true;
    });

    // Bombs fall + explode on ground
    for (const b of this.bombs) {
      b.mesh.position.y += b.vy * dt;
      b.vy -= 16 * dt;
      if (b.mesh.position.y <= 0.2 && !b.exploded) {
        b.exploded = true;
        // Visual explosion (sphere flash + smoke)
        const flash = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffcc44, transparent: true, opacity: 0.85 }));
        flash.position.set(b.x, 1.5, b.z);
        this.scene.add(flash);
        b.flash = flash; b.flashLife = 0.4;
        // Smoke pillar
        const smoke = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 8), new THREE.MeshLambertMaterial({ color: 0x2a2218, transparent: true, opacity: 0.75 }));
        smoke.position.set(b.x, 4, b.z);
        this.scene.add(smoke);
        b.smoke = smoke; b.smokeLife = 1.6;
        // Damage enemies in radius
        for (const e of this.enemies) {
          if (e.dead) continue;
          const dx = e.x - b.x, dz = e.z - b.z;
          if (dx*dx + dz*dz < 25) this.hitEnemy(e, 60);
        }
        // Camera shake if close
        const px = this.camera.position.x, pz = this.camera.position.z;
        const dd = Math.hypot(px - b.x, pz - b.z);
        if (dd < 25) this.shake = Math.max(this.shake, 0.4 * (1 - dd/25));
        // Hide bomb mesh
        this.scene.remove(b.mesh);
      }
      if (b.exploded) {
        b.flashLife -= dt;
        b.smokeLife -= dt;
        if (b.flash) {
          b.flash.scale.setScalar(1 + (1 - b.flashLife/0.4) * 1.8);
          b.flash.material.opacity = Math.max(0, b.flashLife / 0.4 * 0.85);
        }
        if (b.smoke) {
          b.smoke.position.y += dt * 0.6;
          b.smoke.material.opacity = Math.max(0, b.smokeLife / 1.6 * 0.75);
        }
      }
    }
    this.bombs = this.bombs.filter(b => {
      if (b.exploded && b.smokeLife <= 0) {
        if (b.flash) this.scene.remove(b.flash);
        if (b.smoke) this.scene.remove(b.smoke);
        return false;
      }
      return true;
    });
    this.nextBomb -= dt;
    if (this.nextBomb <= 0) {
      this.spawnBomb();
      this.nextBomb = rand(4, 9);
    }

    // Wobble wreck smoke
    if (this._wrecks) {
      for (const w of this._wrecks) {
        if (!w.userData.smoke) continue;
        const t = this.time + w.userData.t0;
        w.userData.smoke.forEach((s, i) => {
          s.position.x = Math.sin(t * 0.8 + i) * 0.25;
          s.position.y = 3.2 + i * 1.1 + Math.sin(t + i) * 0.1;
        });
      }
    }
    // Bob destroyer ships on the waves
    if (this._destroyers) {
      for (const d of this._destroyers) {
        d.mesh.position.y = d.baseY + Math.sin(this.time * 0.6 + d.phase) * 0.3;
        d.mesh.rotation.z = Math.sin(this.time * 0.4 + d.phase) * 0.025;
      }
    }
    // Water plane gentle shimmer (subtle UV-less wobble via Y offset)
    if (this.water) {
      this.water.position.y = 0.02 + Math.sin(this.time * 1.2) * 0.04;
    }
  }

  makeAllyMesh(x, y, z) {
    const g = new THREE.Group();
    // legs — Allied BLUE
    const legMat = new THREE.MeshLambertMaterial({ color: 0x3060a0 });
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), legMat);
    legs.position.y = 0.45; g.add(legs);
    // body — blue uniform
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.5), new THREE.MeshLambertMaterial({ color: 0x3060a0 }));
    body.position.y = 1.4; g.add(body);
    // head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0xc89878 }));
    head.position.y = 2.1; g.add(head);
    // helmet (M1) — lighter blue
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshLambertMaterial({ color: 0x5090d0 }));
    helmet.position.y = 2.32; helmet.scale.y = 0.6; g.add(helmet);
    // rifle
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 1.2), new THREE.MeshLambertMaterial({ color: 0x3a2a18 }));
    rifle.position.set(0.4, 1.35, 0.3); rifle.rotation.x = -0.1; g.add(rifle);
    g.position.set(x, y, z);
    this.scene.add(g);
    return {
      mesh: g, hp: 60, dead: false, lastShot: 0,
      targetZ: rand(-15, 25),
      speed: rand(2.4, 4.2),
      wobble: rand(0, Math.PI * 2),
      walkPhase: rand(0, Math.PI * 2)
    };
  }

  // ---- ENEMIES ----

  tickWaves(dt) {
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
  }

  spawnWave() {
    const baseCount = 6 + this.wave * 2;  // tuned for playability
    const count = Math.round(baseCount * this.level.enemyCount * 0.5);
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
    if (this.controlsLocked) return;
    if (this.inTank) { this.tankFire(); return; }
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

    // Paratrooper waiting in the C-47 — press ENTER to jump
    if (this.paraInPlane) {
      // Camera drifts forward like flying in a plane, slight side-to-side
      this.camera.position.x += Math.sin(this.time * 0.5) * 0.2;
      // Show the prompt
      const promptEl = document.getElementById('dday-jump-prompt');
      if (promptEl) promptEl.classList.add('show');
      // Allow touch look
      if (touchLook.active) {
        lookYaw   -= touchLook.x * dt * 2.2;
        lookPitch -= touchLook.y * dt * 1.8;
        lookPitch = clamp(lookPitch, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
      }
      this.camera.rotation.y = lookYaw;
      this.camera.rotation.x = lookPitch;
      return;
    }

    // Captain riding the landing craft toward the beach
    if (this.captainOnShip) {
      this.updateCaptainShip(dt);
      this.tickWaves(dt);
      return;
    }

    // Pilot mode: dedicated flight loop
    if (this.pilotMode) {
      this.updatePilot(dt);
      return;
    }

    // Paratrooper descent intro
    if (this.paraDrop) {
      this.camera.position.y -= 6 * dt;
      this.camera.position.x += Math.sin(this.time * 0.7) * 0.4 * dt;
      if (this.paraMesh) {
        this.paraMesh.position.copy(this.camera.position);
        this.paraMesh.position.y += 0.5;
        this.paraMesh.rotation.y = Math.sin(this.time * 0.4) * 0.1;
      }
      // Touch look still allowed
      if (touchLook.active) {
        lookYaw   -= touchLook.x * dt * 2.2;
        lookPitch -= touchLook.y * dt * 1.8;
        lookPitch = clamp(lookPitch, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
      }
      this.camera.rotation.y = lookYaw;
      this.camera.rotation.x = lookPitch;
      if (this.camera.position.y <= 1.7) {
        this.camera.position.y = 1.7;
        this.paraDrop = false;
        this.controlsLocked = false;
        if (this.paraMesh) {
          this.scene.remove(this.paraMesh);
          this.paraMesh = null;
        }
        lookPitch = 0;
        this.toast('Boots on the ground — fight!', 2000);
      }
      // Skip rest of update during descent (no shooting, no waves running)
      return;
    }

    // Sniper ADS zoom transition
    if (this.role.id === 'sniper') {
      const targetT = this.adsActive ? 1 : 0;
      this.adsTransition = lerp(this.adsTransition, targetT, Math.min(1, dt * 8));
      this.camera.fov = lerp(this.baseFov, this.adsFov, this.adsTransition);
      this.camera.updateProjectionMatrix();
      const scopeEl = document.getElementById('dday-scope');
      if (scopeEl) scopeEl.style.opacity = this.adsTransition;
    }

    // Tank-driving mode: completely different controls
    if (this.inTank) {
      this.updateTankDriving(dt);
      return;
    }

    // Movement
    const sp = 6 * (this.sprintActive || keys['shift'] ? 1.6 : 1);
    let mx = 0, mz = 0;
    if (!this.controlsLocked) {
      if (keys['w'] || keys['arrowup'])    mz -= 1;
      if (keys['s'] || keys['arrowdown'])  mz += 1;
      if (keys['a'] || keys['arrowleft'])  mx -= 1;
      if (keys['d'] || keys['arrowright']) mx += 1;
    }
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

    // Medic heal aura: heal self and nearby allies every 2s
    if (this.role.id === 'medic') {
      this._healAuraTimer -= dt;
      if (this._healAuraTimer <= 0) {
        this._healAuraTimer = 2.0;
        if (this.hp < this.maxHp) {
          this.hp = Math.min(this.maxHp, this.hp + 4);
          this.updateHpHUD();
        }
        for (const a of this.allies) {
          if (a.dead) continue;
          const dx = a.mesh.position.x - this.camera.position.x;
          const dz = a.mesh.position.z - this.camera.position.z;
          if (dx*dx + dz*dz < 100) {
            a.hp = Math.min(60, (a.hp || 60) + 6);
          }
        }
      }
    }

    // Tank-enter prompt: find closest allied tank within 5m
    this.nearTank = null;
    if (this._allyTanks) {
      let best = null, bd = 5*5;
      for (const t of this._allyTanks) {
        const dx = t.x - this.camera.position.x;
        const dz = t.z - this.camera.position.z;
        const d2 = dx*dx + dz*dz;
        if (d2 < bd) { bd = d2; best = t; }
      }
      this.nearTank = best;
    }
    const tEl = document.getElementById('dday-enter-tank');
    if (tEl) tEl.style.display = (this.nearTank && !this.inTank) ? 'block' : 'none';

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

    // Wave state machine
    this.tickWaves(dt);

    // BREACH objective: progress bar + win condition (reach Z=-50)
    // Only applies to roles that start on the friendly side
    const z = this.camera.position.z;
    if (this.spawnedOnFriendlySide) {
      const progress = clamp((60 - z) / (60 - (-50)), 0, 1);
      const obj = document.getElementById('dday-obj-bar');
      if (obj) obj.style.width = (progress * 100) + '%';
      if (z < -50 && !this.over && !this.pilotMode) {
        this.toast('THE LINE IS BREACHED!', 2500);
        this.win();
        return;
      }
    } else {
      // Paratrooper / pilot: hide the breach UI
      const objCard = document.getElementById('dday-objective');
      if (objCard) objCard.style.display = 'none';
    }

    // Update enemies
    for (const e of this.enemies) this.updateEnemy(e, dt);
    // Remove dead-and-faded
    this.enemies = this.enemies.filter(e => {
      if (e.dead && e.dying <= 0) { this.scene.remove(e.mesh); return false; }
      return true;
    });

    // Allies + reinforcements from the surf
    for (const a of this.allies) this.updateAlly(a, dt);
    this.allies = this.allies.filter(a => {
      if (a.dead) { this.scene.remove(a.mesh); return false; }
      return true;
    });
    if (this.level.terrain === 'beach') {
      this.allyRespawnTimer = (this.allyRespawnTimer || 2) - dt;
      if (this.allyRespawnTimer <= 0 && this.allies.length < (this.maxAllies || 70)) {
        // Spawn batch of 4-6 new allies coming out of the water
        const n = Math.floor(rand(4, 7));
        for (let i = 0; i < n; i++) {
          const ally = this.makeAllyMesh(rand(-70, 70), 0, 80 + rand(-8, 8));
          this.allies.push(ally);
        }
        this.allyRespawnTimer = rand(1.2, 2.2);
      }
    }

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

    // Sky activity (planes, paratroopers, bombs)
    this.updateSky(dt);
    // Boats sailing in + tanks driving and firing
    this.updateVehicles(dt);

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
    let moved = false;
    if (!e.type.isStatic && d > 25) {
      const sp = e.type.speed;
      const ang = Math.atan2(dx, dz);
      const nx = e.x + Math.sin(ang) * sp * dt;
      const nz = e.z + Math.cos(ang) * sp * dt;
      // Avoid obstacles
      if (!this.collidesObstacle(nx, nz, 0.6)) { e.x = nx; e.z = nz; moved = true; }
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
    // Walk-bob animation
    e.walkPhase = (e.walkPhase || 0) + dt * (moved ? 7 : 0);
    if (moved) {
      e.mesh.position.y = Math.abs(Math.sin(e.walkPhase)) * 0.16;
      const legs = e.mesh.children[0];
      if (legs && legs.geometry && legs.geometry.type === 'BoxGeometry' && !e.type.isStatic && !e.type.isVehicle) {
        legs.rotation.x = Math.sin(e.walkPhase) * 0.35;
      }
    } else if (!e.type.isStatic && !e.type.isVehicle) {
      e.mesh.position.y = 0;
      const legs = e.mesh.children[0];
      if (legs) legs.rotation.x = 0;
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
    let moving = false;
    // Advance forward (negative Z)
    if (a.mesh.position.z > a.targetZ) {
      const sp = a.speed || 3.2;
      a.mesh.position.z -= sp * dt;
      // Slight lateral wander for organic feel
      a.mesh.position.x += Math.sin(this.time * 1.5 + (a.wobble||0)) * 0.4 * dt;
      moving = true;
      // Face forward when running
      a.mesh.rotation.y = Math.PI;
    } else {
      // Shoot at nearest enemy
      let target = null, bd = 50;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const dx = e.x - a.mesh.position.x, dz = e.z - a.mesh.position.z;
        const d = Math.hypot(dx, dz);
        if (d < bd) { target = e; bd = d; }
      }
      if (target) {
        a.mesh.rotation.y = Math.atan2(target.x - a.mesh.position.x, target.z - a.mesh.position.z);
        const now = this.time * 1000;
        if (now - a.lastShot > 1100) {
          a.lastShot = now;
          if (Math.random() < 0.55) this.hitEnemy(target, 12);
          this.spawnTracer(
            new THREE.Vector3(a.mesh.position.x, 1.6, a.mesh.position.z),
            new THREE.Vector3(target.x, 1.5, target.z)
          );
        }
      }
    }
    // Run/walk bob: bounce vertically and swing legs/body
    a.walkPhase = (a.walkPhase || 0) + dt * (moving ? 9 : 0);
    if (moving) {
      a.mesh.position.y = Math.abs(Math.sin(a.walkPhase)) * 0.18;
      // Lean forward slightly
      a.mesh.rotation.z = Math.sin(a.walkPhase * 0.5) * 0.04;
      // Animate legs if present (children indexed in makeAllyMesh — leg = first child)
      const legs = a.mesh.children[0];
      if (legs) legs.rotation.x = Math.sin(a.walkPhase) * 0.4;
    } else {
      a.mesh.position.y = 0;
      a.mesh.rotation.z = 0;
      const legs = a.mesh.children[0];
      if (legs) legs.rotation.x = 0;
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
  document.addEventListener('mousedown', e=>{
    if (!pointerLocked) return;
    if (e.button === 2) {
      // Right click: sniper ADS
      if (fpsGame && fpsGame.role.id === 'sniper') fpsGame.adsActive = true;
      return;
    }
    mouseDown = true;
    if (fpsGame) fpsGame.tryFire();
  });
  document.addEventListener('mouseup', e=>{
    if (e.button === 2) {
      if (fpsGame && fpsGame.role.id === 'sniper') fpsGame.adsActive = false;
      return;
    }
    mouseDown = false;
  });
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
  if (k === 'e') {
    e.preventDefault();
    if (fpsGame) {
      if (fpsGame.inTank) fpsGame.exitTank();
      else if (fpsGame.nearTank) fpsGame.enterTank();
    }
  }
  if (k === 'enter') {
    e.preventDefault();
    if (fpsGame && fpsGame.paraInPlane) fpsGame.jumpFromPlane();
  }
  if (k === 'v') {
    e.preventDefault();
    if (fpsGame && fpsGame.pilotMode) {
      fpsGame.pilotThirdPerson = !fpsGame.pilotThirdPerson;
      fpsGame.toast(fpsGame.pilotThirdPerson ? 'Third-person camera (V)' : 'Cockpit view (V)', 1200);
    }
  }
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
