import { CONFIG } from '../config.js';

/**
 * Skills section — animated progress bars + tag clouds.
 */
export function initSkills() {
  const section = document.getElementById('skills');
  if (!section) return;

  const bars = CONFIG.skills.technical.map((s) => `
    <div class="skill-item">
      <div class="skill-header">
        <span class="skill-name">${s.name}</span>
        <span class="skill-pct">${s.level}%</span>
      </div>
      <div class="skill-track" role="progressbar" aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${s.name}">
        <div class="skill-bar-fill" data-level="${s.level}"></div>
      </div>
    </div>
  `).join('');

  const creativePills = CONFIG.skills.creative
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join('');

  const softPills = CONFIG.skills.soft
    .map((s) => `<span class="skill-tag skill-tag--soft">${s}</span>`)
    .join('');

  section.innerHTML = `
    <div class="container">
      <span class="section-label">06 / Skills</span>
      <h2 class="section-title">Skills</h2>

      <div class="skills-layout">
        <div class="skills-col skills-col--bars reveal-fade">
          <h3 class="skills-group-label">Technical</h3>
          <div class="skill-bars">${bars}</div>
        </div>

        <div class="skills-col reveal-fade">
          <h3 class="skills-group-label">Creative Tools</h3>
          <div class="skill-pills">${creativePills}</div>

          <h3 class="skills-group-label" style="margin-top:2.5rem">Soft Skills</h3>
          <div class="skill-pills">${softPills}</div>

          <h3 class="skills-group-label" style="margin-top:2.5rem">Other Platforms</h3>
          <div class="skill-pills">
            ${CONFIG.skills.other.map((s) => `<span class="skill-tag skill-tag--other">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
