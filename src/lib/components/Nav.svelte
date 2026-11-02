<script lang="ts">
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getCart } from '#lib/cart-context.ts';
  const cart = getCart();
  let open = $state(false);
  let ready = $state(false);
  let menu!: HTMLDialogElement;
  let toggle!: HTMLButtonElement;
  const links = [['Menu', '/menu'], ['Story', '/story'], ['Gallery', '/gallery'], ['Events', '/events'], ['Find us', '/contact']];
  function close() { menu?.close(); open = false; }
  function show() { open = true; menu.showModal(); }
  onMount(() => { ready = true; });
  afterNavigate(({ from }) => { if (from) close(); });
</script>

<header class="site-nav">
  <a class="wordmark" href="/" aria-label="Nine Coals, home">nine <span class="accent">coals</span></a>
  <nav aria-label="Main" class="desktop-nav">
    {#each links as [label, href] (href)}
      <a class="text-link" {href} aria-current={page.url.pathname === href ? 'page' : undefined}>{label}</a>
    {/each}
  </nav>
  <div class="nav-actions">
    <a class="text-link order-link" href="/order">Order{#if cart.count}<span class="cart-count" aria-label={`${cart.count} items`}>{cart.count}</span>{/if}</a>
    <a class="btn book-link" href="/reservations">Book a table</a>
    <button bind:this={toggle} class="menu-toggle" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded={open} disabled={!ready} onclick={show}>
      <span>Menu</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h18M3 16h18" /></svg>
    </button>
  </div>
</header>
<dialog bind:this={menu} class="mobile-menu" onclose={() => { open = false; toggle?.focus(); }} aria-label="Site navigation">
  <div class="menu-top"><span class="wordmark">nine <span class="accent">coals</span></span><button class="round-button" aria-label="Close menu" onclick={close}>×</button></div>
  <nav id="mobile-nav" aria-label="Mobile">
    {#each [...links, ['Order', '/order'], ['Book a table', '/reservations']] as [label, href] (href)}
      <a {href} onclick={close} aria-current={page.url.pathname === href ? 'page' : undefined}>{label}</a>
    {/each}
  </nav>
  <p class="small muted">One wood fire. Nine beds of coal.<br />Johannesburg.</p>
</dialog>

<style>
  .site-nav { position: fixed; inset: 0 0 auto; height: 76px; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-inline: var(--margin); background: #0d0c0beF; backdrop-filter: blur(12px); }
  .wordmark { display: inline-flex; align-items: center; min-height: 44px; font-family: var(--font-display); font-size: 22px; font-weight: 600; letter-spacing: -.035em; white-space: nowrap; }
  .wordmark .accent { color: var(--ember); letter-spacing: -.04em; }
  .desktop-nav { display: flex; gap: 32px; font-size: 15px; }
  .desktop-nav a[aria-current]::after { background: var(--ember); }
  .nav-actions { display: flex; align-items: center; gap: 14px; font-size: 15px; }
  .cart-count { margin-left: 7px; color: var(--flame); font-variant-numeric: tabular-nums; }
  .book-link { min-height: 44px; padding: 10px 20px; font-size: 15px; }
  .menu-toggle { display: none; align-items: center; justify-content: center; gap: 7px; min-height: 44px; padding: 0; }
  .mobile-menu { max-width: none; width: 100%; height: 100dvh; max-height: none; margin: 0; padding: var(--margin); border: 0; border-radius: 0; background: var(--smoke); }
  .menu-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 38px; }
  .mobile-menu nav { display: grid; gap: 10px; margin-bottom: 40px; }
  .mobile-menu nav a { min-height: 48px; font-family: var(--font-display); font-size: clamp(1.75rem, 6vw, 3rem); }
  .mobile-menu nav a[aria-current] { color: var(--flame); }
  @media (max-width: 1000px) { .desktop-nav { gap: 20px; } }
  @media (max-width: 800px) { .desktop-nav { display: none; } .menu-toggle { display: flex; } }
  @media (max-width: 460px) { .order-link { display: none; } .nav-actions { gap: 12px; } .menu-toggle span { font-size: 11px; } .menu-toggle { flex-direction: column-reverse; gap: 0; } .book-link { padding-inline: 17px; } }
</style>
