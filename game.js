/* ============================================================
   D-Day: June 6, 1944 — Educational Game
   Minimal screen router. Currently wires the FPS intro;
   later screens (title, role-select, scene, etc.) plug in here.
   ============================================================ */

(function () {
  'use strict';

  const app = document.getElementById('app');
  if (!app) return;

  // --- SVG: 10 distinct soldier silhouettes (distant, backlit) ---
  // viewBox 1000x200, each figure occupies ~90px slot.
  const SILHOUETTES_SVG = `
    <svg viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="silGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#1a0e08"/>
          <stop offset="100%" stop-color="#050302"/>
        </linearGradient>
      </defs>
      <g fill="url(#silGrad)" stroke="#000" stroke-width="0.5">
        <!-- 1. Medic crouching (red cross on back) -->
        <g transform="translate(40,60)">
          <ellipse cx="20" cy="18" rx="8" ry="9"/>
          <path d="M10,28 Q12,52 18,80 L28,80 Q30,58 30,30 Q30,26 26,25 L14,25 Q10,26 10,28 Z"/>
          <rect x="14" y="40" width="12" height="14" fill="#5a1010"/>
          <rect x="18" y="36" width="4" height="22" fill="#5a1010"/>
          <rect x="12" y="44" width="16" height="4" fill="#5a1010"/>
          <path d="M8,80 L6,110 L12,110 L16,82 Z"/>
          <path d="M32,80 L34,110 L28,110 L24,82 Z"/>
        </g>

        <!-- 2. Officer pointing forward -->
        <g transform="translate(150,30)">
          <ellipse cx="22" cy="14" rx="8" ry="9"/>
          <path d="M22,5 Q34,6 36,14 L38,18 L32,18 Q30,10 22,9 Q14,10 12,18 L6,18 Q8,6 22,5 Z"/>
          <path d="M14,24 L14,70 L30,70 L30,24 Q30,22 26,22 L18,22 Q14,22 14,24 Z"/>
          <path d="M30,36 Q50,30 70,28 L72,34 Q50,38 30,42 Z"/>
          <path d="M12,80 L10,120 L16,120 L20,82 Z"/>
          <path d="M32,80 L34,120 L28,120 L24,82 Z"/>
          <rect x="14" y="68" width="16" height="14"/>
        </g>

        <!-- 3. Rifleman advancing -->
        <g transform="translate(260,40)">
          <ellipse cx="22" cy="14" rx="8" ry="9"/>
          <path d="M14,24 L14,68 L32,68 L32,24 Q32,22 28,22 L18,22 Q14,22 14,24 Z"/>
          <path d="M10,30 L8,60 L14,60 L16,32 Z"/>
          <path d="M32,32 Q48,26 64,22 L66,26 Q50,34 34,38 Z"/>
          <rect x="50" y="22" width="26" height="3" fill="#2a1a0c"/>
          <rect x="44" y="24" width="10" height="6" fill="#3a2410"/>
          <path d="M12,74 L8,118 L16,118 L20,76 Z"/>
          <path d="M32,74 L36,118 L28,118 L24,76 Z"/>
          <rect x="14" y="66" width="18" height="12"/>
        </g>

        <!-- 4. Radio operator (hunched with antenna) -->
        <g transform="translate(370,45)">
          <ellipse cx="22" cy="16" rx="8" ry="9"/>
          <path d="M14,28 Q10,44 14,68 L32,68 Q36,44 32,28 Q32,24 28,24 L18,24 Q14,24 14,28 Z"/>
          <rect x="10" y="34" width="10" height="18" fill="#2a2010"/>
          <line x1="14" y1="34" x2="6" y2="0" stroke="#2a1a0c" stroke-width="1.2"/>
          <path d="M12,74 L10,118 L16,118 L20,76 Z"/>
          <path d="M32,74 L34,118 L28,118 L24,76 Z"/>
          <rect x="14" y="66" width="18" height="12"/>
        </g>

        <!-- 5. Sapper with bangalore (horizontal tube) -->
        <g transform="translate(470,50)">
          <ellipse cx="22" cy="14" rx="7" ry="8"/>
          <path d="M15,22 L15,62 L29,62 L29,22 Q29,20 26,20 L18,20 Q15,20 15,22 Z"/>
          <rect x="5" y="40" width="50" height="4" fill="#1a1008"/>
          <circle cx="5" cy="42" r="3" fill="#1a1008"/>
          <path d="M14,66 L12,110 L18,110 L20,68 Z"/>
          <path d="M30,66 L32,110 L26,110 L24,68 Z"/>
        </g>

        <!-- 6. BAR gunner prone -->
        <g transform="translate(560,88)">
          <ellipse cx="14" cy="12" rx="7" ry="6"/>
          <path d="M10,16 L48,22 L48,30 L10,26 Q6,22 10,16 Z"/>
          <rect x="40" y="18" width="40" height="4" fill="#2a1a0c"/>
          <rect x="30" y="20" width="8" height="6" fill="#3a2410"/>
          <path d="M48,26 L70,32 L70,36 L48,32 Z"/>
        </g>

        <!-- 7. Scout running (mid-stride) -->
        <g transform="translate(660,38)">
          <ellipse cx="22" cy="12" rx="7" ry="8"/>
          <path d="M14,20 L16,60 L28,60 L30,20 Q30,18 26,18 L18,18 Q14,18 14,20 Z"/>
          <path d="M10,26 L2,50 L8,52 L14,28 Z"/>
          <path d="M30,26 L44,20 L46,24 L32,30 Z"/>
          <path d="M16,62 L6,100 L14,102 L22,64 Z"/>
          <path d="M26,62 L38,108 L32,112 L22,64 Z"/>
        </g>

        <!-- 8. Wounded soldier on one knee -->
        <g transform="translate(760,60)">
          <ellipse cx="22" cy="14" rx="8" ry="9"/>
          <path d="M14,24 Q12,42 18,58 L28,58 Q34,42 32,24 Q32,22 28,22 L18,22 Q14,22 14,24 Z"/>
          <path d="M10,32 L6,56 L12,58 L16,34 Z"/>
          <path d="M16,60 L8,96 L18,98 L24,62 Z"/>
          <path d="M28,58 L44,82 L40,88 L24,66 Z"/>
        </g>

        <!-- 9. Flag bearer (pole raised) -->
        <g transform="translate(840,30)">
          <ellipse cx="22" cy="14" rx="8" ry="9"/>
          <path d="M14,24 L14,68 L32,68 L32,24 Q32,22 28,22 L18,22 Q14,22 14,24 Z"/>
          <rect x="34" y="0" width="2" height="70" fill="#1a1008"/>
          <path d="M36,2 L62,6 L58,22 L36,20 Z" fill="#3a2418"/>
          <path d="M8,80 L6,118 L12,118 L16,82 Z"/>
          <path d="M32,80 L34,118 L28,118 L24,82 Z"/>
          <rect x="14" y="68" width="18" height="12"/>
        </g>

        <!-- 10. Engineer carrying demo pack -->
        <g transform="translate(930,45)">
          <ellipse cx="22" cy="14" rx="8" ry="9"/>
          <path d="M14,24 L14,68 L32,68 L32,24 Q32,22 28,22 L18,22 Q14,22 14,24 Z"/>
          <rect x="6" y="30" width="14" height="22" fill="#1a1008"/>
          <path d="M12,74 L10,114 L16,114 L20,76 Z"/>
          <path d="M32,74 L34,114 L28,114 L24,76 Z"/>
          <rect x="14" y="66" width="18" height="12"/>
        </g>
      </g>
    </svg>
  `;

  // --- SVG: Czech hedgehog (crossed steel beams) ---
  const HEDGEHOG_SVG = `
    <svg viewBox="0 0 220 180" aria-hidden="true">
      <defs>
        <linearGradient id="beamGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"  stop-color="#3a2818"/>
          <stop offset="50%" stop-color="#1a0e06"/>
          <stop offset="100%" stop-color="#0a0604"/>
        </linearGradient>
      </defs>
      <g stroke="#000" stroke-width="1" fill="url(#beamGrad)">
        <polygon points="30,170 50,165 185,40 175,30"/>
        <polygon points="190,170 170,168 50,40 60,30"/>
        <polygon points="110,175 118,175 118,25 108,25"/>
        <circle cx="110" cy="100" r="8" fill="#1a0e06"/>
      </g>
    </svg>
  `;

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

  // --- Render: FPS intro screen ---
  function renderFpsIntro() {
    app.innerHTML = `
      <section class="screen-fps-intro" role="img"
        aria-label="First-person view: a soldier's gloved hands grip an M1 Garand rifle while vaulting a burning steel obstacle on Omaha Beach. Ten soldiers in varied roles — medic, officer, radio operator, sapper, BAR gunner, scout, wounded, flag bearer, engineer, rifleman — advance through smoke and explosions. HUD shows objective, compass, health and ammo.">

        <div class="fps-silhouettes">${SILHOUETTES_SVG}</div>

        <div class="fps-explosion e1"></div>
        <div class="fps-explosion e2"></div>
        <div class="fps-explosion e3"></div>

        <div class="fps-smoke"></div>

        <div class="fps-hedgehog">${HEDGEHOG_SVG}</div>

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
