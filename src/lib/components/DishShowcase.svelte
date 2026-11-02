<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { beds, signatures, formatPrice } from '#lib/data/menu.ts';
  import { getCart } from '#lib/cart-context.ts';
  import { gsap } from '#lib/motion.ts';
  import Image from './Image.svelte';
  let { heading = 'Signatures' }: { heading?: string } = $props();
  const cart = getCart();
  let index = $state(0);
  const dish = $derived(signatures[index]);
  const bed = $derived(beds.find(b => b.id === dish.bedId)!);
  const previous = $derived(signatures[(index + signatures.length - 1) % signatures.length]);
  const next = $derived(signatures[(index + 1) % signatures.length]);
  let stage!: HTMLDivElement;
  let title!: HTMLHeadingElement;
  let alive = true;
  let revision = 0;
  let startX = 0;
  let startY = 0;
  let animation: gsap.core.Timeline | undefined;
  async function move(direction: number) {
    index = (index + direction + signatures.length) % signatures.length;
    const request = ++revision;
    animation?.kill();
    await tick();
    if (!alive || request !== revision || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animation = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(stage, { x: direction * 65, rotation: direction * 7, opacity: .15 }, { x: 0, rotation: 0, opacity: 1, duration: .75 })
      .fromTo(title, { y: 30, opacity: .4 }, { y: 0, opacity: 1, duration: .6 }, 0);
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); void move(event.key === 'ArrowRight' ? 1 : -1); }
  }
  function swipe(event: PointerEvent) {
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - startY)) void move(dx < 0 ? 1 : -1);
  }
  onDestroy(() => { alive = false; animation?.kill(); });
</script>

<section class="showcase" aria-roledescription="carousel" aria-label={heading} style:--dish-color={bed.color} style:--dish-ink={bed.ink}>
  <div class="showcase-heading wrap"><h2>{heading}</h2></div>
  <h3 bind:this={title} class="dish-title giant" data-testid="dish-title" aria-live="polite">{dish.name}</h3>
  <button class="dish-peek previous" aria-label={`Previous: ${previous.name}`} onclick={() => move(-1)} onkeydown={keyboard} disabled={!cart.ready}><Image src={previous.image!} alt="" /></button>
  <button class="dish-peek next" aria-label={`Next: ${next.name}`} onclick={() => move(1)} onkeydown={keyboard} disabled={!cart.ready}><Image src={next.image!} alt="" /></button>
  <div bind:this={stage} class="dish-stage" role="group" aria-label="Dish photograph, swipe to change" onpointerdown={event => { startX = event.clientX; startY = event.clientY; }} onpointerup={swipe}>
    <Image src={dish.image!} alt={dish.name} class="dish-cutout" draggable="false" eager />
  </div>
  <div class="showcase-info wrap">
    <div class="dish-description"><p class="lead">{dish.description}</p><p class="small cooked">Cooked on {bed.name}, {bed.temperature}</p></div>
    <div class="dish-controls"><button class="round-button" aria-label="Previous dish" disabled={!cart.ready} onclick={() => move(-1)} onkeydown={keyboard}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg></button><p class="small">{index + 1} of {signatures.length}</p><button class="round-button" aria-label="Next dish" disabled={!cart.ready} onclick={() => move(1)} onkeydown={keyboard}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></button></div>
    <div class="dish-order"><p data-testid="dish-price">{formatPrice(dish.price)}</p><button class="btn ink" disabled={!cart.ready} onclick={() => cart.add(dish.id)}>Add to order</button></div>
  </div>
</section>

<style>
  .showcase { position: relative; isolation: isolate; height: 100svh; min-height: 720px; display: flex; flex-direction: column; overflow: clip; background: var(--dish-color); color: var(--dish-ink); transition: background .65s, color .65s; }
  .showcase:focus-visible { outline-offset: -5px; outline-color: currentColor; }
  .showcase-heading { padding-top: 112px; }
  .showcase-heading h2 { font-family: var(--font-display); font-size: 24px; font-weight: 500; }
  .dish-title { z-index: 3; position: relative; text-align: center; font-size: clamp(3rem, 12vw, 13rem); margin-top: 30px; overflow-wrap: anywhere; }
  .dish-stage { position: relative; z-index: 2; flex: 1; min-height: 220px; width: min(60vw, 820px); margin: -7vw auto 3vh; touch-action: pan-y; cursor: grab; }
  .dish-stage:active { cursor: grabbing; }
  .dish-stage :global(.dish-cutout) { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: contain; user-select: none; filter: drop-shadow(0 25px 32px #0003); }
  .dish-peek { position: absolute; top: 52%; z-index: 1; width: 20vw; min-height: 60px; opacity: .4; padding: 0; transition: opacity .25s; }
  .dish-peek:hover { opacity: .75; }
  .previous { left: -10vw; } .next { right: -10vw; }
  .showcase-info { position: relative; z-index: 4; display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 32px; padding-bottom: 48px; }
  .dish-description { max-width: 46ch; }
  .cooked { margin-top: 14px; font-weight: 500; }
  .dish-controls { display: flex; align-items: center; justify-content: center; gap: 20px; font-variant-numeric: tabular-nums; }
  .dish-controls p { white-space: nowrap; }
  .dish-order { display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
  .dish-order > p { font-family: var(--font-display); font-size: 32px; font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .dish-order .btn { flex-shrink: 0; }
  .showcase :global(:focus-visible) { outline-color: currentColor; }
  @media (max-width: 1050px) { .showcase-info { grid-template-columns: 1fr 1fr; } .dish-description { grid-column: 1 / -1; max-width: 50ch; } .dish-controls { justify-content: flex-start; } }
  @media (max-width: 700px) {
    .showcase { height: auto; min-height: 860px; }
    .showcase-heading { padding-top: 108px; }
    .showcase-heading h2 { font-size: 20px; }
    .dish-title { white-space: normal; font-size: clamp(2.9rem, 12vw, 5.5rem); line-height: .9; margin: 28px 12px 0; }
    .dish-stage { width: 88vw; flex: none; height: 330px; margin: -20px auto 16px; }
    .showcase-info { grid-template-columns: 1fr; gap: 24px; padding-bottom: 36px; }
    .dish-description { grid-column: auto; }
    .dish-order { justify-content: space-between; }
    .dish-controls { justify-content: center; order: 3; }
    .dish-peek { width: 28vw; top: 35%; }
    .previous { left: -16vw; } .next { right: -16vw; }
  }
</style>
