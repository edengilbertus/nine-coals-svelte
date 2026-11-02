<script lang="ts">
  import Image from './Image.svelte';
  import { timeline } from '#lib/data/content.ts';
  import { createMotion, gsap } from '#lib/motion.ts';
  function stack(node: HTMLElement) {
    return createMotion(node, () => {
      const cards = node.querySelectorAll<HTMLElement>('.day-card');
      cards.forEach((card, i) => {
        if (!cards[i + 1]) return;
        gsap.to(card.querySelector('.day-panel'), { scale: .91, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 25%', scrub: true } });
      });
    }).destroy;
  }
</script>
<section class="day-section">
  <h2 class="head wrap">One day <span class="accent">of the fire</span></h2>
  <div class="day-stack" {@attach stack}>
    {#each timeline as moment, i (moment.time)}
      <article class="day-card" style:--position={i}>
        <div class="day-panel">
          <Image src={moment.image} alt="" class="day-photo" />
          <div class="day-scrim"></div>
          <div class="day-caption"><p class="day-time">{moment.time}</p><div><h3>{moment.title}</h3><p>{moment.text}</p></div></div>
        </div>
      </article>
    {/each}
  </div>
</section>
<style>
  .day-section { padding-top: var(--section-gap); }
  h2 { max-width: 14ch; margin-bottom: 48px; }
  h2 .accent { color: var(--flame); }
  .day-stack { padding: 0 clamp(20px, 6vw, 80px) 80px; }
  .day-card { --card-height: max(72svh, 440px); position: sticky; top: calc(14svh + var(--position) * 28px); min-height: var(--card-height); margin-bottom: 72px; }
  .day-panel { min-height: var(--card-height); position: relative; border-radius: 28px; overflow: clip; transform-origin: center top; background: var(--char); box-shadow: 0 -12px 40px -16px #0007; }
  .day-panel :global(.day-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .day-scrim { position: absolute; inset: 0; background: linear-gradient(transparent 10%, #0d0c0b75 45%, #0d0c0bf5 100%); }
  .day-caption { position: relative; min-height: var(--card-height); display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 48px; align-items: end; align-content: end; padding: clamp(24px, 4vw, 56px); }
  .day-time { min-width: 0; overflow-wrap: anywhere; font-family: var(--font-display); font-size: clamp(4rem, 12vw, 11rem); font-weight: 600; line-height: .8; letter-spacing: -.05em; font-variant-numeric: tabular-nums; }
  .day-caption h3 { font-family: var(--font-display); font-size: 2rem; font-weight: 500; margin-bottom: 8px; }
  .day-caption > div { min-width: 0; max-width: 44ch; }
  .day-caption > div p { line-height: 1.6; }
  @media (max-width: 767px) { .day-caption { grid-template-columns: minmax(0, 1fr); gap: 24px; } .day-card { --card-height: max(65svh, 470px); top: calc(90px + var(--position) * 12px); margin-bottom: 40px; } .day-panel { border-radius: 18px; } }
  @media (prefers-reduced-motion: reduce) { .day-card { position: relative; top: 0; margin-bottom: 24px; } }
</style>
