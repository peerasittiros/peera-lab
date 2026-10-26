// Vanta ships no types, and three r134 (the version Vanta is built for) has none either. HeroGlobe passes the
// three module straight to Vanta, so neither needs more than this.
declare module 'three';

declare module 'vanta/dist/vanta.globe.min' {
  export interface VantaEffect {
    destroy: () => void;
  }
  const GLOBE: (options: Record<string, unknown>) => VantaEffect;
  export default GLOBE;
}
