import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/device.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wire up all GSAP ScrollTrigger animations.
 * Called after the loader exits and sections are in the DOM.
 * @param {import('lenis').default} lenis
 */
export function initScrollAnimations(lenis) {
  // ── Connect Lenis to GSAP ────────────────────────────────────────────────
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Reduced-motion fallback ──────────────────────────────────────────────
  if (prefersReducedMotion) {
    gsap.utils.toArray('.reveal, .reveal-fade, .reveal-left, .reveal-scale').forEach((el) => {
      gsap.set(el, { opacity: 1, clearProps: 'transform' });
    });
    _initNavScroll();
    _initSkillBars();
    return;
  }

  _initNavScroll();
  _initHeroAnimations();
  _initSectionReveals();
  _initEducationTimeline();
  _initProjectsGallery();
  _initCardTilt();
  _initSkillBars();
  _initScrollIndicator();
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav scroll state
// ─────────────────────────────────────────────────────────────────────────────
function _initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (st) => nav.classList.toggle('nav--scrolled', st.scroll() > 60),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero stagger entrance
// ─────────────────────────────────────────────────────────────────────────────
function _initHeroAnimations() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const nameLetters  = gsap.utils.toArray('.hero-name .letter');
  const titleLetters = gsap.utils.toArray('.hero-title .letter');
  const ctas   = document.querySelector('.hero-ctas');
  const scroll = document.querySelector('.hero-scroll');

  const tl = gsap.timeline({ delay: 0.15 });

  if (eyebrow) {
    tl.fromTo(eyebrow,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );
  }

  if (nameLetters.length) {
    tl.fromTo(nameLetters,
      { opacity: 0, y: 70, rotateX: -35 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.032, duration: 0.9, ease: 'power3.out' },
      eyebrow ? '-=0.45' : 0
    );
  }

  if (titleLetters.length) {
    tl.fromTo(titleLetters,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.018, duration: 0.65, ease: 'power2.out' },
      '-=0.55'
    );
  }

  if (ctas) {
    tl.fromTo(ctas,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.35'
    );
  }

  if (scroll) {
    tl.fromTo(scroll,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }

  // Hero parallax on scroll-out
  gsap.to('.hero-content', {
    y: '25vh',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Canvas parallax (slower)
  gsap.to('#hero-canvas, .hero-blob', {
    y: '15vh',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic section reveals
// ─────────────────────────────────────────────────────────────────────────────
function _initSectionReveals() {
  // Section labels
  gsap.utils.toArray('.section-label').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Generic fade elements
  gsap.utils.toArray('.reveal-fade, .reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      }
    );
  });

  // Left slide
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Scale in
  gsap.utils.toArray('.reveal-scale').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      }
    );
  });

  // About tagline word-by-word
  const tagline = document.querySelector('.about-tagline');
  if (tagline) {
    const words = tagline.querySelectorAll('.word');
    if (words.length) {
      gsap.fromTo(words,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: tagline, start: 'top 82%' },
        }
      );
    } else {
      gsap.fromTo(tagline,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: tagline, start: 'top 82%' },
        }
      );
    }
  }

  // Exp cards stagger
  gsap.utils.toArray('.exp-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Education timeline — SVG line draw + node reveals
// ─────────────────────────────────────────────────────────────────────────────
function _initEducationTimeline() {
  const line = document.querySelector('.timeline-svg-line');
  if (line) {
    const len = line.getTotalLength?.() || 800;
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(line, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: 0.8,
      },
    });
  }

  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.edu-card');
    const dot  = item.querySelector('.timeline-dot');
    const tags = item.querySelectorAll('.edu-tag');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 86%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(item,
      { opacity: 0, y: 45, rotateX: 10, scale: 0.96 },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
    );

    if (dot) {
      tl.fromTo(dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
        '-=0.6'
      );
    }

    if (tags.length) {
      tl.fromTo(tags,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: 'power2.out' },
        '-=0.4'
      );
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects — horizontal scroll on desktop
// ─────────────────────────────────────────────────────────────────────────────
function _initProjectsGallery() {
  const section = document.getElementById('projects');
  const track   = document.querySelector('.projects-track');
  if (!section || !track) return;

  const cards = track.querySelectorAll('.project-card');

  // Reveal cards
  gsap.fromTo(cards,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%' },
    }
  );

  // Horizontal scroll only on wide viewports
  if (window.innerWidth < 900) return;

  const gap         = 28;  // px, matches CSS gap
  const cardW       = 400; // px, matches CSS width
  const totalW      = cards.length * (cardW + gap) - gap;
  const scrollDist  = Math.max(0, totalW - window.innerWidth + 80);

  if (scrollDist < 1) return;

  gsap.to(track, {
    x: -scrollDist,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end:   () => `+=${scrollDist}`,
      scrub: 1,
      pin:   true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Project card 3-D tilt
// ─────────────────────────────────────────────────────────────────────────────
function _initCardTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;

      gsap.to(card, {
        rotateY:            x * 16,
        rotateX:           -y * 10,
        transformPerspective: 900,
        transformOrigin:   'center center',
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated skill bars
// ─────────────────────────────────────────────────────────────────────────────
function _initSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
    const level = bar.dataset.level || '0';
    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll indicator bounce
// ─────────────────────────────────────────────────────────────────────────────
function _initScrollIndicator() {
  const thumb = document.querySelector('.scroll-thumb');
  if (!thumb) return;
  gsap.to(thumb, {
    y: 14,
    repeat: -1,
    yoyo: true,
    duration: 1.1,
    ease: 'sine.inOut',
  });
}
