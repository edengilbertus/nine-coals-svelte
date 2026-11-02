<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { gsap } from '#lib/motion.ts';
  import Image from './Image.svelte';
  import PhotoDialog from './PhotoDialog.svelte';
  let { photos }: { photos: { src: string; alt: string }[] } = $props();
  let yaw = $state(0);
  let accessibleYaw = $state(0);
  let ready = $state(false);
  let list = $state(false);
  let selected = $state(-1);
  let active = $state('3-18');
  let dragging = false;
  let dragged = false;
  let startX = 0;
  let origin = 0;
  const pose = { yaw: 0 };
  const radians = Math.PI / 180;
  const tiles = $derived(Array.from({ length: 252 }, (_, i) => {
    const row = Math.floor(i / 36), column = i % 36, longitude = column * 10 - 180, latitude = row * 18 - 54 + (column % 2 ? 9 : 0);
    return { id: `${row}-${column}`, row, column, longitude, latitude, photo: (column + row * 7) % photos.length, x: Math.sin(longitude * radians) * Math.cos(latitude * radians), y: Math.sin(latitude * radians) * .55, z: Math.cos(longitude * radians) * Math.cos(latitude * radians) };
  }));
  function front(longitude: number) { return Math.cos((longitude + accessibleYaw) * radians) > .1; }
  function settle(target: number) {
    gsap.killTweensOf(pose);
    accessibleYaw = target;
    active = `3-${((Math.round((180 - target) / 10) % 36) + 36) % 36}`;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { yaw = target; pose.yaw = target; return; }
    pose.yaw = yaw;
    gsap.to(pose, { yaw: target, duration: .65, ease: 'power3.out', onUpdate: () => { yaw = pose.yaw; } });
  }
  function down(event: PointerEvent) { gsap.killTweensOf(pose); dragging = true; dragged = false; startX = event.clientX; origin = yaw; }
  function drag(event: PointerEvent) {
    if (!dragging) return;
    if (event.buttons === 0) { up(); return; }
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 8) {
      dragged = true;
      if (event.isTrusted) {
        try { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); } catch { /* A release can beat capture. */ }
      }
      yaw = origin + distance * .14; pose.yaw = yaw;
    }
  }
  function up() { if (!dragging) return; dragging = false; accessibleYaw = yaw; active = `3-${((Math.round((180 - yaw) / 10) % 36) + 36) % 36}`; }
  async function keyboard(event: KeyboardEvent, row: number, column: number) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const nextColumn = (column + (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0) + 36) % 36;
    const nextRow = Math.max(0, Math.min(6, row + (event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0)));
    settle(180 - nextColumn * 10);
    active = `${nextRow}-${nextColumn}`;
    await tick();
    document.querySelector<HTMLButtonElement>(`[data-tile="${active}"]`)?.focus({ preventScroll: true });
  }
  onMount(() => {
    let alive = true;
    const release = () => up();
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    Promise.all(photos.map(photo => {
      const image = new window.Image();
      image.src = photo.src;
      return image.decode().catch(() => {});
    })).then(() => { if (alive) ready = true; });
    return () => {
      alive = false;
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  });
  onDestroy(() => gsap.killTweensOf(pose));
</script>

<div class={['dome-viewport', { ready }]} role="group" aria-label="Rotating photo gallery. Use arrow keys on a photograph to move." data-yaw={yaw} data-ready={ready} onpointerdown={down} onpointermove={drag} onpointerup={up} onpointercancel={() => { dragging = false; }}>
  {#if !ready}<p class="gallery-loading small" role="status">Loading photographs…</p>{/if}
  <div class="dome-world" style:--yaw={`${yaw}deg`}>
    {#each tiles as tile (tile.id)}
      <button class="dome-tile" data-tile={tile.id} aria-label={`Open photo: ${photos[tile.photo].alt}`} aria-hidden={!front(tile.longitude)} inert={!front(tile.longitude)} tabindex={active === tile.id && front(tile.longitude) ? 0 : -1} disabled={!ready} style:transform={`translate3d(calc(var(--radius) * ${tile.x}), calc(var(--radius) * ${tile.y}), calc(var(--radius) * ${tile.z})) rotateY(${tile.longitude}deg) rotateX(${-tile.latitude * .45}deg)`} onclick={event => { if (event.detail === 0 || !dragged) selected = tile.photo; }} onkeydown={event => keyboard(event, tile.row, tile.column)}><Image src={photos[tile.photo].src} alt="" class="dome-image" eager decoding="sync" /></button>
    {/each}
  </div>
</div>
<div class="gallery-tools wrap"><div><button class="round-button" aria-label="Rotate gallery left" disabled={!ready} onclick={() => settle(yaw - 25)}>‹</button><button class="round-button" aria-label="Rotate gallery right" disabled={!ready} onclick={() => settle(yaw + 25)}>›</button></div><button class="text-link" aria-expanded={list} disabled={!ready} onclick={() => { list = !list; }}>{list ? 'Hide photo list' : 'Show photo list'}</button></div>
{#if list}<div class="photo-list wrap">{#each photos as photo, i (photo.src)}<button aria-label={`Open photo: ${photo.alt}`} onclick={() => { selected = i; }}><Image src={photo.src} alt={photo.alt} /><span>{photo.alt}</span></button>{/each}</div>{/if}
{#if selected >= 0}<PhotoDialog photo={photos[selected]} index={selected} count={photos.length} onclose={() => { selected = -1; }} onprevious={() => { selected = (selected + photos.length - 1) % photos.length; }} onnext={() => { selected = (selected + 1) % photos.length; }} />{/if}

<style>
  .dome-viewport { --radius: clamp(300px, 58vw, 840px); --tile: clamp(50px, 9vw, 130px); position: relative; height: min(76svh, 800px); min-height: 560px; overflow: clip; perspective: 2000px; perspective-origin: 50% 50%; touch-action: pan-y; cursor: grab; isolation: isolate; }
  .dome-viewport:active { cursor: grabbing; }
  .dome-world { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform-style: preserve-3d; transform: translateZ(calc(var(--radius) * -1)) rotateY(var(--yaw)); opacity: .2; }
  .ready .dome-world { opacity: 1; }
  .gallery-loading { position: absolute; z-index: 2; top: 48%; left: 0; right: 0; text-align: center; }
  .dome-tile { position: absolute; width: var(--tile); height: var(--tile); left: calc(var(--tile) * -.5); top: calc(var(--tile) * -.5); padding: 0; border-radius: 16px; overflow: clip; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .dome-tile :global(.dome-image) { width: 100%; height: 100%; object-fit: cover; user-select: none; pointer-events: none; }
  .dome-tile:hover { box-shadow: 0 0 0 3px var(--flame); }
  .dome-tile:focus-visible { outline-offset: -5px; }
  .gallery-tools { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-top: 24px; }
  .gallery-tools > div { display: flex; gap: 14px; }
  .photo-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px 24px; margin-top: 48px; }
  .photo-list button { padding: 0; text-align: left; }
  .photo-list :global(img) { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }
  .photo-list span { display: block; margin-top: 14px; line-height: 1.5; }
  @media (max-width: 900px) { .photo-list { grid-template-columns: repeat(3, minmax(0, 1fr)); } .dome-viewport { min-height: 500px; } }
  @media (max-width: 600px) { .dome-viewport { height: 480px; min-height: 0; perspective: 1000px; } .dome-tile { border-radius: 8px; } .photo-list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 16px; } }
</style>
