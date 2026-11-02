<script lang="ts">
  import Image from './Image.svelte';
  let { photo, index, count, onclose, onprevious, onnext }: { photo: { src: string; alt: string }; index: number; count: number; onclose: () => void; onprevious: () => void; onnext: () => void } = $props();
  function open(dialog: HTMLDialogElement) {
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }
  function keyboard(event: KeyboardEvent) { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); (event.key === 'ArrowRight' ? onnext : onprevious)(); } }
</script>
<dialog class="photo-dialog" aria-label="Photograph viewer" {@attach open} oncancel={event => { event.preventDefault(); onclose(); }} onkeydown={keyboard}>
  <div class="dialog-top"><p class="small">{index + 1} of {count}</p><button class="round-button" aria-label="Close photograph" onclick={onclose}>×</button></div>
  <figure><Image src={photo.src} alt={photo.alt} class="lightbox-photo" eager /><figcaption><p>{photo.alt}</p><div><button class="round-button" aria-label="Previous photograph" onclick={onprevious}>‹</button><button class="round-button" aria-label="Next photograph" onclick={onnext}>›</button></div></figcaption></figure>
</dialog>
<style>
  .photo-dialog { width: 1200px; max-width: calc(100% - 40px); max-height: calc(100dvh - 40px); padding: 20px; background: var(--smoke); border-color: #85766b; }
  .photo-dialog::backdrop { background: #000e; }
  .dialog-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  figure { margin: 0; }
  figure :global(.lightbox-photo) { width: 100%; height: min(68svh, 750px); object-fit: contain; }
  figcaption { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-top: 20px; }
  figcaption div { display: flex; gap: 12px; }
  @media (max-width: 500px) { .photo-dialog { padding: 14px; max-width: calc(100% - 24px); } figure :global(.lightbox-photo) { height: 52svh; } figcaption { flex-wrap: wrap; } }
</style>
