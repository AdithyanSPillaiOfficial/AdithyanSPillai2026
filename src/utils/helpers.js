/**
 * General helper utilities.
 */

/**
 * Wrap each character of a string in an animated span.
 * Words are wrapped in a non-breaking word span so they never split mid-word.
 */
export function splitLetters(text) {
  return text
    .split(' ')
    .map((word) => {
      const letters = word
        .split('')
        .map((char) => `<span class="letter" aria-hidden="true">${char}</span>`)
        .join('');
      return `<span class="word-span">${letters}</span>`;
    })
    .join('<span class="letter space" aria-hidden="true">&nbsp;</span>');
}

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Map a value from one range to another. */
export function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** Returns a debounced version of fn. */
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Copy text to clipboard. Returns true on success. */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}
