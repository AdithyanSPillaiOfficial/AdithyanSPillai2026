import { CONFIG } from '../config.js';

/**
 * About section — injects content from config.
 */
export function initAbout() {
  const section = document.getElementById('about');
  if (!section) return;

  // Wrap tagline words for word-by-word reveal
  const taglineWords = CONFIG.about.tagline
    .replace('\n', '\n')
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .map((w) => `<span class="word">${w}</span>`)
        .join(' ')
    )
    .join('<br>');

  section.innerHTML = `
    <div class="container">
      <div class="about-grid">

        <div class="about-text">
          <span class="section-label">02 / About</span>
          <h2 class="about-tagline">${taglineWords}</h2>
          <p class="about-bio reveal-fade">${CONFIG.about.bio}</p>

          <div class="about-meta reveal-fade">
            <div class="meta-item">
              <span class="meta-key">Location</span>
              <span class="meta-val">${CONFIG.personal.location}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">University</span>
              <span class="meta-val">${CONFIG.about.university}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Degree</span>
              <span class="meta-val">${CONFIG.about.degree}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Languages</span>
              <span class="meta-val">${CONFIG.personal.languages.join(' · ')}</span>
            </div>
          </div>
        </div>

        <div class="about-card reveal-fade">
          <div class="about-card-glow"></div>
          <span class="about-card-year">2021 – 2025</span>
          <h3 class="about-card-degree">${CONFIG.about.degree}</h3>
          <p class="about-card-uni">${CONFIG.about.university}</p>
          <p class="about-card-uni" style="opacity:.55;font-size:.85rem;">APJ Abdul Kalam Technological University</p>
          <div class="about-card-badge">Final Year · 6.91 CGPA</div>
        </div>

      </div>
    </div>
  `;
}
