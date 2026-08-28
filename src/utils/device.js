/**
 * Device & feature detection utilities.
 * Import these flags across the codebase to gate heavy features.
 */

/** True if the user prefers reduced motion (accessibility). */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on touch/mobile devices or narrow viewports. */
export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.innerWidth < 768;

/** True on low-end hardware (2 or fewer logical cores). */
export const isLowEnd =
  navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;

/** Check browser WebGL support. */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Gate for the hero interactive canvas scene.
 * Disabled only when reduced motion is preferred.
 */
export const use3D = !prefersReducedMotion;

