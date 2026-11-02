<script lang="ts">
  import Image from '#lib/components/Image.svelte';
  import { events } from '#lib/data/content.ts';
  import { createMotion, gsap } from '#lib/motion.ts';
  function turn(node: HTMLElement) { return createMotion(node, () => { gsap.fromTo(node.querySelectorAll('.event-photograph'), { rotateY: 22, rotateX: 10 }, { rotateY: -18, rotateX: -5, stagger: .15, ease: 'none', scrollTrigger: { trigger: node, start: 'top top', end: 'bottom bottom', scrub: 1 } }); }).destroy; }
</script>
<svelte:head><title>Around the fire, events | Nine Coals</title></svelte:head>
<section class="events-page wrap" {@attach turn}>
  <div class="event-photographs" aria-hidden="true"><div class="event-photograph"><Image src="/media/dining-candles.jpg" alt="" /></div><div class="event-photograph"><Image src="/media/steak-tongs.jpg" alt="" /></div><div class="event-photograph"><Image src="/media/embers-coals.jpg" alt="" /></div><div class="event-photograph"><Image src="/media/chef-flames.jpg" alt="" /></div></div>
  <div class="events-copy"><h1 class="head">Around <span class="accent">the fire</span></h1><ul>{#each events as event (event.title)}<li><h2>{event.title}</h2><p class="event-when">{event.when}</p><p class="event-description">{event.text}</p><a class="btn ghost" href="/reservations">Reserve a seat</a></li>{/each}</ul><p class="demo-note">Sample events for the Nine Coals design prototype. Bookings are local demos.</p></div>
</section>
<style>
  .events-page { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; padding-top: 220px; padding-bottom: 120px; background: #2b0e09; }
  h1 { margin-bottom: 70px; }
  .accent, .event-when { color: var(--flame); }
  .events-copy li { margin-bottom: 80px; max-width: 50ch; }
  .events-copy h2 { font-family: var(--font-display); font-size: clamp(2rem, 3.8vw, 3.5rem); font-weight: 600; letter-spacing: -.04em; line-height: .95; text-transform: uppercase; }
  .event-when { font-size: 18px; margin-top: 18px; }
  .event-description { font-size: 18px; line-height: 1.6; color: #c9bdb3; margin-block: 18px 24px; }
  .event-photographs { display: flex; flex-direction: column; align-items: center; gap: 110px; perspective: 900px; margin-top: -120px; }
  .event-photograph { width: min(78%, 340px); height: 360px; transform: rotateY(18deg) rotateX(8deg); transform-origin: center; }
  .event-photograph:nth-child(even) { align-self: flex-start; margin-left: 15%; }
  .event-photograph :global(img) { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 1000px) { .events-page { gap: 40px; padding-top: 160px; } .event-photographs { margin-top: 0; gap: 90px; } .event-photograph { height: 320px; } }
  @media (max-width: 700px) { .events-page { grid-template-columns: 1fr; padding-top: 130px; padding-bottom: 60px; } .event-photographs { display: none; } h1 { margin-bottom: 56px; } .events-copy li { margin-bottom: 56px; } .events-copy li::after { content: ''; display: block; height: 180px; margin-top: 32px; background: url('/media/hearth-meat.jpg') center / cover; } .events-copy li:nth-child(2)::after { background-image: url('/media/steak-tongs.jpg'); } .events-copy li:nth-child(3)::after { background-image: url('/media/dining-candles.jpg'); } .events-copy li:nth-child(4)::after { background-image: url('/media/chef-flames.jpg'); } }
</style>
