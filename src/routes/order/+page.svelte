<script lang="ts">
  import { tick } from 'svelte';
  import { getCart } from '#lib/cart-context.ts';
  import { dishes, formatPrice } from '#lib/data/menu.ts';
  import { serviceTimes, validPhone } from '#lib/booking.ts';
  import Image from '#lib/components/Image.svelte';
  const cart = getCart();
  const items = $derived(cart.lines.map(line => ({ ...line, dish: dishes.find(dish => dish.id === line.dishId)! })));
  let name = $state('');
  let phone = $state('');
  let pickup = $state('');
  let error = $state('');
  let busy = $state(false);
  let receipt = $state<{ total: number; time: string; names: string[] } | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    error = !name.trim() ? 'Please enter your name.' : !validPhone(phone) ? 'Please enter a valid mobile number.' : !serviceTimes.includes(pickup) ? 'Please choose a pickup time.' : cart.lines.length === 0 ? 'Add a dish before placing your demo order.' : '';
    if (error) return;
    busy = true;
    await tick();
    receipt = { total: cart.total, time: pickup, names: items.map(item => `${item.quantity} × ${item.dish.name}`) };
    cart.clear(); name = ''; phone = ''; pickup = ''; busy = false;
  }
</script>
<svelte:head><title>Your order | Nine Coals</title></svelte:head>
<section class="order-page page-top wrap">
  <h1 class="head">Your <span class="accent">order</span></h1>
  {#if !cart.ready}
    <p class="empty-copy lead" role="status">Loading your saved basket…</p>
  {:else if receipt}
    <div class="order-confirmation" role="status"><p class="accent">Something for the fire.</p><h2>Your demo order is ready.</h2><p class="lead">Pickup at {receipt.time} · {formatPrice(receipt.total)}</p><ul>{#each receipt.names as item (item)}<li>{item}</li>{/each}</ul><p class="demo-note"><strong>Demo only.</strong> No order has been placed, no payment taken and no details sent to a restaurant.</p></div><a class="btn" href="/menu">Choose another dish</a>
  {:else if cart.lines.length === 0}
    <div class="empty-order"><p class="lead">Nothing on the grill yet.</p><a class="btn" href="/menu">Choose from the menu</a></div>
  {:else}
    <p class="order-note demo-note">Local demo only. Choose your dishes and try the pickup flow. Nothing is sent or charged.</p>
    {#if cart.storageError}<p class="storage-note" role="note">{cart.storageError}</p>{/if}
    <div class="order-grid">
      <div><ul class="order-items">{#each items as item (item.dishId)}<li class="order-item">{#if item.dish.image}<Image src={item.dish.image} alt="" class="order-dish" />{/if}<div class="item-details"><h2>{item.dish.name}</h2><p class="muted small">{formatPrice(item.dish.price)} each</p><div class="quantity-controls"><button class="round-button" aria-label={`Decrease ${item.dish.name}`} onclick={() => cart.setQuantity(item.dishId, item.quantity - 1)}>−</button><span>{item.quantity}</span><button class="round-button" aria-label={`Increase ${item.dish.name}`} disabled={item.quantity >= 99} onclick={() => cart.setQuantity(item.dishId, item.quantity + 1)}>+</button><button class="remove-item text-link" aria-label={`Remove ${item.dish.name}`} onclick={() => cart.remove(item.dishId)}>Remove</button></div></div><p class="line-price">{formatPrice(item.dish.price * item.quantity)}</p></li>{/each}</ul><div class="basket-actions"><a class="text-link" href="/menu">Add more from the menu</a><button class="text-link" onclick={() => cart.clear()}>Clear order</button></div></div>
      <form class="pickup-card" novalidate onsubmit={submit}><h2>Pickup details</h2><div class="form-grid"><label class="field">Your name<input autocomplete="name" required maxlength="120" bind:value={name} /></label><label class="field">Mobile number<input type="tel" autocomplete="tel" required maxlength="30" bind:value={phone} /></label><label class="field">Pickup time<select required bind:value={pickup}><option value="" disabled>Choose a time</option>{#each serviceTimes as time (time)}<option value={time}>{time}</option>{/each}</select></label></div><div class="order-total"><span>Total</span><p data-testid="cart-total">{formatPrice(cart.total)}</p></div><p class="small muted">Prices in rand, VAT included.</p>{#if error}<p class="error" role="alert">{error}</p>{/if}<button class="btn submit-order" type="submit" disabled={busy}>{busy ? 'Preparing confirmation…' : 'Place demo order'}</button><p class="demo-note">Demo only. No real order or payment.</p></form>
    </div>
  {/if}
</section>
<style>
  .order-page { min-height: 70svh; padding-top: 128px; padding-bottom: 40px; }
  h1 .accent, .order-confirmation .accent { color: var(--flame); }
  .empty-order { display: grid; justify-items: start; gap: 32px; padding-block: 80px; }
  .empty-copy { padding-block: 80px; }
  .order-note { margin-top: 36px; max-width: 65ch; }
  .storage-note { margin-top: 20px; padding: 16px 20px; border: 1px solid #a2907e; border-radius: 6px; max-width: 70ch; color: var(--flame); }
  .order-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; margin-top: 40px; align-items: start; }
  .order-item { display: flex; gap: 24px; align-items: center; padding-block: 28px; border-bottom: 1px solid #6b5d51; }
  .order-item :global(.order-dish) { width: 120px; height: 120px; object-fit: contain; flex-shrink: 0; }
  .item-details { flex: 1; min-width: 0; }
  h2 { font-family: var(--font-display); font-size: 26px; font-weight: 500; }
  .item-details .muted { margin-top: 8px; }
  .quantity-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 20px; }
  .quantity-controls .round-button { height: 44px; width: 44px; font-size: 22px; }
  .quantity-controls > span { min-width: 16px; text-align: center; font-variant-numeric: tabular-nums; }
  .remove-item { color: var(--muted); font-size: 14px; }
  .line-price { align-self: flex-start; padding-top: 8px; white-space: nowrap; font-family: var(--font-display); font-size: 26px; }
  .basket-actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px; margin-top: 20px; }
  .pickup-card { padding: 32px; border-radius: 20px; background: var(--char); }
  .pickup-card h2 { margin-bottom: 28px; }
  .order-total { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin: 32px 0 8px; font-family: var(--font-display); font-size: 28px; }
  .submit-order { width: 100%; margin: 28px 0 16px; }
  .pickup-card .error { margin-top: 20px; }
  .order-confirmation { display: grid; gap: 24px; padding-block: 60px 32px; max-width: 65ch; }
  .order-confirmation .accent { font-size: 36px; }
  .order-confirmation ul { display: grid; gap: 12px; }
  @media (max-width: 1000px) { .order-grid { gap: 32px; } .order-item { gap: 16px; } .order-item :global(.order-dish) { width: 84px; height: 100px; } .line-price { font-size: 22px; } }
  @media (max-width: 800px) { .order-grid { grid-template-columns: 1fr; } .pickup-card { max-width: 600px; } }
  @media (max-width: 450px) { .order-item { flex-wrap: wrap; gap: 12px; } .order-item :global(.order-dish) { width: 72px; } .line-price { margin-left: auto; } .pickup-card { padding: 24px; } }
</style>
