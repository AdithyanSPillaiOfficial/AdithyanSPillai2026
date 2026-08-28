import gsap from 'gsap';

/**
 * Magnetic hover effect.
 * Elements with class `.magnetic` are pulled toward the cursor.
 * Strength can be tuned via `data-strength="0.4"` attribute.
 */
export function initMagnetic() {
  // Skip on touch / mobile
  if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) return;

  function bind(el) {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';

    const strength = parseFloat(el.dataset.strength) || 0.28;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  }

  document.querySelectorAll('.magnetic').forEach(bind);

  // Observe dynamically inserted elements
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.magnetic').forEach(bind);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
