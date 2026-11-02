<script lang="ts">
  import { credits } from '#lib/data/credits.ts';
</script>
<svelte:head><title>Photo credits | Nine Coals</title></svelte:head>
<section class="credits-page page-top wrap"><h1 class="head">Photo credits</h1><p class="lead credits-intro">Stand-in photographs from Unsplash and Wikimedia Commons for this design prototype. They show the world of open-fire cooking, not Nine Coals itself.</p><ul class="credits-list">{#each credits as credit (credit.url)}<li>“{credit.title}” by {credit.author}, {credit.license}. <a href={credit.url} target="_blank" rel="noreferrer">Source</a></li>{/each}</ul><section class="font-credits"><h2>Type & map</h2><p>Clash Display and General Sans by Indian Type Foundry, via <a href="https://www.fontshare.com/" target="_blank" rel="noreferrer">Fontshare</a>. Instrument Serif by Rodrigo Fuenzalida and Jordan Egstad, <a href="/fonts/instrument-serif-OFL.txt">SIL Open Font License 1.1</a>. Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.</p><p>Bread background removal/cutout from the reference is a CC BY-SA 4.0 derivative. Full source and license notes are recorded in <code>ASSET-LICENSES.md</code>.</p></section></section>
<style>
  .credits-page { padding-top: 128px; max-width: 1100px; }
  .credits-intro { max-width: 58ch; margin-block: 40px 48px; }
  .credits-list { display: grid; gap: 20px; max-width: 85ch; line-height: 1.65; }
  .credits-list a, .font-credits a { display: inline-flex; align-items: center; min-height: 44px; color: var(--flame); text-decoration: underline; text-underline-offset: 4px; }
  .font-credits { margin-top: 64px; line-height: 1.7; color: var(--muted); }
  .font-credits h2 { font-family: var(--font-display); font-size: 28px; color: var(--ash); font-weight: 500; margin-bottom: 20px; }
  .font-credits p + p { margin-top: 20px; }
  code { overflow-wrap: anywhere; }
</style>
