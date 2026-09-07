import Lenis from 'lenis';
import { CONFIG } from './config.js';
import { use3D, isMobile } from './utils/device.js';
import { initLoader } from './animations/loader.js';
import { initCursor } from './animations/cursor.js';
import { initMagnetic } from './animations/magnetic.js';
import { initLetterPhysics } from './animations/letterPhysics.js';
import { initScrollAnimations } from './animations/scrollAnimations.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initEducation } from './sections/education.js';
import { initProjects } from './sections/projects.js';
import { initExperience } from './sections/experience.js';
import { initSkills } from './sections/skills.js';
import { initContact } from './sections/contact.js';
import './style.css';

// ── Apply theme CSS variables from config ────────────────────────────────────
const root = document.documentElement;
root.style.setProperty('--accent',      CONFIG.theme.accent);
root.style.setProperty('--accent-glow', CONFIG.theme.accentGlow);
root.style.setProperty('--bg',          CONFIG.theme.bg);
root.style.setProperty('--bg-alt',      CONFIG.theme.bgAlt);

// ── Lenis smooth scroll ──────────────────────────────────────────────────────
const lenis = new Lenis({
  lerp:      0.08,
  smoothWheel: true,
  direction: 'vertical',
});

// ── Build all section DOM (before loader exits) ──────────────────────────────
function buildSections() {
  initHero();
  initAbout();
  initEducation();
  initProjects();
  initExperience();
  initSkills();
  initContact();
}

// ── Main initialisation ──────────────────────────────────────────────────────
async function init() {
  buildSections();

  initLoader(async () => {
    // Custom cursor (desktop only)
    if (!isMobile) initCursor();

    // Magnetic hover effects
    initMagnetic();

    // All GSAP ScrollTrigger animations (also wires Lenis ↔ GSAP)
    initScrollAnimations(lenis);

    let letterPhysics = null;
    let heroScene = null;

    // Interactive rigid-body physics for hero name & title letters
    setTimeout(() => {
      letterPhysics = initLetterPhysics();
    }, 1200);

    // Lazy-load hero scene after loader exits
    if (use3D) {
      const canvas = document.getElementById('hero-canvas');
      if (canvas) {
        const { HeroScene } = await import('./three/HeroScene.js');
        heroScene = new HeroScene(canvas);
        canvas.classList.add('is-active');
      }
    } else {
      // Activate the CSS blob fallback
      document.getElementById('hero-canvas')?.remove();
      document.querySelector('.hero-blob')?.classList.add('is-active');
    }

    // ── Wire up physics toggle buttons ─────────────────────────────────────────
    const toggleLettersBtn = document.getElementById('toggle-letters-btn');
    const toggleCollideBtn = document.getElementById('toggle-collide-btn');
    const toggleBgBtn      = document.getElementById('toggle-bg-btn');

    if (toggleLettersBtn) {
      toggleLettersBtn.addEventListener('click', () => {
        if (!letterPhysics) letterPhysics = initLetterPhysics();
        const active = letterPhysics.toggleScatter();
        toggleLettersBtn.classList.toggle('is-active', active);
        toggleLettersBtn.setAttribute('aria-pressed', String(active));
      });
    }

    if (toggleCollideBtn) {
      toggleCollideBtn.addEventListener('click', () => {
        if (!letterPhysics) letterPhysics = initLetterPhysics();
        const active = letterPhysics.toggleCollision();
        toggleCollideBtn.classList.toggle('is-active', active);
        toggleCollideBtn.setAttribute('aria-pressed', String(active));
      });
    }

    if (toggleBgBtn) {
      toggleBgBtn.addEventListener('click', () => {
        if (heroScene) {
          const active = heroScene.toggleInteractive();
          toggleBgBtn.classList.toggle('is-active', active);
          toggleBgBtn.setAttribute('aria-pressed', String(active));
        }
      });
    }
  });

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  function closeMobileNav() {
    if (!hamburger || !navLinks) return;
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    document.body.classList.remove('nav-is-open');
    lenis.start();
  }

  function openMobileNav() {
    if (!hamburger || !navLinks) return;
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-open');
    document.body.classList.add('nav-is-open');
    lenis.stop();
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // ── Smooth-scroll anchor links via Lenis ──────────────────────────────────
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    }
  });
}

init();
