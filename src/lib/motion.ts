import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export function createMotion(node: HTMLElement, setup: () => void): { destroy: () => void } {
  const media = gsap.matchMedia();
  const context = gsap.context(() => {
    media.add('(prefers-reduced-motion: no-preference)', setup);
  }, node);
  return { destroy: () => { media.revert(); context.revert(); } };
}
