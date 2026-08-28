/**
 * ══════════════════════════════════════════════════════════════════════════
 * LETTER PHYSICS ENGINE
 * ══════════════════════════════════════════════════════════════════════════
 * Turns hero name & title letters into reactive, physical rigid-bodies.
 * • Mouse cursor collision imparts real physical impulse and angular spin
 * • Letter-to-Letter rigid body collision with momentum transfer (Toggleable, default: OFF)
 * • Boundary bounces off screen edges
 * • Elastic regrouping (Hooke's law) back to typography position
 * • Independent toggles for Scatter & Letter-to-Letter collisions
 */

let letterPhysicsInstance = null;

export function initLetterPhysics() {
  const letterEls = document.querySelectorAll('.hero-name .letter:not(.space), .hero-title .letter:not(.space)');
  if (!letterEls.length) return null;

  if (letterPhysicsInstance) {
    letterPhysicsInstance.destroy();
  }

  let isScatterEnabled = true;       // Mouse scattering (default ON)
  let isCollisionEnabled = false;     // Letter-to-letter collision (default OFF)

  const letters = [];
  const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 };
  let animId = null;

  // Initialize rigid bodies for each letter
  letterEls.forEach((el, index) => {
    el.style.position = 'relative';
    el.style.display = 'inline-block';
    el.style.willChange = 'transform';
    el.style.cursor = 'pointer';

    letters.push({
      el,
      index,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
      mass: 0.9 + (index % 3) * 0.2,
      restitution: 0.78,         // Boundary bounce restitution
      isScattered: false,
      scatterTimer: 0,
      returnDelay: 105 + (index % 6) * 8, // ~1.8s flight time
      springK: 0.054,
      springDamp: 0.88,
    });
  });

  // Track mouse coordinates & velocity
  function onMouseMove(e) {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.vx = mouse.x - mouse.px;
    mouse.vy = mouse.y - mouse.py;
  }

  function onTouchMove(e) {
    if (!e.touches.length) return;
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    mouse.vx = mouse.x - mouse.px;
    mouse.vy = mouse.y - mouse.py;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Direct click / tap scatter impulse
  function onPointerDown(e) {
    if (!isScatterEnabled) return;
    letters.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const dist = Math.hypot(dx, dy);

      if (dist < 130) {
        const force = ((1 - dist / 130) ** 1.1) * 26;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
        item.vx += Math.cos(angle) * (force / item.mass);
        item.vy += Math.sin(angle) * (force / item.mass);
        item.vrot += (Math.random() - 0.5) * 40;
        item.isScattered = true;
        item.scatterTimer = 0;
        item.el.classList.add('is-scattered');
      }
    });
  }

  window.addEventListener('pointerdown', onPointerDown);

  // Main physics simulation loop
  function updatePhysics() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const mSpeed = Math.hypot(mouse.vx, mouse.vy);
    const count = letters.length;

    // ── 1. Mouse Collision & Integration ─────────────────────────────
    for (let i = 0; i < count; i++) {
      const item = letters[i];
      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Mouse collision only when scattering is enabled
      if (isScatterEnabled) {
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const hitRadius = Math.max(rect.width, rect.height) * 0.95 + Math.min(mSpeed * 0.3, 22);

        if (dist < hitRadius && dist > 0.001) {
          const nx = dx / dist;
          const ny = dy / dist;
          const hitForce = (1 - dist / hitRadius) * (14 + Math.min(mSpeed * 0.6, 18));

          item.vx += nx * (hitForce / item.mass) + (mouse.vx * 0.35) / item.mass;
          item.vy += ny * (hitForce / item.mass) + (mouse.vy * 0.35) / item.mass;
          item.vrot += ((Math.random() - 0.5) * 22 + (mouse.vx - mouse.vy) * 0.35) / item.mass;

          item.isScattered = true;
          item.scatterTimer = 0;
          item.el.classList.add('is-scattered');
        }
      }

      // Physics dynamics
      if (item.isScattered) {
        item.scatterTimer++;

        // Free flight or regrouping
        if (isScatterEnabled && item.scatterTimer < item.returnDelay) {
          // Free Flight Phase: air resistance & screen bounces
          item.vx *= 0.982;
          item.vy *= 0.982;
          item.vrot *= 0.975;

          // Boundary Bounces
          const pad = 24;
          if (cx < pad && item.vx < 0) {
            item.vx = -item.vx * item.restitution;
            item.vrot = -item.vrot * 0.8;
          } else if (cx > W - pad && item.vx > 0) {
            item.vx = -item.vx * item.restitution;
            item.vrot = -item.vrot * 0.8;
          }

          if (cy < pad && item.vy < 0) {
            item.vy = -item.vy * item.restitution;
            item.vrot = -item.vrot * 0.8;
          } else if (cy > H - pad && item.vy > 0) {
            item.vy = -item.vy * item.restitution;
            item.vrot = -item.vrot * 0.8;
          }
        } else {
          // Regrouping Phase: Spring pulls letter back to equilibrium (0,0)
          const k = isScatterEnabled ? item.springK : item.springK * 1.6;
          const damp = isScatterEnabled ? item.springDamp : 0.82;

          item.vx += -item.x * k;
          item.vy += -item.y * k;
          item.vrot += -item.rot * (k * 1.4);

          item.vx *= damp;
          item.vy *= damp;
          item.vrot *= damp;

          if (
            Math.abs(item.x) < 0.25 &&
            Math.abs(item.y) < 0.25 &&
            Math.abs(item.vx) < 0.15 &&
            Math.abs(item.vy) < 0.15 &&
            Math.abs(item.rot) < 0.3
          ) {
            item.x = 0;
            item.y = 0;
            item.vx = 0;
            item.vy = 0;
            item.rot = 0;
            item.vrot = 0;
            item.isScattered = false;
            item.el.classList.remove('is-scattered');
          }
        }

        item.x += item.vx;
        item.y += item.vy;
        item.rot += item.vrot;

        item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0) rotate(${item.rot.toFixed(2)}deg)`;
      } else {
        if (item.el.style.transform !== '') {
          item.el.style.transform = '';
        }
      }
    }

    // ── 2. Letter-to-Letter Elastic Rigid Body Collisions ─────────────
    if (isScatterEnabled && isCollisionEnabled) {
      for (let i = 0; i < count; i++) {
        const a = letters[i];
        const rectA = a.el.getBoundingClientRect();
        const radA = Math.max(rectA.width, rectA.height) * 0.44;
        const cxA = rectA.left + rectA.width / 2;
        const cyA = rectA.top + rectA.height / 2;

        for (let j = i + 1; j < count; j++) {
          const b = letters[j];

          // Skip if neither is moving or scattered
          if (!a.isScattered && !b.isScattered && Math.hypot(a.vx, a.vy) < 0.1 && Math.hypot(b.vx, b.vy) < 0.1) {
            continue;
          }

          const rectB = b.el.getBoundingClientRect();
          const radB = Math.max(rectB.width, rectB.height) * 0.44;
          const cxB = rectB.left + rectB.width / 2;
          const cyB = rectB.top + rectB.height / 2;

          const dx = cxB - cxA;
          const dy = cyB - cyA;
          const dist = Math.hypot(dx, dy);
          const minDist = radA + radB;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) * 0.5;

            // Separate overlapping bodies
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Calculate impulse along normal vector
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal < 0) {
              const restitution = 0.85;
              const impulseMag = -(1 + restitution) * velAlongNormal / (1 / a.mass + 1 / b.mass);
              const impX = impulseMag * nx;
              const impY = impulseMag * ny;

              a.vx -= impX / a.mass;
              a.vy -= impY / a.mass;
              b.vx += impX / b.mass;
              b.vy += impY / b.mass;

              // Exchange angular velocity / spin
              const spinExchange = (Math.random() - 0.5) * 16;
              a.vrot += spinExchange / a.mass;
              b.vrot -= spinExchange / b.mass;

              // Knock stationary letters into scattered momentum
              a.isScattered = true;
              a.scatterTimer = 0;
              a.el.classList.add('is-scattered');

              b.isScattered = true;
              b.scatterTimer = 0;
              b.el.classList.add('is-scattered');
            }
          }
        }
      }
    }

    animId = requestAnimationFrame(updatePhysics);
  }

  animId = requestAnimationFrame(updatePhysics);

  const api = {
    setScatterEnabled(val) {
      isScatterEnabled = !!val;
      if (!isScatterEnabled) {
        // Trigger fast return for any currently floating letters
        letters.forEach((item) => {
          if (item.isScattered) {
            item.scatterTimer = item.returnDelay + 1;
          }
        });
      }
      return isScatterEnabled;
    },
    toggleScatter() {
      return this.setScatterEnabled(!isScatterEnabled);
    },
    isScatterEnabled() {
      return isScatterEnabled;
    },

    setCollisionEnabled(val) {
      isCollisionEnabled = !!val;
      return isCollisionEnabled;
    },
    toggleCollision() {
      return this.setCollisionEnabled(!isCollisionEnabled);
    },
    isCollisionEnabled() {
      return isCollisionEnabled;
    },

    destroy() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerdown', onPointerDown);
      letterPhysicsInstance = null;
    },
  };

  letterPhysicsInstance = api;
  return api;
}

export function getLetterPhysics() {
  return letterPhysicsInstance;
}
