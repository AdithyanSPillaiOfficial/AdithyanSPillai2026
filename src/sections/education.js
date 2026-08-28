import { CONFIG } from '../config.js';

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const ICONS = {
  graduation: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>`,
  school: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <path d="M8 7h6M8 11h8"/>
    </svg>`,
  certificate: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>`,
};

/**
 * Education section — interactive timeline with 3D glass cards,
 * glowing laser rail, status beacons, and academic achievement chips.
 */
export function initEducation() {
  const section = document.getElementById('education');
  if (!section) return;

  const items = CONFIG.education.map((edu, i) => {
    const isCurrent = edu.status?.toLowerCase().includes('pursuing') || edu.status?.toLowerCase().includes('final');
    const iconSvg = ICONS[edu.icon] || ICONS.graduation;

    const highlightsHtml = edu.highlights?.length
      ? `<div class="edu-highlights">
           <span class="edu-highlights-title">Core Disciplines:</span>
           <div class="edu-tags">
             ${edu.highlights.map(h => `<span class="edu-tag">${h}</span>`).join('')}
           </div>
         </div>`
      : '';

    return `
      <div class="timeline-item" data-index="${i}">
        <!-- Illuminated Radar Node -->
        <div class="timeline-node">
          <div class="timeline-radar ${isCurrent ? 'is-active' : ''}"></div>
          <div class="timeline-dot ${isCurrent ? 'is-current' : ''}">
            <div class="dot-core"></div>
          </div>
        </div>

        <!-- 3D Interactive Card -->
        <div class="timeline-content edu-card glass-card" data-tilt>
          <div class="edu-watermark" aria-hidden="true">0${i + 1}</div>
          <div class="edu-card-glow" aria-hidden="true"></div>

          <div class="edu-card-header">
            <div class="edu-badge-group">
              <div class="edu-icon-badge">${iconSvg}</div>
              <div>
                <span class="timeline-year">${edu.year}</span>
                <span class="edu-status ${isCurrent ? 'status-active' : 'status-completed'}">
                  ${isCurrent ? '<span class="status-beacon"></span>' : ''}
                  ${edu.status || 'Completed'}
                </span>
              </div>
            </div>

            <div class="edu-grade-chip">
              <span class="grade-label">Grade / Score</span>
              <span class="grade-value">${edu.grade || 'Passed'}</span>
            </div>
          </div>

          <div class="edu-body">
            <h3 class="timeline-degree">${edu.degree}</h3>
            
            <div class="edu-meta-row">
              <span class="edu-institution">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${edu.institution}
              </span>
              ${edu.board ? `<span class="edu-board">· ${edu.board}</span>` : ''}
            </div>

            ${highlightsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  section.innerHTML = `
    <div class="container">
      <div class="section-heading-wrapper">
        <span class="section-label">03 / Academic Foundation</span>
        <h2 class="section-title">Education & Milestones</h2>
        <p class="section-subtitle">A chronological record of continuous learning, foundational computer science disciplines, and academic credentials.</p>
      </div>

      <div class="timeline">
        <!-- Glowing animated SVG rail -->
        <div class="timeline-rail-glow" aria-hidden="true"></div>
        <svg class="timeline-svg" viewBox="0 0 4 1000" preserveAspectRatio="none" aria-hidden="true">
          <line class="timeline-svg-bg"
            x1="2" y1="0" x2="2" y2="1000"
            stroke="rgba(255,255,255,0.08)" stroke-width="2"
            stroke-linecap="round"/>
          <line class="timeline-svg-line"
            x1="2" y1="0" x2="2" y2="1000"
            stroke="url(#eduGrad)" stroke-width="3"
            stroke-linecap="round"/>
          <defs>
            <linearGradient id="eduGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity="1"/>
              <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#818cf8" stop-opacity="0.4"/>
            </linearGradient>
          </defs>
        </svg>

        ${items}
      </div>
    </div>
  `;

  // Attach dynamic 3D glare tilt interactions to cards
  _attachCardTilt();
}

function _attachCardTilt() {
  const cards = document.querySelectorAll('.edu-card[data-tilt]');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6.5;
      const rotY = ((x - cx) / cx) * 6.5;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
      
      const glow = card.querySelector('.edu-card-glow');
      if (glow) {
        glow.style.opacity = '1';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      const glow = card.querySelector('.edu-card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });
}
