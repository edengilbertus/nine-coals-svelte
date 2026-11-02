<script lang="ts">
  import GalleryDome from '#lib/components/GalleryDome.svelte';
  import { photos } from '#lib/data/content.ts';
</script>
<svelte:head><title>The room, the fire | Nine Coals</title></svelte:head>
<section class="gallery-page page-top"><div class="gallery-heading wrap"><h1 class="head">The room, <span class="accent">the fire</span></h1><p class="small muted">Drag to turn the dome. Click a photograph to open it.</p></div><GalleryDome {photos} /></section>
<style>
  .gallery-heading { display: flex; justify-content: space-between; align-items: end; gap: 36px; margin-bottom: 30px; }
  .gallery-heading .accent { color: var(--flame); }
  .gallery-heading > p { max-width: 25ch; }
  @media (max-width: 700px) { .gallery-heading { flex-direction: column; align-items: flex-start; gap: 24px; margin-bottom: 0; } .gallery-heading p { max-width: 35ch; } }
</style>
