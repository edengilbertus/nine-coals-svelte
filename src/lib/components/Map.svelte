<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  let loading = $state(true);
  let failed = $state(false);
  let retry = () => {};
  function mapAttachment(node: HTMLElement) {
    let cancelled = false;
    let map: import('leaflet').Map | undefined;
    let tiles: import('leaflet').TileLayer | undefined;
    async function initialize() {
      loading = true; failed = false;
      try {
        const L = await import('leaflet');
        if (cancelled) return;
        map?.remove();
        map = L.map(node, { scrollWheelZoom: false }).setView([-26.2044, 28.0593], 15);
        tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
        tiles.on('tileerror', () => { failed = true; loading = false; });
        tiles.on('load', () => { loading = false; });
        tiles.addTo(map);
        L.circleMarker([-26.2044, 28.0593], { radius: 12, color: '#ffb347', weight: 2, fillColor: '#ff4d1a', fillOpacity: 1 }).addTo(map).bindPopup('Nine Coals design prototype. Not a verified business location.');
      } catch { if (!cancelled) { failed = true; loading = false; } }
    }
    retry = () => { if (tiles) { loading = true; failed = false; tiles.redraw(); } else void initialize(); };
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void initialize(); } }, { rootMargin: '200px' });
    observer.observe(node);
    return () => { cancelled = true; observer.disconnect(); map?.remove(); };
  }
</script>
<div class="map-frame"><div class="map-canvas" aria-label="Map of Maboneng, Johannesburg" {@attach mapAttachment}></div>{#if loading}<p class="map-message small" role="status">Loading the map…</p>{/if}{#if failed}<div class="map-message"><p class="small">Some map tiles could not be loaded. The map is unavailable in places; use the directions link.</p><button class="text-link" onclick={() => retry()}>Retry map</button></div>{/if}</div>
<style>
  .map-frame { position: relative; height: 100%; min-height: 400px; background: #24211d; }
  .map-canvas { height: 100%; min-height: 400px; z-index: 0; }
  .map-canvas :global(.leaflet-tile-pane) { filter: invert(1) hue-rotate(180deg) brightness(.65) contrast(1.3); }
  .map-canvas :global(.leaflet-control-zoom a) { width: 44px; height: 44px; line-height: 44px; }
  .map-canvas :global(.leaflet-control-attribution) { color: #141110; background: #e8e6e3; }
  .map-canvas :global(.leaflet-control-attribution a) { color: #194e7e; }
  .map-message { position: absolute; z-index: 2; inset: auto 20px 36px; padding: 16px 20px; border: 1px solid #8d8074; border-radius: 8px; color: var(--ash); background: var(--char); max-width: 480px; }
  .map-message button { margin-top: 8px; text-decoration: underline; text-underline-offset: 4px; }
</style>
