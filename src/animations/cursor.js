import gsap from 'gsap';

/**
 * Custom magnetic cursor.
 * • Small dot follows the mouse exactly.
 * • Larger ring follows with lag (quickSetter for perf).
 * • Morphs on hoverable elements.
 * Skipped entirely on touch devices.
 */
export function initCursor() {
  if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) {
    document.body.classList.add('touch-device');
    return;
  }

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-custom-cursor');

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  const setDot = {
    x: gsap.quickSetter(dot,  'x', 'px'),
    y: gsap.quickSetter(dot,  'y', 'px'),
  };

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    setDot.x(mx);
    setDot.y(my);
  });

  // Laggy ring via ticker
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Hover state helper
  function bind(el) {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';

    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  }

  // Bind to existing interactable elements
  document.querySelectorAll('a, button, .project-card, .skill-tag, [data-cursor]').forEach(bind);

  // Bind to dynamically added elements
  const observer = new MutationObserver(() => {
    document.querySelectorAll('a, button, .project-card, .skill-tag, [data-cursor]').forEach(bind);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 }));
}
