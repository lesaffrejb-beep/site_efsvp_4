/**
 * ============================================
 * Project Accent Color from Image Analysis
 * ============================================
 * Analyzes project thumbnail images to extract dominant colors
 * and maps them to the closest design system accent token.
 */

/**
 * Design system accent color candidates with their RGB values
 * These values must match the tokens defined in main.css
 */
const ACCENT_CANDIDATES = [
  { name: 'terracotta', cssVar: '--accent-terracotta-dark', rgb: [160, 78, 55] },
  { name: 'ambre', cssVar: '--accent-ambre-dark', rgb: [216, 148, 22] },
  { name: 'encre', cssVar: '--accent-encre-dark', rgb: [13, 17, 23] },
  { name: 'sauge', cssVar: '--accent-sauge-dark', rgb: [36, 90, 63] },
  { name: 'ocean', cssVar: '--accent-ocean-dark', rgb: [21, 90, 150] },
  { name: 'lavande', cssVar: '--accent-lavande-dark', rgb: [103, 65, 217] },
  { name: 'coral', cssVar: '--accent-coral-dark', rgb: [214, 125, 95] },
];

/**
 * Calculate Euclidean distance between two RGB colors
 * @param {number[]} rgb1 - First color [r, g, b]
 * @param {number[]} rgb2 - Second color [r, g, b]
 * @returns {number} Distance
 */
function colorDistance(rgb1, rgb2) {
  const dr = rgb1[0] - rgb2[0];
  const dg = rgb1[1] - rgb2[1];
  const db = rgb1[2] - rgb2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Calculate perceived brightness of an RGB color
 * @param {number[]} rgb - Color [r, g, b]
 * @returns {number} Brightness value (0-255)
 */
function perceivedBrightness([r, g, b]) {
  // Using the weighted luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Extract average color from an image using canvas sampling
 * @param {HTMLImageElement} image - Image element to analyze
 * @returns {number[] | null} Average RGB color [r, g, b] or null if failed
 */
function extractAverageColor(image) {
  try {
    // Create a small offscreen canvas for efficient processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return null;

    // Use a small size for performance (16x16 is sufficient)
    const size = 16;
    canvas.width = size;
    canvas.height = size;

    // Draw the image scaled down
    ctx.drawImage(image, 0, 0, size, size);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Calculate average RGB, excluding very light and very dark pixels
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    // Sample every 4th pixel for even better performance
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Calculate brightness
      const brightness = perceivedBrightness([r, g, b]);

      // Exclude very light (> 240) and very dark (< 15) pixels
      // to avoid bias from pure whites and blacks
      if (brightness > 240 || brightness < 15) continue;

      totalR += r;
      totalG += g;
      totalB += b;
      count++;
    }

    if (count === 0) return null;

    return [
      Math.round(totalR / count),
      Math.round(totalG / count),
      Math.round(totalB / count),
    ];
  } catch (error) {
    console.warn('Failed to extract color from image:', error);
    return null;
  }
}

/**
 * Find the closest accent color from the design system
 * @param {number[]} rgb - Target RGB color
 * @returns {object} Closest accent candidate
 */
function findClosestAccent(rgb) {
  let minDistance = Infinity;
  let closest = ACCENT_CANDIDATES[0];

  for (const candidate of ACCENT_CANDIDATES) {
    const distance = colorDistance(rgb, candidate.rgb);
    if (distance < minDistance) {
      minDistance = distance;
      closest = candidate;
    }
  }

  return closest;
}

/**
 * Setup adaptive accent color for a project card based on its image
 * @param {HTMLElement} card - Project card element
 * @param {HTMLImageElement} image - Project thumbnail image
 */
export function setupProjectAccentFromImage(card, image) {
  // Only process if image is loaded
  if (!image.complete || !image.naturalWidth) {
    // Wait for image to load
    image.addEventListener('load', () => {
      processImageColor(card, image);
    }, { once: true });

    // Handle error case
    image.addEventListener('error', () => {
      console.warn('Failed to load image for accent color extraction');
    }, { once: true });

    return;
  }

  // Image already loaded, process immediately
  processImageColor(card, image);
}

/**
 * Process image and apply accent color to card
 * @param {HTMLElement} card - Project card element
 * @param {HTMLImageElement} image - Project thumbnail image
 */
function processImageColor(card, image) {
  try {
    // Extract average color from image
    const avgColor = extractAverageColor(image);

    if (!avgColor) {
      // Fallback to accentTheme if extraction failed
      return;
    }

    // Find closest design system accent
    const closest = findClosestAccent(avgColor);

    // Apply the accent color CSS variable
    card.style.setProperty('--project-accent-color', `var(${closest.cssVar})`);

    // Optional: Add data attribute for debugging
    if (import.meta.env.DEV) {
      card.dataset.detectedAccent = closest.name;
      console.log(`🎨 Detected accent for "${card.dataset.projectId}":`, closest.name, avgColor);
    }
  } catch (error) {
    console.warn('Failed to process image color:', error);
  }
}

/**
 * Initialize adaptive accent colors for all project cards in a container
 * @param {HTMLElement} container - Container with project cards
 */
export function initProjectAccentColors(container) {
  const cards = container.querySelectorAll('.project-card');

  cards.forEach((card) => {
    const image = card.querySelector('.project-card__image');
    if (image) {
      setupProjectAccentFromImage(card, image);
    }
  });
}
