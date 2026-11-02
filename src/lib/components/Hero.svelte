<script lang="ts">
  import Image from './Image.svelte';
  import FireStatus from './FireStatus.svelte';
  import { createMotion, gsap } from '#lib/motion.ts';

  function introduce(node: HTMLElement) {
    return createMotion(node, () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(node.querySelectorAll('.hero-word'), { yPercent: 115, duration: 1.2, stagger: .14 })
        .from(node.querySelector('.hero-dish'), { y: 90, rotation: -12, opacity: 0, duration: 1.4 }, .3)
        .from(node.querySelectorAll('.hero-corner > *'), { y: 20, opacity: 0, duration: .8, stagger: .12 }, .65);
      gsap.to(node.querySelector('.hero-dish'), { y: 90, rotation: 5, ease: 'none', scrollTrigger: { trigger: node, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(node.querySelector('.hero-title'), { y: -55, ease: 'none', scrollTrigger: { trigger: node, start: 'top top', end: 'bottom top', scrub: 1 } });
    }).destroy;
  }
</script>

<section class="hero" {@attach introduce}>
  <img class="hero-smoke" src="/media/smoke-black.jpg" alt="" aria-hidden="true" fetchpriority="high" />
  <h1 class="hero-title" aria-label="Nine Coals, an open-fire grill in Johannesburg">
    <span class="hero-line" aria-hidden="true"><span class="hero-word giant">NINE</span></span>
    <span class="hero-line coals" aria-hidden="true"><span class="hero-word giant">COALS</span></span>
  </h1>
  <div class="hero-dish"><Image src="/cutouts/tomahawk-skillet.webp" alt="A charred tomahawk steak resting in a cast-iron skillet with rosemary and chips" class="hero-food" eager /></div>
  <div class="hero-corner wrap">
    <FireStatus />
    <div class="hero-intro"><p class="lead">An open-fire grill in Johannesburg.<br class="desktop-break" /> One wood fire, <span class="accent">raked into nine beds.</span></p><div class="button-row"><a class="btn" href="/reservations">Book a table</a><a class="btn ghost" href="/menu">See the menu</a></div></div>
  </div>
</section>

<style>
  .hero { min-height: max(100svh, 680px); padding-top: 96px; position: relative; isolation: isolate; display: flex; flex-direction: column; overflow: clip; background: radial-gradient(70% 55% at 70% 115%, #ffb347bd 0%, #f68a3020 60%, transparent 80%), radial-gradient(110% 75% at 70% 115%, #ff8a3d 0%, #ff4d1a 14%, #b12c0b 30%, #4a1309 50%, #1c0b08 70%, #0d0c0b 88%); }
  .hero-smoke { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .4; mix-blend-mode: screen; z-index: -1; pointer-events: none; }
  .hero-title { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; padding-top: 3vh; line-height: 1; text-shadow: 0 6px 40px #0d0c0b59; }
  .hero-line { display: block; max-width: calc(100vw - var(--margin) * 2); overflow: clip; padding-block: .025em; text-align: center; }
  .hero-word { display: block; }
  .coals { margin-top: -1.5vw; }
  .hero-dish { position: relative; z-index: 2; flex: 1; min-height: 30svh; width: min(66vw, 900px); margin: -9vw auto 0; }
  .hero-dish :global(.hero-food) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 24px 36px #0005); }
  .hero-corner { position: relative; z-index: 4; display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 24px; padding-bottom: 32px; }
  .hero-intro { display: flex; flex-direction: column; align-items: flex-end; gap: 24px; text-align: right; }
  .hero-intro .lead { max-width: 28ch; }
  .hero-intro .accent { color: #ffd290; }
  @media (min-width: 768px) { .hero-word { -webkit-text-stroke: 3px var(--smoke); paint-order: stroke fill; } }
  @media (max-width: 767px) {
    .hero { min-height: max(100svh, 760px); }
    .hero-dish { width: min(66vw, 500px); margin-top: -12vw; }
    .hero-corner { grid-template-columns: 1fr; gap: 26px; }
    .hero-intro { align-items: flex-start; text-align: left; gap: 22px; }
    .hero-title { padding-top: 3vh; }
    .desktop-break { display: none; }
    .hero-corner :global(.fire-status) { font-size: .8rem; }
  }
  @media (max-width: 390px) { .hero .button-row { gap: 12px; } .hero .btn { padding-inline: 24px; } }
</style>
