import { CONFIG } from '../config.js';

/**
 * Experience & Workshops section — staggered card grid.
 */
export function initExperience() {
  const section = document.getElementById('experience');
  if (!section) return;

  function briefcaseIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>`;
  }

  function bookIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
    </svg>`;
  }

  const expCards = CONFIG.experience.map((e) => `
    <div class="exp-card glass-card">
      <div class="exp-icon">${briefcaseIcon()}</div>
      <div class="exp-body">
        <span class="exp-year">${e.year}</span>
        <h3 class="exp-title">${e.title}</h3>
        <p class="exp-company">${e.company} &nbsp;·&nbsp; ${e.location}</p>
        <p class="exp-desc">${e.description}</p>
      </div>
    </div>
  `).join('');

  const wsCards = CONFIG.workshops.map((w) => `
    <div class="exp-card glass-card">
      <div class="exp-icon">${bookIcon()}</div>
      <div class="exp-body">
        <span class="exp-year">${w.year}</span>
        <h3 class="exp-title">${w.title}</h3>
        <p class="exp-company">${w.organizer}</p>
        <p class="exp-desc">${w.description}</p>
      </div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <span class="section-label">05 / Experience</span>
      <h2 class="section-title">Experience &amp; Learning</h2>

      <div class="exp-columns">
        <div>
          <h3 class="exp-group-label">Internship</h3>
          ${expCards}
        </div>
        <div>
          <h3 class="exp-group-label">Workshops</h3>
          ${wsCards}
        </div>
      </div>
    </div>
  `;
}
