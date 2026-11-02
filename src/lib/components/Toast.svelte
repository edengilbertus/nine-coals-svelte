<script lang="ts">
  import { getCart } from '#lib/cart-context.ts';
  const cart = getCart();
</script>
<div class="notice-region" aria-live="polite" aria-atomic="true">
  {#if cart.notice}<div class="notice"><p>{cart.notice}</p><a href="/order">View order</a><button aria-label="Dismiss notification" onclick={() => { cart.notice = ''; }}>×</button></div>{/if}
</div>
<style>
  .notice-region { position: fixed; z-index: 90; bottom: 24px; right: var(--margin); left: auto; max-width: calc(100% - var(--margin) * 2); }
  .notice { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; padding: 12px 12px 12px 24px; border: 1px solid #85786c; border-radius: 12px; background: var(--ash); color: var(--ink); box-shadow: 0 12px 48px #0004; }
  .notice a { display: inline-flex; align-items: center; min-height: 44px; text-decoration: underline; text-underline-offset: 4px; font-weight: 500; }
  .notice button { width: 44px; height: 44px; font-size: 28px; }
  @media (max-width: 600px) { .notice-region { bottom: max(16px, env(safe-area-inset-bottom)); } .notice p { flex: 1 1 65%; } }
</style>
