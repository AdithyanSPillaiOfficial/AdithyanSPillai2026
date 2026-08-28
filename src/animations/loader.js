import gsap from 'gsap';

/**
 * Loading screen animation.
 * 1. SVG initials stroke-draw
 * 2. Counter 0 → 100
 * 3. Blue curtain sweeps up from bottom to fully cover viewport
 * 4. At full cover: loader background turns transparent & hero unlocks
 * 5. Blue curtain smoothly sweeps off to top, unveiling hero seamlessly
 */
export function initLoader(onComplete) {
  const loader  = document.getElementById('loader');
  const counter = document.getElementById('loader-counter');
  const curtain = document.getElementById('loader-curtain');
  const svgText = document.querySelector('#loader-svg text');

  if (!loader) {
    onComplete?.();
    return;
  }

  // Ensure curtain starts fully below viewport cleanly via GSAP
  gsap.set(curtain, { yPercent: 100, transform: 'none' });

  // Prepare SVG stroke animation
  if (svgText) {
    const length = svgText.getComputedTextLength?.() || 400;
    gsap.set(svgText, {
      strokeDasharray:  length,
      strokeDashoffset: length,
    });
  }

  const tl = gsap.timeline();

  // 1. Draw initials
  tl.to(svgText, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.out',
  }, 0);

  // 2. Fill opacity
  tl.to(svgText, {
    fillOpacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, 0.8);

  // 3. Counter 0 → 100
  const obj = { val: 0 };
  tl.to(obj, {
    val: 100,
    duration: 1.7,
    ease: 'power2.inOut',
    onUpdate() {
      if (counter) counter.textContent = Math.round(obj.val);
    },
  }, 0.1);

  // Brief hold at 100%
  tl.to({}, { duration: 0.2 });

  // 4. Fade out text and counter
  tl.to(['#loader-svg', counter], {
    opacity: 0,
    scale: 0.96,
    duration: 0.35,
    ease: 'power2.in',
  });

  // 5. Blue curtain sweeps up to cover the screen
  tl.to(curtain, {
    yPercent: 0,
    duration: 0.85,
    ease: 'power3.inOut',
  }, '-=0.15');

  // 6. AT FULL COVER: Turn loader background transparent & unlock hero scene
  tl.call(() => {
    loader.style.backgroundColor = 'transparent';
    loader.style.pointerEvents = 'none';
    document.body.classList.add('loaded');
    // Start hero entrance & animations under the curtain
    onComplete?.();
  });

  // 7. Blue curtain smoothly sweeps away to the top, revealing hero underneath
  tl.to(curtain, {
    yPercent: -100,
    duration: 0.95,
    ease: 'power3.inOut',
    onComplete: () => {
      loader.style.display = 'none';
    },
  }, '+=0.04');
}
