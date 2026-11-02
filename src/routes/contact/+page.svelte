<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Map from '#lib/components/Map.svelte';
  import FireStatus from '#lib/components/FireStatus.svelte';
  let email = $state('');
  let message = $state('');
  let error = $state('');
  let confirmed = $state(false);
  let busy = $state(false);
  let ready = $state(false);
  onMount(() => { ready = true; });
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address.' : !message.trim() ? 'Please write a message.' : '';
    if (error) return;
    busy = true; await tick(); confirmed = true; busy = false; email = ''; message = '';
  }
</script>
<svelte:head><title>Find the smoke | Nine Coals</title></svelte:head>
<section class="contact-page"><div class="contact-copy"><h1 class="head">Find <span class="accent">the smoke</span></h1><p class="address lead">44 Ash Lane, Maboneng,<br />Johannesburg</p><FireStatus /><div class="button-row"><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=-26.2044,28.0593" target="_blank" rel="noreferrer">Directions</a><a class="btn ghost" href="tel:+27115550139">Call +27 11 555 0139</a></div><dl class="visit-details"><div><dt>Kitchen</dt><dd>Tue to Sun, 17:30 to 22:30</dd></div><div><dt>The fire</dt><dd>Lit 15:00, banked 23:30</dd></div><div><dt>Parking</dt><dd>Secure lot on Fox Street</dd></div><div><dt>Write</dt><dd><a href="mailto:fire@ninecoals.co.za">fire@ninecoals.co.za</a></dd></div></dl><form class="message-card" novalidate onsubmit={submit}>{#if confirmed}<div role="status"><h2>Message prepared.</h2><p class="demo-note"><strong>Demo only.</strong> Your message was not sent. No personal details have been stored.</p></div><button class="btn" type="button" onclick={() => { confirmed = false; }}>Write another demo</button>{:else}<h2>Send a message</h2><div class="form-grid"><label class="field">Email<input type="email" autocomplete="email" maxlength="254" required bind:value={email} /></label><label class="field">Message<textarea maxlength="4000" required bind:value={message}></textarea></label></div>{#if error}<p class="error" role="alert">{error}</p>{/if}<button class="btn" type="submit" disabled={!ready || busy}>{busy ? 'Preparing message…' : 'Send demo message'}</button><p class="demo-note">Local demo only. Messages are not sent.</p>{/if}</form><p class="demo-note location-note">Restaurant details are fictional content from the reference design prototype.</p></div><div class="map-column"><Map /></div></section>
<style>
  .contact-page { display: grid; grid-template-columns: 43% 57%; padding-top: 96px; align-items: start; }
  .contact-copy { padding: 64px var(--margin) 0; }
  h1 .accent { color: var(--flame); }
  .address { margin-top: 38px; }
  .contact-copy :global(.fire-status) { margin-top: 28px; }
  .button-row { margin-top: 32px; }
  .visit-details { display: grid; grid-template-columns: 1fr 1fr; gap: 28px 24px; margin-block: 48px; font-size: 14px; }
  dt { color: var(--muted); margin-bottom: 8px; }
  dd { margin: 0; line-height: 1.6; }
  dd a { display: inline-flex; align-items: center; min-height: 44px; margin-top: -12px; }
  .message-card { padding: 32px; border-radius: 28px; background: var(--char); }
  .message-card h2 { font-family: var(--font-display); font-size: 26px; font-weight: 500; margin-bottom: 24px; }
  .message-card .btn { margin-top: 24px; }
  .message-card .demo-note { margin-top: 16px; }
  .error { margin-top: 20px; }
  .location-note { margin-top: 24px; }
  .map-column { position: sticky; top: 96px; height: calc(100svh - 96px); min-height: 500px; }
  @media (max-width: 1100px) { .contact-page { grid-template-columns: 50% 50%; } .contact-copy { padding-top: 36px; } .visit-details { grid-template-columns: 1fr; gap: 22px; } }
  @media (max-width: 760px) { .contact-page { grid-template-columns: 1fr; padding-top: 96px; gap: 40px; } .contact-copy { padding-top: 24px; } .map-column { position: relative; top: 0; min-height: 0; height: 460px; margin-inline: var(--margin); } .visit-details { grid-template-columns: 1fr 1fr; margin-block: 36px; } .message-card { padding: 24px; border-radius: 18px; } }
  @media (max-width: 370px) { .visit-details { grid-template-columns: 1fr; } }
</style>
