<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  type Props = Omit<HTMLImgAttributes, 'src' | 'alt' | 'class'> & { src: string; alt: string; class?: string; eager?: boolean };
  let { src, alt, class: className = '', eager = false, decoding = 'async', ...rest }: Props = $props();
  let failedSrc = $state<string | null>(null);
  function inspectImage(node: HTMLImageElement) {
    if (node.complete && node.naturalWidth === 0) failedSrc = src;
  }
</script>

{#if failedSrc === src}
  <span class={['image-fallback', className]} role="img" aria-label={alt || 'Photograph unavailable'}>Photograph unavailable{#if alt}<span>{alt}</span>{/if}</span>
{:else}
  <img {...rest} {src} {alt} class={className} loading={eager ? 'eager' : 'lazy'} {decoding} {@attach inspectImage} onerror={() => { failedSrc = src; }} />
{/if}
