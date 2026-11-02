<script lang="ts">
  import Hero from '#lib/components/Hero.svelte';
  import DayStack from '#lib/components/DayStack.svelte';
  import DishShowcase from '#lib/components/DishShowcase.svelte';
  import BedRows from '#lib/components/BedRows.svelte';
  import { storyIntro } from '#lib/data/content.ts';
  import { createMotion, gsap } from '#lib/motion.ts';
  function ribbon(node: HTMLElement) {
    return createMotion(node, () => { gsap.to(node.firstElementChild, { x: -500, ease: 'none', scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 1 } }); }).destroy;
  }
  function readStory(node: HTMLElement) {
    return createMotion(node, () => { gsap.from(node.querySelectorAll('.story-word'), { opacity: .6, stagger: .05, ease: 'none', scrollTrigger: { trigger: node, start: 'top 85%', end: 'bottom 60%', scrub: true } }); }).destroy;
  }
</script>

<Hero />
<div class="fire-ribbon" {@attach ribbon}><p>{#each [0, 1, 2, 3] as copy (copy)}<span aria-hidden={copy > 0}>Lit at three <span class="accent">·</span> nine beds <span class="accent">·</span> banked at half past eleven <span class="accent">·</span> </span>{/each}</p></div>
<section class="home-story light section wrap">
  <h2 class="head">The fire is lit <span class="accent">at three</span></h2>
  <div class="story-column"><p class="story-copy" {@attach readStory}>{#each storyIntro.split(' ') as word, i (`${i}-${word}`)}<span class="story-word">{word}</span>{' '}{/each}</p><a class="btn ink" href="/story">Read the story</a></div>
</section>
<DayStack />
<DishShowcase />
<section class="coal-section section">
  <div class="coal-heading wrap"><h2 class="head">Nine beds, <span class="accent">one fire</span></h2><p class="muted">Every dish has its own bed of coals, from white-hot under the steaks to a low glow under the desserts.</p></div>
  <BedRows />
</section>

<style>
  .fire-ribbon { overflow: clip; padding-block: 24px; background: var(--ember); color: var(--ink); }
  .fire-ribbon p { width: max-content; font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 6rem); font-weight: 600; line-height: 1; letter-spacing: -.03em; text-transform: uppercase; white-space: nowrap; }
  .home-story h2 { max-width: 16ch; }
  .story-column { max-width: 620px; margin: 64px 5% 0 38%; }
  .story-copy { font-size: clamp(1.6rem, 1.2rem + 1.6vw, 3rem); line-height: 1.15; font-weight: 500; letter-spacing: -.02em; margin-bottom: 48px; }
  .story-word { display: inline-block; }
  .coal-heading { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 48px; }
  .coal-heading h2 { max-width: 12ch; }
  .coal-heading .accent { color: var(--ember); }
  .coal-heading p { max-width: 40ch; line-height: 1.6; }
  @media (max-width: 767px) { .story-column { margin: 48px 0 0 10%; } .coal-heading p { max-width: 36ch; } }
  @media (max-width: 440px) { .story-column { margin-left: 0; } }
</style>
