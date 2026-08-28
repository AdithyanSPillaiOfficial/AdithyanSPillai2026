import { CONFIG } from '../config.js';
import { splitLetters } from '../utils/helpers.js';

/**
 * Hero section — populates name / title letters for GSAP stagger.
 * The Three.js canvas and CSS blob fallback live directly in index.html.
 */
export function initHero() {
  const nameEl  = document.querySelector('.hero-name');
  const titleEl = document.querySelector('.hero-title');

  if (nameEl) {
    nameEl.setAttribute('aria-label', CONFIG.personal.name);
    nameEl.innerHTML = splitLetters(CONFIG.personal.name);
  }

  if (titleEl) {
    titleEl.setAttribute('aria-label', CONFIG.personal.title);
    titleEl.innerHTML = splitLetters(CONFIG.personal.title);
  }
}
