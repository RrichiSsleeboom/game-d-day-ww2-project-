/* ============================================================
   D-Day: June 6, 1944 — Educational Game
   Minimal screen router. Currently wires the FPS intro;
   later screens (title, role-select, scene, etc.) plug in here.
   ============================================================ */

(function () {
  'use strict';

  const app = document.getElementById('app');
  if (!app) return;

  // --- SVG: POV gloved hands + rifle ---
  const POV_SVG = `
    <svg viewBox="0 0 800 320" aria-hidden="true">
      <defs>
        <linearGradient id="gloveGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#5a4028"/>
          <stop offset="100%" stop-color="#2a1c0e"/>
        </linearGradient>
        <linearGradient id="sleeveGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#4a5a38"/>
          <stop offset="100%" stop-color="#2a3420"/>
        </linearGradient>
        <linearGradient id="rifleGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#4a3420"/>
          <stop offset="100%" stop-color="#1a1008"/>
        </linearGradient>
        <linearGradient id="barrelGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#3a3a3a"/>
          <stop offset="100%" stop-color="#0e0e0e"/>
        </linearGradient>
      </defs>

      <!-- Left sleeve (supporting hand) -->
      <path d="M40,320 L40,250 Q60,220 140,200 L200,220 L200,320 Z" fill="url(#sleeveGrad)" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Mud splatter on left sleeve -->
      <circle cx="80" cy="260" r="6" fill="#1a1008" opacity="0.7"/>
      <circle cx="120" cy="240" r="4" fill="#1a1008" opacity="0.6"/>
      <circle cx="160" cy="280" r="5" fill="#1a1008" opacity="0.8"/>

      <!-- Left glove (supporting fore-stock) -->
      <path d="M140,200 Q180,185 240,190 Q280,195 300,220 L280,240 Q250,230 210,230 Q170,232 145,240 Z"
            fill="url(#gloveGrad)" stroke="#0a0a0a" stroke-width="1.2"/>
      <!-- Finger creases -->
      <path d="M200,210 Q210,218 220,212" stroke="#1a0e06" stroke-width="1.5" fill="none"/>
      <path d="M230,208 Q240,216 250,210" stroke="#1a0e06" stroke-width="1.5" fill="none"/>

      <!-- Rifle stock (wooden, bottom-right) -->
      <path d="M480,320 L480,230 Q500,215 560,210 L620,210 L620,320 Z" fill="url(#rifleGrad)" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Stock grain lines -->
      <path d="M500,240 L610,235" stroke="#1a0e06" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M500,260 L610,255" stroke="#1a0e06" stroke-width="0.8" fill="none" opacity="0.5"/>

      <!-- Rifle receiver/action (angled slightly up-right) -->
      <path d="M300,220 L480,205 L520,205 L520,230 L300,248 Z" fill="url(#rifleGrad)" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Bolt detail -->
      <rect x="440" y="198" width="24" height="10" fill="#1a1008" stroke="#0a0a0a" stroke-width="0.8"/>
      <rect x="450" y="190" width="6" height="10" fill="#2a1a0c"/>
      <!-- Trigger guard -->
      <path d="M470,230 Q478,248 492,248 L500,230 Z" fill="none" stroke="#1a0e06" stroke-width="2"/>

      <!-- Barrel (extending up-right) -->
      <path d="M280,210 L260,195 L240,160 L230,145 L260,140 L280,175 L300,198 Z" fill="url(#barrelGrad)" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Front sight -->
      <rect x="240" y="140" width="4" height="10" fill="#0a0a0a"/>
      <!-- Muzzle -->
      <circle cx="242" cy="145" r="3" fill="#000"/>

      <!-- Right glove (trigger hand) -->
      <path d="M520,210 Q560,195 610,200 L640,220 Q620,230 580,230 Q545,232 520,230 Z"
            fill="url(#gloveGrad)" stroke="#0a0a0a" stroke-width="1.2"/>
      <!-- Finger on trigger -->
      <path d="M540,226 Q548,238 556,232" stroke="#1a0e06" stroke-width="1.5" fill="none"/>

      <!-- Right sleeve -->
      <path d="M620,320 L620,240 Q660,225 720,230 L760,250 L760,320 Z" fill="url(#sleeveGrad)" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Mud splatter on right sleeve -->
      <circle cx="680" cy="280" r="5" fill="#1a1008" opacity="0.7"/>
      <circle cx="720" cy="260" r="4" fill="#1a1008" opacity="0.6"/>
    </svg>
  `;

  // --- SVG: ammo magazine icon ---
  const AMMO_ICON_SVG = `
    <svg viewBox="0 0 28 16" aria-hidden="true">
      <rect x="1" y="2" width="22" height="12" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <rect x="23" y="5" width="4" height="6" fill="currentColor"/>
      <line x1="5"  y1="2" x2="5"  y2="14" stroke="currentColor" stroke-width="0.8"/>
      <line x1="9"  y1="2" x2="9"  y2="14" stroke="currentColor" stroke-width="0.8"/>
      <line x1="13" y1="2" x2="13" y2="14" stroke="currentColor" stroke-width="0.8"/>
      <line x1="17" y1="2" x2="17" y2="14" stroke="currentColor" stroke-width="0.8"/>
    </svg>
  `;

  // --- Photorealistic AI backdrop (generated in user's browser) ---
  // Uses Pollinations.ai — free, no API key. The image is produced the
  // first time the URL is hit, then cached on their CDN. If the service
  // is unreachable the CSS gradient underneath shows through.
  const BACKDROP_PROMPT = [
    'hyperrealistic first-person POV view',
    'D-Day Omaha Beach June 6 1944',
    'soldier muddy gloved hands holding M1 Garand rifle',
    'vaulting burning Czech hedgehog steel obstacle on sandy beach',
    'US Army soldiers advancing through surf',
    'medic crouching, officer pointing, radio operator, sapper with bangalore',
    'BAR machine gunner prone, scout running, wounded soldier, flag bearer',
    'combat engineer, rifleman advancing',
    'massive explosions thick black smoke',
    'water splashing bullet impacts',
    'cinematic lighting overcast sky',
    'Unreal Engine 5 photorealistic 8K sharp detail'
  ].join(', ');

  const BACKDROP_URL =
    'https://image.pollinations.ai/prompt/' +
    encodeURIComponent(BACKDROP_PROMPT) +
    '?width=1920&height=1080&nologo=true&enhance=true&seed=19440606';

  // --- Squad roster: 10 roles, always visible in HUD ---
  const SQUAD = [
    { icon: '⚕',  name: 'Medic',      status: 'ok' },
    { icon: '★',  name: 'Officer',    status: 'ok' },
    { icon: '⦿',  name: 'Radio Op',   status: 'ok' },
    { icon: '⚒',  name: 'Sapper',     status: 'ok' },
    { icon: '⚙',  name: 'BAR Gunner', status: 'ok' },
    { icon: '➤',  name: 'Scout',      status: 'ok' },
    { icon: '✚',  name: 'Wounded',    status: 'wounded' },
    { icon: '⚑',  name: 'Flag Bearer',status: 'ok' },
    { icon: '⚡',  name: 'Engineer',   status: 'ok' },
    { icon: '⟦⟧', name: 'Rifleman',   status: 'ok' }
  ];

  function renderSquadRoster() {
    return SQUAD.map(function (r) {
      return '<li class="' + r.status + '">'
           +   '<span class="icon">' + r.icon + '</span>'
           +   '<span class="name">' + r.name + '</span>'
           +   '<span class="dot-status" aria-hidden="true"></span>'
           + '</li>';
    }).join('');
  }

  // --- Render: FPS intro screen ---
  function renderFpsIntro() {
    app.innerHTML = `
      <section class="screen-fps-intro" role="img"
        aria-label="First-person view on Omaha Beach, D-Day. Soldier's gloved hands grip an M1 Garand rifle. Ten squad roles are active: medic, officer, radio operator, sapper, BAR gunner, scout, wounded soldier, flag bearer, engineer and rifleman. HUD shows objective, compass, health, ammo and squad status.">

        <div class="fps-photo" style="background-image: url('${BACKDROP_URL}')"></div>

        <div class="fps-smoke"></div>

        <div class="fps-splash">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>

        <div class="fps-pov">${POV_SVG}</div>

        <div class="fps-hud">
          <div class="fps-hud__corner fps-hud__objective">
            <span class="fps-hud__label">Objective</span>
            <span class="fps-hud__value">Secure the Beach</span>
          </div>

          <div class="fps-hud__corner fps-hud__compass">
            <span class="fps-hud__label">Heading 315°</span>
            <div class="fps-hud__compass-strip">
              <span>W</span><span>NW</span><span class="north">N</span><span>NE</span><span>E</span>
            </div>
          </div>

          <div class="fps-hud__corner fps-hud__squad">
            <div class="fps-hud__squad-title">Easy Company · 10 Active</div>
            <ul>${renderSquadRoster()}</ul>
          </div>

          <div class="fps-hud__corner fps-hud__health">
            <span class="fps-hud__label">Health</span>
            <span class="fps-hud__value">100</span>
            <div class="fps-hud__bar" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
          </div>

          <div class="fps-hud__corner fps-hud__ammo">
            <span class="fps-hud__label">Ammo</span>
            <div class="fps-hud__ammo-row">
              <span class="fps-hud__ammo-mag">30</span>
              <span class="fps-hud__ammo-reserve">/ 120</span>
              <span class="fps-hud__ammo-icon">${AMMO_ICON_SVG}</span>
            </div>
          </div>

          <div class="fps-hud__crosshair" aria-hidden="true"><i></i></div>
        </div>

        <div class="fps-vignette" aria-hidden="true"></div>

        <button class="fps-deploy-prompt" type="button" data-action="deploy">
          Press to Deploy
        </button>
      </section>
    `;

    const btn = app.querySelector('[data-action="deploy"]');
    btn.focus({ preventScroll: true });
    btn.addEventListener('click', deploy);
    document.addEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      deploy();
    }
  }

  function deploy() {
    document.removeEventListener('keydown', onKey);
    console.log('[d-day] continue → narrative scene (not yet implemented)');
    // Placeholder: clear the screen and show a simple confirmation.
    // When the narrative screens are wired in, replace this with the
    // appropriate renderRoleIntro() / renderScene() call.
    app.innerHTML = `
      <section class="screen-title">
        <div class="title-date">June 6, 1944</div>
        <h1 class="title-heading">Boots on the <span>Ground</span></h1>
        <div class="title-divider"></div>
        <p class="title-description">
          The next screen — role selection and the narrative gameplay — will be added here.
        </p>
        <button class="btn-primary" type="button" data-action="restart">Replay Intro</button>
      </section>
    `;
    const restart = app.querySelector('[data-action="restart"]');
    if (restart) restart.addEventListener('click', renderFpsIntro);
  }

  // Boot
  document.addEventListener('DOMContentLoaded', renderFpsIntro);
  if (document.readyState !== 'loading') renderFpsIntro();
})();
