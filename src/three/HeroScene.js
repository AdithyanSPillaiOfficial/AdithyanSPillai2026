import { CONFIG } from '../config.js';

/* ── Helpers ────────────────────────────────────────────────────────────── */

/** Minimum distance from point P to line segment AB */
function ptSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 < 0.001) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Closest point on line segment AB to point P */
function closestOnSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 < 0.001) return { x: ax, y: ay };
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  return { x: ax + t * dx, y: ay + t * dy };
}

/** Hex accent -> { h, s, l } */
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 215, s: 85, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? ((g - b) / d + (g < b ? 6 : 0))
        : max === g ? ((b - r) / d + 2)
                    : ((r - g) / d + 4);
  return { h: h * 60, s: s * 100, l: l * 100 };
}

/* ══════════════════════════════════════════════════════════════════════════
   FREELY MOVING KINETIC NETWORK
   ══════════════════════════════════════════════════════════════════════════
   • Constantly drifting, living constellation across the full screen
   • Dynamic proximity connections that form and dissolve smoothly in real time
   • Pointed, razor-sharp collision radius (point-precision interaction)
   • Free, unconstrained momentum: particles scatter with velocity and glide
     freely across the screen without being pinned down
   • When the pointer strikes a line, it slices through, repelling the nodes
   • Micro-pulses / data signals travel across dynamic connections
*/
export class HeroScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    /* Tunable Physics & Behaviour */
    this.LINK_DIST = 145;        // Proximity threshold for dynamic connections
    this.LINK_DIST_SQ = this.LINK_DIST * this.LINK_DIST;
    this.POINT_RADIUS = 32;      // Crisp, sharp collision radius (needle-point)
    this.LINE_COLLIDE_R = 24;    // Sharp line collision radius
    this.DRAG = 0.982;           // Low air resistance for free, long gliding
    this.BASE_SPEED = 0.55;      // Normal ambient drift speed
    this.SCATTER_POWER = 14;     // Impact impulse on direct hit
    this.MAX_VELOCITY = 22;      // Top velocity limit to prevent tunneling

    /* State */
    this.isEnabled = true;
    this.isInteractive = true;
    this.particles = [];
    this.pulses = [];            // Moving data sparks along live links
    this.mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 };
    this.animId = null;
    this.time = 0;

    const { h, s, l } = hexToHsl(CONFIG.theme.accent);
    this.AH = h;
    this.AS = s;
    this.AL = l;

    this._bound = {
      move: this._onMove.bind(this),
      resize: this._onResize.bind(this),
      touch: this._onTouch.bind(this),
    };

    this._init();
    this._addListeners();
    this._animate();
  }

  _init() {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;

    // Density adapted to screen area for balanced visual flow
    const area = this.W * this.H;
    const count = Math.min(160, Math.max(55, Math.floor(area / 9500)));

    this.particles = Array.from({ length: count }, () => this._createParticle());
    this.pulses = [];
  }

  _createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = this.BASE_SPEED * (0.6 + Math.random() * 0.8);
    const isMajor = Math.random() < 0.15; // 15% anchor/major nodes

    return {
      x: x ?? Math.random() * this.W,
      y: y ?? Math.random() * this.H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      baseVx: Math.cos(angle) * speed,
      baseVy: Math.sin(angle) * speed,
      radius: isMajor ? 2.8 + Math.random() * 1.2 : 1.4 + Math.random() * 1.0,
      mass: isMajor ? 1.6 : 0.85 + Math.random() * 0.3,
      isMajor,
      hueOffset: (Math.random() - 0.5) * 30,
      pulseTimer: Math.random() * 100,
    };
  }

  _updatePhysics() {
    this.time++;

    // Pointed mouse velocity
    this.mouse.vx = this.mouse.x - this.mouse.px;
    this.mouse.vy = this.mouse.y - this.mouse.py;
    this.mouse.px = this.mouse.x;
    this.mouse.py = this.mouse.y;

    const mSpeed = Math.hypot(this.mouse.vx, this.mouse.vy);
    const hitRadius = this.POINT_RADIUS + Math.min(mSpeed * 0.4, 18);
    const hitPower = this.SCATTER_POWER + Math.min(mSpeed * 0.8, 16);

    const pts = this.particles;
    const pCount = pts.length;

    // 1. Move particles, handle sharp mouse collision and screen bounds
    for (let i = 0; i < pCount; i++) {
      const p = pts[i];

      // Point-precision mouse collision (when interactive)
      if (this.isInteractive) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < hitRadius && dist > 0.001) {
          // Sharp elastic impulse radiating outward from cursor tip
          const force = ((1 - dist / hitRadius) ** 1.2) * (hitPower / p.mass);
          const nx = dx / dist;
          const ny = dy / dist;

          p.vx += nx * force + (this.mouse.vx * 0.25) / p.mass;
          p.vy += ny * force + (this.mouse.vy * 0.25) / p.mass;
        }
      }

      // Gentle organic steering so particles drift freely and naturally
      const angleJitter = (Math.sin(this.time * 0.015 + i * 1.7) * 0.04) / p.mass;
      const cosA = Math.cos(angleJitter);
      const sinA = Math.sin(angleJitter);
      const curVx = p.vx * cosA - p.vy * sinA;
      const curVy = p.vx * sinA + p.vy * cosA;
      p.vx = curVx;
      p.vy = curVy;

      // Air resistance (damping)
      p.vx *= this.DRAG;
      p.vy *= this.DRAG;

      // Ensure a subtle minimum ambient cruising drift
      const currentSpeed = Math.hypot(p.vx, p.vy);
      if (currentSpeed < this.BASE_SPEED * 0.5) {
        p.vx += p.baseVx * 0.04;
        p.vy += p.baseVy * 0.04;
      }

      // Cap speed
      if (currentSpeed > this.MAX_VELOCITY) {
        const factor = this.MAX_VELOCITY / currentSpeed;
        p.vx *= factor;
        p.vy *= factor;
      }

      // Integrate position
      p.x += p.vx;
      p.y += p.vy;

      // Seamless screen wrapping with soft margins
      const pad = 24;
      if (p.x < -pad) p.x = this.W + pad;
      else if (p.x > this.W + pad) p.x = -pad;

      if (p.y < -pad) p.y = this.H + pad;
      else if (p.y > this.H + pad) p.y = -pad;
    }

    // 2. Pointed Line Collision & Dynamic Connections
    const activePairs = [];
    const lineR = this.LINE_COLLIDE_R + Math.min(mSpeed * 0.3, 12);
    const linePower = (hitPower * 0.45);

    for (let i = 0; i < pCount; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pCount; j++) {
        const b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < this.LINK_DIST_SQ) {
          const dist = Math.sqrt(d2);
          activePairs.push({ a, b, dist });

          // Check if cursor point cuts through this connection line (when interactive)
          if (this.isInteractive && this.mouse.x > 0 && this.mouse.y > 0) {
            const lineDist = ptSegDist(this.mouse.x, this.mouse.y, a.x, a.y, b.x, b.y);
            if (lineDist < lineR) {
              const cp = closestOnSeg(this.mouse.x, this.mouse.y, a.x, a.y, b.x, b.y);
              const cutForce = ((1 - lineDist / lineR) ** 1.3) * linePower;

              // Scatter endpoints away from impact point
              const pushA = Math.hypot(a.x - cp.x, a.y - cp.y) || 1;
              const pushB = Math.hypot(b.x - cp.x, b.y - cp.y) || 1;

              a.vx += ((a.x - cp.x) / pushA) * (cutForce / a.mass);
              a.vy += ((a.y - cp.y) / pushA) * (cutForce / a.mass);
              b.vx += ((b.x - cp.x) / pushB) * (cutForce / b.mass);
              b.vy += ((b.y - cp.y) / pushB) * (cutForce / b.mass);
            }
          }
        }
      }
    }

    this.activePairs = activePairs;

    // 3. Ambient Signal Pulses traveling along lines
    if (activePairs.length > 0 && Math.random() < 0.06 && this.pulses.length < 25) {
      const pair = activePairs[Math.floor(Math.random() * activePairs.length)];
      this.pulses.push({
        a: pair.a,
        b: pair.b,
        progress: 0,
        speed: 0.018 + Math.random() * 0.024,
      });
    }

    for (let k = this.pulses.length - 1; k >= 0; k--) {
      const pulse = this.pulses[k];
      pulse.progress += pulse.speed;

      // Remove pulse if distance stretched too far or complete
      const d = Math.hypot(pulse.a.x - pulse.b.x, pulse.a.y - pulse.b.y);
      if (pulse.progress >= 1 || d > this.LINK_DIST * 1.3) {
        this.pulses.splice(k, 1);
      }
    }
  }

  _draw() {
    const { ctx, W, H, particles, activePairs, pulses, AH, AS, AL } = this;

    ctx.clearRect(0, 0, W, H);
    if (!this.isEnabled) return;

    // ── 1. Draw dynamic connection lines ───────────────────────────
    for (let i = 0; i < activePairs.length; i++) {
      const { a, b, dist } = activePairs[i];
      const proximity = 1 - dist / this.LINK_DIST;

      // Higher relative velocity creates a brighter energetic tension line
      const relSpeed = Math.hypot(a.vx - b.vx, a.vy - b.vy);
      const excitement = Math.min(relSpeed * 0.12, 0.4);

      const alpha = (proximity * 0.42 + excitement) * 0.85;
      const hue = AH + (1 - proximity) * 20;
      const light = AL + excitement * 25;
      const width = Math.max(0.5, proximity * 1.4 + excitement * 0.8);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `hsla(${hue}, ${AS}%, ${light}%, ${alpha.toFixed(3)})`;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // ── 2. Draw micro data pulses ──────────────────────────────────
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let k = 0; k < pulses.length; k++) {
      const { a, b, progress } = pulses[k];
      const px = a.x + (b.x - a.x) * progress;
      const py = a.y + (b.y - a.y) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${AH + 40}, 100%, 85%, 0.85)`;
      ctx.fill();
    }

    // ── 3. Draw moving nodes with glowing kinetic halos ────────────
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const speed = Math.hypot(p.vx, p.vy);
      const kinetic = Math.min(speed / 6, 1); // 0 = calm drift, 1 = high speed scatter

      const h = AH + p.hueOffset + kinetic * 35;
      const s = Math.min(100, AS + kinetic * 20);
      const l = Math.min(95, AL + kinetic * 30);
      const r = p.radius * (1 + kinetic * 0.8);

      // Radial glow aura (expands when scattered at high speed)
      const glowR = r * (p.isMajor ? 4.5 : 3.2) * (1 + kinetic * 1.5);
      const glowAlpha = (p.isMajor ? 0.45 : 0.25) + kinetic * 0.45;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      grad.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(l + 15, 96)}%, ${glowAlpha.toFixed(3)})`);
      grad.addColorStop(0.35, `hsla(${h}, ${s}%, ${l}%, ${(glowAlpha * 0.4).toFixed(3)})`);
      grad.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Sharp bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${h}, ${s}%, ${Math.min(l + 25, 98)}%, ${p.isMajor ? 0.95 : 0.85})`;
      ctx.fill();
    }

    ctx.restore();
  }

  _animate() {
    this.animId = requestAnimationFrame(this._animate.bind(this));
    this._updatePhysics();
    this._draw();
  }

  _onMove(e) {
    this.mouse.px = this.mouse.x;
    this.mouse.py = this.mouse.y;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  _onTouch(e) {
    if (e.touches.length === 0) return;
    this.mouse.px = this.mouse.x;
    this.mouse.py = this.mouse.y;
    this.mouse.x = e.touches[0].clientX;
    this.mouse.y = e.touches[0].clientY;
  }

  _onResize() {
    this._init();
  }

  _addListeners() {
    window.addEventListener('mousemove', this._bound.move, { passive: true });
    window.addEventListener('resize', this._bound.resize, { passive: true });
    window.addEventListener('touchmove', this._bound.touch, { passive: true });
  }

  setInteractive(val) {
    this.isInteractive = !!val;
    return this.isInteractive;
  }

  setEnabled(val) {
    this.isEnabled = !!val;
    if (!this.isEnabled) {
      this.ctx.clearRect(0, 0, this.W, this.H);
    }
    return this.isEnabled;
  }

  toggleInteractive() {
    return this.setInteractive(!this.isInteractive);
  }

  toggleEnabled() {
    return this.setEnabled(!this.isEnabled);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('mousemove', this._bound.move);
    window.removeEventListener('resize', this._bound.resize);
    window.removeEventListener('touchmove', this._bound.touch);
  }
}
