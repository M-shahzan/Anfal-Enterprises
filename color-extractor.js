/**
 * Anfal Enterprises - Dynamic Image Color Extraction & Atmospheric Gradient Engine
 * Analyzes brand product photography and extracts harmonious palettes for full-bleed brand cards.
 */

const ColorExtractor = {
  // In-memory cache to avoid recomputing for the same image source
  _cache: new Map(),

  /**
   * Extract atmospheric color palette from an image (URL, Data URL, or Image element)
   * @param {string|HTMLImageElement} imageSrc 
   * @returns {Promise<Object>} Extracted palette with CSS variables and theme settings
   */
  async extract(imageSrc) {
    if (!imageSrc) {
      return this.getDefaultPalette();
    }

    const srcString = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
    if (this._cache.has(srcString)) {
      return this._cache.get(srcString);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const palette = this._processImage(img);
          this._cache.set(srcString, palette);
          resolve(palette);
        } catch (e) {
          // Fallback if canvas is tainted by CORS or decode failure
          const fallback = this._getFallbackFromUrl(srcString);
          this._cache.set(srcString, fallback);
          resolve(fallback);
        }
      };

      img.onerror = () => {
        const fallback = this._getFallbackFromUrl(srcString);
        this._cache.set(srcString, fallback);
        resolve(fallback);
      };

      img.src = srcString;
    });
  },

  /**
   * Internal image processing using canvas
   */
  _processImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Sample image at lower resolution for fast, smooth color averaging
    const width = 64;
    const height = 64;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    // 1. Sample Top Edge (where the gradient transition directly meets the image)
    const topData = ctx.getImageData(0, 0, width, Math.floor(height * 0.35)).data;
    const topColor = this._averageColor(topData);

    // 2. Sample Overall Image
    const fullData = ctx.getImageData(0, 0, width, height).data;
    const dominantColor = this._getDominantVibrantColor(fullData);

    // 3. Compute Lightness & Perceived Luminance
    // Luminance formula: 0.299*R + 0.587*G + 0.114*B
    const lum = (0.299 * dominantColor.r + 0.587 * dominantColor.g + 0.114 * dominantColor.b) / 255;
    const topLum = (0.299 * topColor.r + 0.587 * topColor.g + 0.114 * topColor.b) / 255;

    // Detect if the image is heavily saturated red/crimson or very dark
    const isRedSaturated = (dominantColor.r > 150 && dominantColor.g < 75 && dominantColor.b < 75) ||
                           (dominantColor.r > 180 && dominantColor.r > (dominantColor.g + dominantColor.b) * 1.3);
    const isDark = lum < 0.38 || isRedSaturated;

    return this._generateTheme(dominantColor, topColor, isDark, isRedSaturated);
  },

  /**
   * Extract vibrant dominant color from pixel buffer
   */
  _getDominantVibrantColor(data) {
    let r = 0, g = 0, b = 0, count = 0;
    let maxSaturation = -1;
    let bestR = 120, bestG = 120, bestB = 120;

    for (let i = 0; i < data.length; i += 16) { // Step for performance
      const pr = data[i];
      const pg = data[i + 1];
      const pb = data[i + 2];
      const pa = data[i + 3];

      if (pa < 128) continue; // Skip transparent pixels

      // Ignore pure white, black, or flat grays
      const max = Math.max(pr, pg, pb);
      const min = Math.min(pr, pg, pb);
      const sat = max === 0 ? 0 : (max - min) / max;
      const brightness = max / 255;

      if (brightness > 0.12 && brightness < 0.94) {
        r += pr;
        g += pg;
        b += pb;
        count++;

        if (sat > maxSaturation) {
          maxSaturation = sat;
          bestR = pr;
          bestG = pg;
          bestB = pb;
        }
      }
    }

    if (count === 0) return { r: 120, g: 140, b: 150 };

    // Blend dominant saturated color with average for smooth harmony
    return {
      r: Math.round(bestR * 0.65 + (r / count) * 0.35),
      g: Math.round(bestG * 0.65 + (g / count) * 0.35),
      b: Math.round(bestB * 0.65 + (b / count) * 0.35)
    };
  },

  /**
   * Compute average color of pixel buffer
   */
  _averageColor(data) {
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] >= 128) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
    if (count === 0) return { r: 240, g: 245, b: 248 };
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count)
    };
  },

  /**
   * Generate CSS color tokens and variables based on extracted tones
   */
  _generateTheme(dom, top, isDark, isRedSaturated) {
    const rgbStr = `${dom.r}, ${dom.g}, ${dom.b}`;
    const topRgbStr = `${top.r}, ${top.g}, ${top.b}`;

    if (isRedSaturated) {
      // Saturated Red Theme (like Britannia / Colgate in reference image)
      return {
        isDark: true,
        bgStart: `rgb(${Math.min(220, Math.max(160, dom.r))}, ${Math.min(40, dom.g)}, ${Math.min(40, dom.b)})`,
        bgMid: `rgb(${Math.min(190, Math.max(130, dom.r))}, ${Math.min(30, dom.g)}, ${Math.min(30, dom.b)})`,
        bgBottom: `rgb(${Math.min(160, Math.max(110, dom.r))}, ${Math.min(20, dom.g)}, ${Math.min(20, dom.b)})`,
        cardRgb: `${dom.r}, ${dom.g}, ${dom.b}`,
        textColor: "#ffffff",
        subtextColor: "rgba(255, 255, 255, 0.9)",
        categoryColor: "#ffdbce",
        btnBg: "rgba(255, 255, 255, 0.2)",
        btnText: "#ffffff",
        logoBg: "#ffffff",
        logoText: "#ba1a1a",
        borderColor: "rgba(255, 255, 255, 0.2)",
        cardGradient: `linear-gradient(180deg, rgb(${Math.min(215, dom.r + 20)}, ${dom.g}, ${dom.b}) 0%, rgb(${Math.max(140, dom.r - 20)}, ${dom.g}, ${dom.b}) 55%, rgb(${Math.max(110, dom.r - 40)}, ${Math.max(10, dom.g - 10)}, ${Math.max(10, dom.b - 10)}) 100%)`
      };
    }

    if (isDark) {
      // Dark Ambient Theme
      return {
        isDark: true,
        bgStart: `rgb(${Math.round(dom.r * 0.45)}, ${Math.round(dom.g * 0.45)}, ${Math.round(dom.b * 0.45)})`,
        bgMid: `rgb(${Math.round(dom.r * 0.35)}, ${Math.round(dom.g * 0.35)}, ${Math.round(dom.b * 0.35)})`,
        bgBottom: `rgb(${Math.round(dom.r * 0.25)}, ${Math.round(dom.g * 0.25)}, ${Math.round(dom.b * 0.25)})`,
        cardRgb: `${dom.r}, ${dom.g}, ${dom.b}`,
        textColor: "#ffffff",
        subtextColor: "rgba(255, 255, 255, 0.85)",
        categoryColor: "#b2efdf",
        btnBg: "rgba(255, 255, 255, 0.15)",
        btnText: "#ffffff",
        logoBg: "rgba(255, 255, 255, 0.95)",
        logoText: `rgb(${dom.r}, ${dom.g}, ${dom.b})`,
        borderColor: "rgba(255, 255, 255, 0.15)",
        cardGradient: `linear-gradient(180deg, rgba(${rgbStr}, 0.85) 0%, rgba(${rgbStr}, 0.95) 60%, rgba(${rgbStr}, 1) 100%)`
      };
    }

    // Light Tinted Atmospheric Theme (HUL soft blue, Dabur soft green, Saffola golden, P&G warm cream, Nestle soft amber)
    // Blend with high white percentage for clean, luxury editorial readability
    const tintR = Math.round(255 * 0.82 + dom.r * 0.18);
    const tintG = Math.round(255 * 0.82 + dom.g * 0.18);
    const tintB = Math.round(255 * 0.82 + dom.b * 0.18);

    const midR = Math.round(255 * 0.72 + dom.r * 0.28);
    const midG = Math.round(255 * 0.72 + dom.g * 0.28);
    const midB = Math.round(255 * 0.72 + dom.b * 0.28);

    return {
      isDark: false,
      bgStart: `rgb(${tintR}, ${tintG}, ${tintB})`,
      bgMid: `rgb(${midR}, ${midG}, ${midB})`,
      bgBottom: `rgb(${Math.round(255 * 0.6 + dom.r * 0.4)}, ${Math.round(255 * 0.6 + dom.g * 0.4)}, ${Math.round(255 * 0.6 + dom.b * 0.4)})`,
      cardRgb: `${dom.r}, ${dom.g}, ${dom.b}`,
      textColor: "#0f172a",
      subtextColor: "#334155",
      categoryColor: `rgb(${Math.max(10, Math.round(dom.r * 0.85))}, ${Math.max(10, Math.round(dom.g * 0.85))}, ${Math.max(10, Math.round(dom.b * 0.85))})`,
      btnBg: "rgba(15, 23, 42, 0.06)",
      btnText: "#0f172a",
      logoBg: `rgb(${dom.r}, ${dom.g}, ${dom.b})`,
      logoText: "#ffffff",
      borderColor: `rgba(${dom.r}, ${dom.g}, ${dom.b}, 0.2)`,
      cardGradient: `linear-gradient(180deg, rgb(${tintR}, ${tintG}, ${tintB}) 0%, rgb(${midR}, ${midG}, ${midB}) 60%, rgba(${rgbStr}, 0.25) 100%)`
    };
  },

  /**
   * Fallback if canvas extraction is restricted by cross-origin policies
   */
  _getFallbackFromUrl(url) {
    const l = (url || '').toLowerCase();
    if (l.includes('britannia') || l.includes('colgate') || l.includes('red')) {
      return this._generateTheme({ r: 200, g: 30, b: 30 }, { r: 180, g: 25, b: 25 }, true, true);
    }
    if (l.includes('dabur') || l.includes('green') || l.includes('herb')) {
      return this._generateTheme({ r: 35, g: 130, b: 60 }, { r: 40, g: 140, b: 70 }, false, false);
    }
    if (l.includes('nestle') || l.includes('coffee') || l.includes('biscuit')) {
      return this._generateTheme({ r: 190, g: 130, b: 60 }, { r: 210, g: 150, b: 80 }, false, false);
    }
    if (l.includes('saffola') || l.includes('oil') || l.includes('yellow') || l.includes('pears')) {
      return this._generateTheme({ r: 215, g: 165, b: 30 }, { r: 230, g: 185, b: 50 }, false, false);
    }
    if (l.includes('itc') || l.includes('bingo')) {
      return this._generateTheme({ r: 40, g: 110, b: 130 }, { r: 50, g: 125, b: 145 }, false, false);
    }
    // Default blue tone (e.g. HUL / P&G)
    return this._generateTheme({ r: 16, g: 90, b: 165 }, { r: 30, g: 110, b: 180 }, false, false);
  },

  /**
   * Default neutral palette
   */
  getDefaultPalette() {
    return {
      isDark: false,
      bgStart: "#f8fafc",
      bgMid: "#f1f5f9",
      bgBottom: "#e2e8f0",
      cardRgb: "10, 25, 47",
      textColor: "#0a192f",
      subtextColor: "#475569",
      categoryColor: "#c51d24",
      btnBg: "rgba(10, 25, 47, 0.06)",
      btnText: "#0a192f",
      logoBg: "#0a192f",
      logoText: "#ffffff",
      borderColor: "rgba(203, 213, 225, 0.6)",
      cardGradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)"
    };
  },

  /**
   * Apply extracted palette as CSS custom properties on a DOM element
   */
  applyToElement(element, palette) {
    if (!element || !palette) return;

    element.style.setProperty('--card-bg-start', palette.bgStart);
    element.style.setProperty('--card-bg-mid', palette.bgMid);
    element.style.setProperty('--card-bg-bottom', palette.bgBottom);
    element.style.setProperty('--card-rgb', palette.cardRgb);
    element.style.setProperty('--card-text', palette.textColor);
    element.style.setProperty('--card-subtext', palette.subtextColor);
    element.style.setProperty('--card-category-color', palette.categoryColor);
    element.style.setProperty('--card-btn-bg', palette.btnBg);
    element.style.setProperty('--card-btn-text', palette.btnText);
    element.style.setProperty('--card-logo-bg', palette.logoBg);
    element.style.setProperty('--card-logo-text', palette.logoText);
    element.style.setProperty('--card-border', palette.borderColor);
    element.style.setProperty('--card-gradient', palette.cardGradient);

    if (palette.isDark) {
      element.classList.add('theme-dark');
      element.classList.remove('theme-light');
    } else {
      element.classList.add('theme-light');
      element.classList.remove('theme-dark');
    }
  }
};

if (typeof window !== 'undefined') {
  window.ColorExtractor = ColorExtractor;
}
