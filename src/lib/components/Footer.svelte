<script lang="ts">
  let policy = $state('Privacy');
  let info!: HTMLDialogElement;
  const policies: Record<string, string> = {
    Privacy: 'This is a design prototype, not an operating restaurant. Form details stay in this browser session and are not sent to a restaurant or stored on a server. The map requests tiles from OpenStreetMap, and the typefaces load from Fontshare; both services receive your IP address. Your basket is saved on this device when browser storage is available.',
    Terms: 'Nine Coals is a sample brand for a design prototype. Menu prices, restaurant details, events and booking times are demonstration content copied from the reference. No real order, payment or reservation can be made here.',
    Cookies: 'This prototype does not set tracking cookies. It uses local storage only to remember the dishes and quantities in your basket. Clearing your browser site data removes that basket.'
  };
  function show(name: string) { policy = name; info.showModal(); }
</script>

<footer class="site-footer">
  <div class="footer-grid">
    <section><h2>Visit</h2><p>44 Ash Lane, Maboneng, Johannesburg</p><p>Tue to Sun, 17:30 to 22:30<br />Fire lit 15:00, banked 23:30</p></section>
    <section><h2>Eat</h2><a href="/menu">Menu</a><a href="/order">Order for pickup</a><a href="/reservations">Book a table</a><a href="/events">Events</a></section>
    <section><h2>Nine Coals</h2><a href="/story">Story</a><a href="/gallery">Gallery</a><a href="/contact">Find us</a></section>
    <section><h2>Write</h2><a href="mailto:fire@ninecoals.co.za">fire@ninecoals.co.za</a><a href="tel:+27115550139">+27 11 555 0139</a></section>
  </div>
  <p class="footer-wordmark giant" aria-hidden="true">nine coals</p>
  <div class="footer-bottom small muted">
    <p>© 2026 Nine Coals, a sample brand for a design prototype.</p>
    <div><a href="/credits">Photo credits</a><span aria-hidden="true">·</span>{#each ['Privacy', 'Terms', 'Cookies'] as name (name)}<button onclick={() => show(name)}>{name}</button>{/each}</div>
  </div>
</footer>
<dialog bind:this={info} aria-labelledby="policy-title"><h2 id="policy-title">{policy}</h2><p>{policies[policy]}</p><button class="btn" onclick={() => info.close()}>Close</button></dialog>

<style>
  .site-footer { padding: var(--section-gap) var(--margin) var(--margin); overflow: clip; }
  .footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 80px; }
  h2 { margin-bottom: 16px; font-family: var(--font-display); font-size: 18px; font-weight: 500; }
  section p, section a { font-size: 15px; color: var(--muted); line-height: 1.6; }
  section p + p { margin-top: 10px; }
  section a { display: flex; align-items: center; width: fit-content; min-height: 44px; }
  a:hover, button:hover { color: var(--ash); text-decoration: underline; text-underline-offset: 5px; }
  .footer-wordmark { font-size: clamp(5rem, 20.5vw, 24rem); color: #84786e; white-space: nowrap; margin-left: -.04em; }
  .footer-bottom { margin-top: 36px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
  .footer-bottom div { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
  .footer-bottom a, .footer-bottom button { display: inline-flex; align-items: center; min-height: 44px; padding: 0; font-size: inherit; }
  @media (max-width: 850px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px 24px; } }
  @media (max-width: 480px) { .footer-grid { margin-bottom: 48px; } .footer-grid section:first-child { grid-column: 1 / -1; } .footer-grid section:last-child { grid-column: 1 / -1; } .footer-bottom { margin-top: 24px; } }
</style>
