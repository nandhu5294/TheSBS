/* ═══════════════════════════════════════════════════
   THE SECRET BURGER SOCIETY — SCRIPT v2
   Initiation Gate · Cipher BG · Typewriter · Glitch
   Countdown · Eye Tracking · Particles · Parallax
═══════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────────
   1. INITIATION GATE
   Full-screen entry overlay with eye tracking
───────────────────────────────────────────────── */
(function initGate() {
  const gate    = document.getElementById('initiationGate');
  const btn     = document.getElementById('gateBtn');
  const eyeGlyph = document.getElementById('gateEyeGlyph');
  if (!gate || !btn) return;

  /* Eye follows cursor */
  document.addEventListener('mousemove', (e) => {
    if (gate.classList.contains('dismissed')) return;
    const wrap = document.getElementById('gateEyeWrap');
    if (!wrap || !eyeGlyph) return;
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth  * 10;
    const dy = (e.clientY - cy) / window.innerHeight * 10;
    eyeGlyph.style.transform = `translate(${dx}px, ${dy}px)`;
  }, { passive: true });

  /* Enter button */
  btn.addEventListener('click', () => {
    const btnText = btn.querySelector('.gate-btn-text');
    if (btnText) btnText.textContent = 'INITIATING…';
    btn.disabled = true;

    /* White flash */
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed; inset:0; background:#fff;
      opacity:0; z-index:200000; pointer-events:none;
      transition:opacity 0.08s;
    `;
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '1';
      setTimeout(() => {
        flash.style.transition = 'opacity 0.65s';
        flash.style.opacity    = '0';
        gate.classList.add('dismissed');
        document.body.classList.remove('locked');
        setTimeout(() => { gate.remove(); flash.remove(); }, 900);
      }, 120);
    });
  });
})();


/* ─────────────────────────────────────────────────
   2. CIPHER BACKGROUND (hero)
   Animated grid of random alphanumeric chars
───────────────────────────────────────────────── */
(function initCipherBg() {
  const bg = document.getElementById('cipherBg');
  if (!bg) return;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=[]{}|<>';
  const rnd   = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  // Fill with ~1 char per 160px²
  const count = Math.max(200, Math.floor(window.innerWidth * (window.innerHeight - 28) / 160));
  let arr = [];
  for (let i = 0; i < count; i++) arr.push(rnd());
  bg.textContent = arr.join('');

  // Randomly mutate a few chars every 90ms
  setInterval(() => {
    const text = bg.textContent;
    let chars  = text.split('');
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      if (chars[idx] !== ' ') chars[idx] = rnd();
    }
    bg.textContent = chars.join('');
  }, 90);
})();


/* ─────────────────────────────────────────────────
   3. TYPEWRITER — hero subtitle
───────────────────────────────────────────────── */
(function initTypewriter() {
  const el     = document.getElementById('heroSub');
  const cursor = document.getElementById('twCursor');
  if (!el) return;

  const text  = '25 burgers. One city. Tonight.';
  let   index = 0;

  function type() {
    if (index <= text.length) {
      el.textContent = text.slice(0, index);
      index++;
      setTimeout(type, index === text.length ? 0 : 55 + Math.random() * 40);
    } else {
      // Hide cursor after a pause
      setTimeout(() => {
        if (cursor) cursor.style.animation = 'cursorBlink 1.4s step-end infinite';
      }, 800);
    }
  }

  // Start after hero animations settle
  setTimeout(type, 1400);
})();


/* ─────────────────────────────────────────────────
   4. TITLE GLITCH — periodic corruption
───────────────────────────────────────────────── */
(function initGlitch() {
  const title = document.getElementById('heroTitle');
  if (!title) return;

  // Ensure title is fully visible before glitching
  setTimeout(() => {
    title.style.opacity = '1';
    title.style.transform = 'none';

    function triggerGlitch() {
      title.classList.add('glitching');
      setTimeout(() => title.classList.remove('glitching'), 420);
      // Next glitch at random interval 4–12s
      setTimeout(triggerGlitch, 4000 + Math.random() * 8000);
    }
    setTimeout(triggerGlitch, 3000 + Math.random() * 4000);
  }, 1600);
})();


/* ─────────────────────────────────────────────────
   5. LIVE COUNTDOWN — counts to next midnight
───────────────────────────────────────────────── */
(function initCountdown() {
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');
  if (!hEl || !mEl || !sEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now      = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000)  / 1_000);

    // Animate digit change with a brief gold flash
    function setVal(el, val) {
      const next = pad(val);
      if (el.textContent !== next) {
        el.style.transition = 'none';
        el.style.color = '#F0D060';
        el.textContent = next;
        requestAnimationFrame(() => {
          el.style.transition = 'color 0.5s';
          el.style.color = '';
        });
      }
    }
    setVal(hEl, h);
    setVal(mEl, m);
    setVal(sEl, s);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ─────────────────────────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    }),
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────────
   7. HERO PARTICLE SYSTEM
───────────────────────────────────────────────── */
(function initHeroParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 32; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      width:  `${Math.random() * 2.5 + 0.8}px`,
      height: `${Math.random() * 2.5 + 0.8}px`,
      left:   `${Math.random() * 100}%`,
      top:    `${Math.random() * 100}%`,
      '--dur':         `${(Math.random() * 8 + 5).toFixed(1)}s`,
      '--delay':       `${(Math.random() * 8).toFixed(1)}s`,
      '--dir':         `${Math.random() > 0.5 ? 1 : -1}`,
      '--max-opacity': `${(Math.random() * 0.25 + 0.08).toFixed(2)}`,
    });
    container.appendChild(p);
  }
})();


/* ─────────────────────────────────────────────────
   8. SUMMONS PARTICLE SYSTEM
───────────────────────────────────────────────── */
(function initSummonParticles() {
  const container = document.getElementById('summonParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      width:  `${Math.random() * 2 + 0.6}px`,
      height: `${Math.random() * 2 + 0.6}px`,
      left:   `${Math.random() * 100}%`,
      top:    `${Math.random() * 100}%`,
      '--dur':         `${(Math.random() * 10 + 6).toFixed(1)}s`,
      '--delay':       `${(Math.random() * 10).toFixed(1)}s`,
      '--dir':         '-1',
      '--max-opacity': `${(Math.random() * 0.18 + 0.06).toFixed(2)}`,
    });
    container.appendChild(p);
  }
})();


/* ─────────────────────────────────────────────────
   9. EMBER PARTICLES (Relic section)
───────────────────────────────────────────────── */
(function initEmbers() {
  const container = document.getElementById('embers');
  if (!container) return;

  // Inject keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes emberRise {
      0%  { opacity:0; transform:translateY(0) scale(1); }
      20% { opacity:0.85; transform:translateY(-18px) scale(1.1); }
      80% { opacity:0.35; transform:translateY(-65px) scale(0.8); }
      100%{ opacity:0;  transform:translateY(-95px) scale(0.3); }
    }`;
  document.head.appendChild(style);

  for (let i = 0; i < 16; i++) {
    const e = document.createElement('div');
    e.style.cssText = `
      position:absolute;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
      border-radius:50%;
      background:${Math.random() > 0.5 ? '#D4AF37' : '#FF5500'};
      left:${Math.random() * 100}%;
      bottom:${Math.random() * 35}%;
      opacity:0; pointer-events:none;
      animation:emberRise ${(Math.random() * 3 + 2).toFixed(1)}s
                ${(Math.random() * 5).toFixed(1)}s ease-out infinite;
    `;
    container.appendChild(e);
  }
})();


/* ─────────────────────────────────────────────────
   10. CANVAS SMOKE — hero background
───────────────────────────────────────────────── */
(function initSmokeCanvas() {
  const wrap = document.getElementById('smokeCanvas');
  if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.2;pointer-events:none;';
  wrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() { W = canvas.width = wrap.offsetWidth; H = canvas.height = wrap.offsetHeight; }

  function Puff() {
    this.reset = () => {
      this.x    = W * 0.25 + Math.random() * W * 0.5;
      this.y    = H * 0.55 + Math.random() * H * 0.25;
      this.vx   = (Math.random() - 0.5) * 0.35;
      this.vy   = -(Math.random() * 0.45 + 0.18);
      this.size = Math.random() * 90 + 50;
      this.life = 0;
      this.maxL = Math.random() * 220 + 130;
      this.hue  = Math.random() > 0.55 ? 'gold' : 'red';
    };
    this.reset();
    this.life = Math.random() * this.maxL;
  }

  function init() { particles = Array.from({ length: 11 }, () => new Puff()); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.life++;
      if (p.life > p.maxL) p.reset();
      const t     = p.life / p.maxL;
      const alpha = Math.sin(t * Math.PI) * 0.13;
      const r     = p.size * (0.3 + t * 0.7);
      const grad  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      const col   = p.hue === 'gold' ? `rgba(212,175,55,${alpha})` : `rgba(100,0,0,${alpha})`;
      grad.addColorStop(0, col);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize(); init(); draw();
})();


/* ─────────────────────────────────────────────────
   11. CREST PARALLAX on scroll
───────────────────────────────────────────────── */
(function initParallax() {
  const crest = document.getElementById('crestImg');
  if (!crest) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) crest.style.transform = `translateY(${y * -0.035}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────
   12. TIMELINE DOTS — highlight on scroll
───────────────────────────────────────────────── */
(function initTimelineDots() {
  const steps = document.querySelectorAll('.timeline-step');
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      const dot = e.target.querySelector('.step-dot');
      if (!dot) return;
      if (e.isIntersecting) {
        dot.style.borderColor = 'var(--gold)';
        dot.style.boxShadow   = '0 0 22px rgba(212,175,55,0.35)';
        dot.style.background  = 'rgba(212,175,55,0.07)';
      } else {
        dot.style.borderColor = '';
        dot.style.boxShadow   = '';
        dot.style.background  = '';
      }
    }),
    { threshold: 0.6 }
  );
  steps.forEach(s => obs.observe(s));
})();


/* ─────────────────────────────────────────────────
   13. CURSOR GOLD GLOW TRAIL (desktop only)
───────────────────────────────────────────────── */
(function initCursorGlow() {
  if (window.innerWidth < 768) return;
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────
   14. LETTER SHIMMER on hero title
───────────────────────────────────────────────── */
(function initShimmer() {
  const title = document.getElementById('heroTitle');
  if (!title) return;

  let wrapped = false;
  function ensureWrapped() {
    if (wrapped) return;
    wrapped = true;
    title.innerHTML = title.innerHTML.replace(/[A-Z]/g, c =>
      `<span class="sl">${c}</span>`
    );
  }

  function shimmer() {
    ensureWrapped();
    const letters = title.querySelectorAll('.sl');
    const pick    = letters[Math.floor(Math.random() * letters.length)];
    if (!pick) return;
    pick.style.color      = '#F0D060';
    pick.style.textShadow = '0 0 22px rgba(240,208,96,0.9)';
    pick.style.transition = 'color 0.5s, text-shadow 0.5s';
    setTimeout(() => { pick.style.color = ''; pick.style.textShadow = ''; }, 650);
  }

  setTimeout(() => setInterval(shimmer, 2400), 2800);
})();


/* ─────────────────────────────────────────────────
   15. RELIC COORDINATES — slowly drift/update
───────────────────────────────────────────────── */
(function initCoords() {
  const el = document.getElementById('relicCoords');
  if (!el) return;

  const base = { lat: 9.0582, lon: 76.5921 };

  setInterval(() => {
    // Tiny random drift — looks like live GPS
    const lat = (base.lat + (Math.random() - 0.5) * 0.0002).toFixed(4);
    const lon = (base.lon + (Math.random() - 0.5) * 0.0002).toFixed(4);
    const latD = Math.floor(lat);
    const latM = Math.floor((lat - latD) * 60);
    const latS = (((lat - latD) * 60 - latM) * 60).toFixed(0);
    const lonD = Math.floor(lon);
    const lonM = Math.floor((lon - lonD) * 60);
    const lonS = (((lon - lonD) * 60 - lonM) * 60).toFixed(0);
    el.textContent = `${latD}°${latM}′${latS}″N  ${lonD}°${lonM}′${lonS}″E`;
  }, 3200);
})();


/* ─────────────────────────────────────────────────
   16. WAITLIST FORM SUBMISSION
───────────────────────────────────────────────── */
function handleSubmit(event) {
  event.preventDefault();
  const formWrap    = document.getElementById('formWrap');
  const successState = document.getElementById('successState');
  const emailInput  = document.getElementById('emailInput');
  const sealBtn     = document.getElementById('sealBtn');
  const email       = emailInput.value.trim();
  if (!email) return;

  const btnText = sealBtn.querySelector('.btn-text');
  if (btnText) btnText.textContent = '…';
  sealBtn.disabled = true;

  setTimeout(() => {
    formWrap.style.transition = 'opacity 0.5s, transform 0.5s';
    formWrap.style.opacity    = '0';
    formWrap.style.transform  = 'translateY(-10px)';
    setTimeout(() => {
      formWrap.style.display   = 'none';
      successState.style.display = 'block';
      successState.style.opacity = '0';
      requestAnimationFrame(() => {
        successState.style.transition = 'opacity 0.7s ease';
        successState.style.opacity    = '1';
      });
    }, 520);
  }, 700);
}
