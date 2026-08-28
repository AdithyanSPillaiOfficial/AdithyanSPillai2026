import { CONFIG } from '../config.js';
import { copyToClipboard } from '../utils/helpers.js';

/**
 * Contact & Footer section.
 */
export function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;

  const { personal } = CONFIG;

  const githubIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;

  const linkedinIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

  const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

  section.innerHTML = `
    <div class="container contact-container">
      <span class="section-label">07 / Contact</span>
      <h2 class="section-title contact-heading reveal-fade">Let's Connect.</h2>
      <p class="contact-sub reveal-fade">
        Open to exciting opportunities, collaborations, and interesting conversations.
        Drop a message — I'll get back to you!
      </p>

      <div class="contact-email-row reveal-fade">
        <a href="mailto:${personal.email}" class="contact-email-link">${personal.email}</a>
        <button class="copy-btn magnetic" id="copy-email-btn" aria-label="Copy email address" title="Copy email">
          <span class="copy-icon">${copyIcon}</span>
          <span class="check-icon" style="display:none">${checkIcon}</span>
        </button>
      </div>

      <div class="contact-social reveal-fade">
        <a href="${personal.github}" target="_blank" rel="noopener noreferrer" class="social-btn magnetic" aria-label="GitHub profile">
          ${githubIcon}
          <span>GitHub</span>
          <span class="social-handle">@AdithyanSPillaiOfficial</span>
        </a>
        <a href="${personal.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn magnetic" aria-label="LinkedIn profile">
          ${linkedinIcon}
          <span>LinkedIn</span>
          <span class="social-handle">adithyan-s-pillai</span>
        </a>
      </div>

      <div class="contact-actions reveal-fade">
        <a href="${personal.resume}" download class="btn-primary magnetic" aria-label="Download resume PDF">
          Download Resume ↓
        </a>
        <a href="tel:${personal.phone.replace(/\s/g, '')}" class="btn-outline magnetic">
          ${personal.phone}
        </a>
      </div>
    </div>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span class="footer-logo">ASP</span>
        <span class="footer-copy">© ${new Date().getFullYear()} Adithyan S Pillai · Built with passion</span>
        <a href="#hero" class="footer-back magnetic" aria-label="Back to top">↑ Top</a>
      </div>
    </footer>
  `;

  // Copy email interaction
  const copyBtn = section.querySelector('#copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const ok = await copyToClipboard(personal.email);
      if (ok) {
        copyBtn.querySelector('.copy-icon').style.display = 'none';
        copyBtn.querySelector('.check-icon').style.display = 'inline';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.querySelector('.copy-icon').style.display = 'inline';
          copyBtn.querySelector('.check-icon').style.display = 'none';
          copyBtn.classList.remove('copied');
        }, 2200);
      }
    });
  }
}
