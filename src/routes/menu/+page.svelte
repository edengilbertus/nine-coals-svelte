<script lang="ts">
  import DishShowcase from '#lib/components/DishShowcase.svelte';
  import { beds, dishes, formatPrice } from '#lib/data/menu.ts';
  import { getCart } from '#lib/cart-context.ts';
  const cart = getCart();
</script>
<svelte:head><title>Menu | Nine Coals</title></svelte:head>
<h1 class="sr-only">Menu: tonight's signatures</h1>
<DishShowcase heading="Menu: tonight's signatures" />
<section class="full-menu wrap section">
  <div class="menu-intro"><h2 class="head">The whole menu,<br /><span class="accent">bed by bed</span></h2><p class="muted">Order for pickup from 17:30 until the fire is banked. Prices in rand, VAT included.<br /><span class="demo-note">Sample menu. Ordering is a local demo only.</span></p></div>
  <nav class="bed-navigation" aria-label="Coal beds">{#each beds as bed (bed.id)}<a href={`#${bed.id}`}>{bed.name}</a>{/each}</nav>
  <div class="menu-beds">
    {#each beds as bed (bed.id)}
      <section class="menu-bed" id={bed.id}>
        <div class="bed-intro"><h2>{bed.name}</h2><p class="small">{bed.temperature}</p><p class="muted">{bed.description}</p></div>
        <ul class="menu-items">{#each dishes.filter(dish => dish.bedId === bed.id) as dish (dish.id)}<li class="menu-item"><div><div class="item-top"><h3>{dish.name}</h3><p>{formatPrice(dish.price)}</p></div><p class="muted">{dish.description}</p></div><button class="btn outline" aria-label={`Add ${dish.name}`} disabled={!cart.ready} onclick={() => cart.add(dish.id)}>Add</button></li>{/each}</ul>
      </section>
    {/each}
  </div>
</section>
<style>
  .menu-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: end; }
  .menu-intro > p { max-width: 45ch; line-height: 1.6; justify-self: end; }
  .menu-intro .accent { color: var(--flame); }
  .bed-navigation { display: flex; flex-wrap: wrap; gap: 12px 28px; margin: 64px 0 32px; padding-bottom: 32px; border-bottom: 1px solid #62564b; }
  .bed-navigation a { min-height: 44px; display: inline-flex; align-items: center; }
  .bed-navigation a:hover { color: var(--flame); }
  .menu-bed { display: grid; grid-template-columns: 1fr 1.5fr; gap: 64px; padding-block: 64px; border-bottom: 1px solid #62564b; scroll-margin-top: 104px; }
  .bed-intro h2 { font-family: var(--font-display); font-weight: 500; font-size: clamp(2.5rem, 4vw, 4rem); line-height: 1; letter-spacing: -.035em; margin-bottom: 12px; }
  .bed-intro > p:last-child { max-width: 32ch; line-height: 1.6; margin-top: 24px; }
  .menu-items { display: grid; gap: 36px; }
  .menu-item { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start; }
  .item-top { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 12px; font-size: 22px; font-family: var(--font-display); }
  .item-top h3 { font-weight: 500; }
  .item-top > p { white-space: nowrap; }
  .menu-item .muted { line-height: 1.6; max-width: 52ch; }
  .menu-item .btn { min-height: 44px; padding: 10px 20px; }
  @media (max-width: 900px) { .menu-intro { grid-template-columns: 1fr; } .menu-intro > p { justify-self: start; } .menu-bed { grid-template-columns: 1fr 1.5fr; gap: 32px; } }
  @media (max-width: 650px) { .menu-bed { grid-template-columns: 1fr; gap: 32px; padding-block: 40px; } .bed-navigation { gap: 4px 24px; margin-top: 40px; } .menu-item { gap: 16px; } .item-top { font-size: 20px; } }
</style>
