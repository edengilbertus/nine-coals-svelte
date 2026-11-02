<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Image from '#lib/components/Image.svelte';
  import { serviceDates, serviceTimes, validateBookingStep, type BookingValues, type ServiceDate } from '#lib/booking.ts';
  import { createMotion, gsap } from '#lib/motion.ts';
  let values = $state<BookingValues>({ date: '', guests: 2, time: '', name: '', phone: '' });
  let dates = $state<ServiceDate[]>([]);
  let step = $state(0);
  let reached = $state(0);
  let expanded = $state(false);
  let error = $state('');
  let ready = $state(false);
  let busy = $state(false);
  let confirmed = $state(false);
  const visibleDates = $derived(dates.slice(0, expanded ? dates.length : 14));
  const selectedDate = $derived(dates.find(date => date.value === values.date)?.label ?? values.date);
  const steps = ['Day', 'Guests', 'Time', 'Details'];
  function refreshDates() {
    if (confirmed) return;
    const next = serviceDates(new Date());
    dates = next;
    if (values.date && !next.some(date => date.value === values.date)) {
      values.date = '';
      step = 0;
      error = 'The date you selected is no longer available. Choose another service day.';
    }
  }
  onMount(() => {
    refreshDates();
    ready = true;
    const timer = window.setInterval(refreshDates, 60000);
    const onVisibility = () => { if (document.visibilityState === 'visible') refreshDates(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', refreshDates);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', refreshDates);
    };
  });
  function introduce(node: HTMLElement) { return createMotion(node, () => { gsap.from(node, { y: 25, opacity: 0, duration: .7, ease: 'power3.out' }); }).destroy; }
  function go(target: number) {
    if (target > step) {
      error = validateBookingStep(target - 1, values, new Date()) ?? '';
      if (error) return;
    }
    step = target; reached = Math.max(reached, target); error = '';
  }
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    if (step < 3) { go(step + 1); return; }
    error = validateBookingStep(3, values, new Date()) ?? '';
    if (error) return;
    busy = true;
    await tick();
    confirmed = true;
    busy = false;
    values.name = ''; values.phone = '';
  }
  function restart() {
    values = { date: '', guests: 2, time: '', name: '', phone: '' };
    dates = serviceDates(new Date()); step = 0; reached = 0; error = ''; confirmed = false;
  }
