<script lang="ts">
  import Image from '#lib/components/Image.svelte';
  import { story } from '#lib/data/content.ts';
  import { createMotion, gsap } from '#lib/motion.ts';
  function photographs(node: HTMLElement) { return createMotion(node, () => { node.querySelectorAll('figure').forEach(figure => gsap.from(figure, { y: 70, opacity: .6, ease: 'none', scrollTrigger: { trigger: figure, start: 'top 90%', end: 'top 35%', scrub: true } })); }).destroy; }
</script>
<svelte:head><title>One fire, our story | Nine Coals</title></svelte:head>
<section class="story-hero light wrap"><h1 class="giant">ONE FIRE.</h1><div class="story-opening"><blockquote class="accent">“He never used a thermometer. He held his hand over the coals and counted.”</blockquote><div><p class="story-body">{story}</p><div class="owner"><p>Thabo Mokoena</p><p class="small muted">Pitmaster and owner</p></div><p class="small muted prototype-note">A fictional brand story for this design prototype.</p></div></div></section>
<section class="wood-section light section wrap"><h2 class="head">Wood, <span class="accent">coal, ash</span></h2><div class="story-photos" {@attach photographs}><figure><Image src="/media/firewood.jpg" alt="Split firewood stacked to dry" /><figcaption>The wood dries for a season before it burns.</figcaption></figure><figure><p class="photo-aside accent">One log,<br />several heats at once.</p><Image src="/media/embers-coals.jpg" alt="Coals glowing white and orange" /><figcaption>Ready when the edges go white.</figcaption></figure><figure><Image src="/media/steak-flames.jpg" alt="Steaks searing over a flaming charcoal grill" /><figcaption>Roar at full heat, a few minutes before service.</figcaption></figure></div></section>
<section class="fire-numbers section wrap"><h2 class="head">The fire <span class="accent">in numbers</span></h2><dl><div><dt>450<span class="accent">°C</span></dt><dd>under the steaks, on Roar</dd></div><div><dt>90 <span class="accent">min</span></dt><dd>waiting for the coals to settle</dd></div><div><dt>9 <span class="accent">beds</span></dt><dd>raked out of one fire</dd></div><div><dt>0 <span class="accent">gas</span></dt><dd>burners in the kitchen</dd></div></dl></section>
<section class="story-invitation wrap section"><h2 class="head">Come and sit <span class="accent">by the fire</span></h2><div class="button-row"><a class="btn" href="/reservations">Book a table</a><a class="btn ghost" href="/menu">See the menu</a></div></section>
<style>
  .story-hero { padding-top: 152px; padding-bottom: 90px; min-height: 100svh; }
  .story-hero h1 { font-size: clamp(5rem, 14vw, 14rem); line-height: .85; }
  .story-opening { display: grid; grid-template-columns: .9fr 1fr; gap: 80px; margin-top: 92px; }
  blockquote { font-size: clamp(1.75rem, 2.7vw, 2.5rem); line-height: 1.05; max-width: 31ch; }
  .story-body { font-size: clamp(1.4rem, 2vw, 2rem); line-height: 1.35; letter-spacing: -.02em; }
  .owner { margin-top: 60px; }
  .owner > p:first-child { font-family: var(--font-display); font-size: 24px; font-weight: 500; }
  .prototype-note { margin-top: 20px; }
  .wood-section { padding-top: 60px; }
  .story-photos { display: grid; grid-template-columns: 1.1fr .9fr; gap: 80px; margin-top: 80px; }
  figure { margin: 0; }
  figure :global(img) { width: 100%; height: 580px; object-fit: cover; }
  figure:nth-child(2) { padding-top: 100px; }
  figure:nth-child(2) :global(img) { height: 400px; }
  figure:nth-child(3) { grid-column: 1 / -1; width: 82%; margin-inline: auto; }
  figure:nth-child(3) :global(img) { height: 68svh; }
  figcaption { font-size: 14px; line-height: 1.6; margin-top: 16px; color: var(--muted); }
  .photo-aside { font-size: clamp(2rem, 4vw, 4rem); margin-bottom: 40px; }
  .fire-numbers .accent, .story-invitation .accent { color: var(--flame); }
  dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; margin: 80px 0 0; }
  dt { min-width: 0; overflow-wrap: anywhere; font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 600; letter-spacing: -.04em; }
  dt .accent { font-size: .7em; }
  dd { margin: 16px 0 0; font-size: 15px; color: var(--muted); }
  .story-invitation { background: #2b0e09; }
  .story-invitation h2 { max-width: 16ch; margin-bottom: 40px; }
  @media (max-width: 900px) { .story-opening { gap: 40px; } .story-photos { gap: 40px; } dl { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 50px; } }
  @media (max-width: 650px) { .story-hero { min-height: auto; padding-top: 130px; padding-bottom: 70px; } .story-opening { grid-template-columns: 1fr; gap: 44px; margin-top: 56px; } .owner { margin-top: 32px; } .story-photos { grid-template-columns: 1fr; gap: 40px; margin-top: 48px; } figure:nth-child(2) { padding-top: 0; } figure :global(img), figure:nth-child(2) :global(img) { height: 420px; } figure:nth-child(3) { grid-column: auto; width: 100%; } figure:nth-child(3) :global(img) { height: 420px; } .photo-aside { margin-bottom: 24px; } dl { margin-top: 48px; gap: 36px 24px; } }
</style>
