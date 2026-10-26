/**
 * Settings for the hero globe (Vanta.js GLOBE, https://www.vantajs.com/?effect=globe). Edit, then rebuild.
 *
 * Colours: a token name such as '--accent' follows the site theme (light and dark values from tokens.css);
 * a number such as 0xc8381a fixes the colour in both themes. Read the numbers off the Vanta playground URL:
 * `color:11955589` there is 0xb66d85 here (decimal → hex).
 *
 * The playground URL also carries `points`, `maxDistance`, `spacing` and `showDots`. Those belong to the NET
 * effect; GLOBE ignores them, so they are not settings here.
 */

export type GlobeColor = `--${string}` | number;

export interface GlobeTheme {
  /** Lines and the large points. */
  color: GlobeColor;
  /** The small points. */
  color2: GlobeColor;
  /** Painted only when `backgroundAlpha` is above 0. */
  background: GlobeColor;
}

export interface GlobeConfig {
  /** false removes the globe (the hero keeps its height). */
  enabled: boolean;
  /** Also run on phones (< 768 px). It loads about 150 KB of three.js there, after the page is idle. */
  phones: boolean;
  /** Globe size; the playground uses 0.5 to 2. */
  size: number;
  /** Detail scale on desktop and on phones. */
  scale: number;
  scaleMobile: number;
  /** Follow the mouse, touch, or the phone's tilt. */
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  /** Smallest box Vanta draws into. */
  minHeight: number;
  minWidth: number;
  /** 0 lets the page surface show through (follows the theme); 1 paints `background`. */
  backgroundAlpha: number;
  /** How much of the globe shows behind the hero text, 0 (none) to 1 (all). The right side is always full. */
  fadeBehindText: number;
  light: GlobeTheme;
  dark: GlobeTheme;
}

/** The site look: accent lines, blueprint points, transparent background. */
export const siteGlobe: GlobeConfig = {
  enabled: true,
  phones: true,
  size: 1,
  scale: 1,
  scaleMobile: 1,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  backgroundAlpha: 0,
  fadeBehindText: 0.25,
  light: { color: '--accent', color2: '--blueprint', background: '--surface' },
  dark: { color: '--accent', color2: '--blueprint', background: '--surface' },
};

/**
 * The playground preset from 2026-10-26: smaller globe on a dark violet background.
 * It paints its own background, so the hero text needs a light colour to read on it.
 */
export const vantaDemoGlobe: GlobeConfig = {
  ...siteGlobe,
  size: 0.5,
  backgroundAlpha: 1,
  light: { color: 0xb66d85, color2: 0x472a2a, background: 0x23153c },
  dark: { color: 0xb66d85, color2: 0x472a2a, background: 0x23153c },
};

/** The globe the hero uses. Point this at another preset to switch. */
export const globeConfig: GlobeConfig = siteGlobe;