</script>
<svelte:head><title>Book a table | Nine Coals</title></svelte:head>
<section class="booking-shell page-top wrap">
  <div class="booking-intro"><h1 class="head">A table <span class="accent">by the fire</span></h1><p class="intro-copy muted">Tables from 17:30, Tuesday to Sunday, up to 30 days ahead. For nine or more, write to <a href="mailto:fire@ninecoals.co.za">fire@ninecoals.co.za</a>.</p><Image src="/media/match-flame.jpg" alt="" class="match-photo" eager /></div>
  <div class="booking-card" {@attach introduce}>
    {#if confirmed}
      <div class="booking-confirmation" role="status"><p class="accent">A place by the fire.</p><h2>Your demo table is ready.</h2><p class="lead">{values.guests} {values.guests === 1 ? 'guest' : 'guests'} · {selectedDate} · {values.time}</p><p class="demo-note"><strong>Demo only.</strong> No reservation has been made and no details were sent to a restaurant.</p></div>
      <button class="btn" onclick={restart}>Start another booking</button>
    {:else}
      <nav class="booking-progress" aria-label="Booking steps">{#each steps as label, i (label)}<button type="button" aria-label={`Step ${i + 1}: ${label}`} aria-current={step === i ? 'step' : undefined} disabled={i > reached || !ready} class={{ complete: i <= step }} onclick={() => go(i)}></button>{/each}</nav>
      <form novalidate onsubmit={submit}>
        <div class="step-content">
          {#if step === 0}
            <h2>Which day?</h2>
            {#if !ready}<p role="status" class="muted">Loading demo dates…</p>{:else if dates.length === 0}<p role="alert">Dates could not be prepared. Please reload this page.</p>{:else}<div class="date-grid">{#each visibleDates as date (date.value)}<button type="button" class="date-choice" aria-pressed={values.date === date.value} onclick={() => { values.date = date.value; error = ''; }}>{date.label}</button>{/each}</div>{#if dates.length > 14}<button class="more-dates text-link" type="button" aria-expanded={expanded} onclick={() => { expanded = !expanded; }}>{expanded ? 'Show fewer dates' : 'Show more dates'}</button>{/if}{/if}
          {:else if step === 1}
            <h2>How many?</h2><div class="guest-control"><button type="button" class="round-button" aria-label="One fewer guest" disabled={values.guests <= 1} onclick={() => { values.guests--; }}>−</button><p data-testid="guest-count">{values.guests}</p><button type="button" class="round-button" aria-label="One more guest" disabled={values.guests >= 8} onclick={() => { values.guests++; }}>+</button></div><p class="small muted">For nine or more, <a class="text-link" href="mailto:fire@ninecoals.co.za">write to us</a>.</p>
          {:else if step === 2}
            <h2>What time?</h2><div class="date-grid time-grid">{#each serviceTimes as time (time)}<button type="button" aria-pressed={values.time === time} onclick={() => { values.time = time; error = ''; }}>{time}</button>{/each}</div><p class="demo-note time-note">Demo availability, not live restaurant availability.</p>
          {:else}
            <h2>Your details</h2><div class="form-grid"><label class="field">Your name<input autocomplete="name" maxlength="120" required bind:value={values.name} /></label><label class="field">Mobile number<input type="tel" autocomplete="tel" maxlength="30" required bind:value={values.phone} /></label></div><p class="booking-summary">{values.guests} {values.guests === 1 ? 'guest' : 'guests'} · {selectedDate} · {values.time}</p>
          {/if}
          {#if error}<p class="error" role="alert">{error}</p>{/if}
          <p class="demo-note disclosure">Local demo only. Nothing is booked or sent.</p>
        </div>
        <div class="step-actions"><button class="back-button text-link" type="button" disabled={step === 0 || busy} onclick={() => go(step - 1)}>Back</button><button class="btn" type="submit" disabled={!ready || busy}>{step === 3 ? busy ? 'Preparing confirmation…' : 'Book demo table' : 'Next'}</button></div>
      </form>
    {/if}
  </div>
</section>
<style>
  .booking-shell { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 64px; padding-top: 128px; min-height: 100svh; }
  .booking-intro h1 { white-space: nowrap; }
  .accent { color: var(--flame); }
  .intro-copy { max-width: 44ch; font-size: 18px; line-height: 1.6; margin-top: 30px; }
  .booking-intro :global(.match-photo) { width: min(100%, 600px); height: 64svh; object-fit: contain; margin-top: 30px; mix-blend-mode: lighten; mask-image: linear-gradient(transparent, #000 12%, #000 85%, transparent); }
  .booking-card { width: 100%; max-width: 440px; padding: 20px; border: 1px solid #51464d; border-radius: 28px; background: #1f1d22; box-shadow: 0 18px 40px #0004; }
  .booking-progress { display: flex; gap: 6px; margin: -8px 0 4px; }
  .booking-progress button { position: relative; flex: 1; height: 44px; padding: 0; opacity: 1; }
  .booking-progress button::after { content: ''; position: absolute; inset: 18px 0 auto; height: 4px; border-radius: 2px; background: #736871; }
  .booking-progress button.complete::after { background: var(--ember); }
  h2 { font-family: var(--font-display); font-size: 24px; font-weight: 500; margin-bottom: 26px; }
  .date-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .date-grid button { min-height: 46px; padding: 10px 7px; border: 1px solid #8b7c70; border-radius: 999px; background: #28221e; font-size: 14px; }
  .date-grid button:hover { background: #42372e; }
  .date-grid button[aria-pressed='true'] { border-color: var(--ember); background: var(--ember); color: var(--ink); }
  .more-dates { font-size: 13px; margin-top: 8px; text-decoration: underline; text-underline-offset: 3px; }
  .step-actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 20px; }
  .step-actions .btn { min-height: 44px; padding: 10px 18px; font-size: 14px; }
  .back-button { padding: 0 10px; }
  .back-button:disabled { visibility: hidden; }
  .guest-control { display: flex; justify-content: center; align-items: center; gap: 28px; padding: 20px 0 30px; }
  .guest-control > p { font-family: var(--font-display); font-size: 100px; line-height: 1; font-variant-numeric: tabular-nums; }
  .booking-summary { margin-top: 24px; color: var(--flame); font-size: 15px; }
  .error, .time-note { margin-top: 20px; }
  .disclosure { margin-top: 16px; font-size: 12px; }
  .booking-confirmation { display: grid; gap: 24px; margin-bottom: 28px; }
  .booking-confirmation .accent { font-size: 30px; }
  .booking-confirmation h2 { margin: 0; }
  @media (max-width: 1150px) { .booking-intro h1 { white-space: normal; } .booking-shell { gap: 40px; } }
  @media (max-width: 760px) { .booking-shell { grid-template-columns: 1fr; gap: 40px; min-height: auto; padding-top: 120px; padding-bottom: 30px; } .booking-intro :global(.match-photo) { display: none; } .booking-card { max-width: 100%; } .intro-copy { font-size: 16px; } }
  @media (max-width: 380px) { .date-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .booking-card { padding: 18px; } }
</style>
