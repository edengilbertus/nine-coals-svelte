<script lang="ts">
  import '../app.css';
  import Nav from '#lib/components/Nav.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import Toast from '#lib/components/Toast.svelte';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { Cart } from '#lib/cart.svelte.ts';
  import { setCart } from '#lib/cart-context.ts';
  import { afterNavigate } from '$app/navigation';
  let { children }: { children: Snippet } = $props();
  const cart = setCart(new Cart());
  onMount(() => cart.restore());
  afterNavigate(({ from }) => { if (from) cart.notice = ''; });
</script>
<svelte:head>
  <title>Nine Coals, open-fire grill, Johannesburg</title>
  <meta name="description" content="One wood fire, lit at three every afternoon, raked into nine beds of coal. A restaurant design prototype." />
  <link rel="icon" href="/favicon.ico" />
</svelte:head>
<a class="skip-link btn" href="#main">Skip to content</a>
<Nav />
<main id="main">{@render children()}</main>
<Footer />
<Toast />
