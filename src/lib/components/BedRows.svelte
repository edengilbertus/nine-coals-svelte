<script lang="ts">
  import { beds } from '#lib/data/menu.ts';
</script>
<ul class="bed-rows">
  {#each beds as bed (bed.id)}
    <li style:--bed={bed.color} style:--bed-ink={bed.ink}><a href={`/menu#${bed.id}`}><span class="bed-name">{bed.name}</span><span class="bed-description">{bed.description}</span><span class="small temperature">{bed.temperature}</span></a></li>
  {/each}
</ul>
<style>
  li { position: relative; isolation: isolate; }
  li::before { content: ''; position: absolute; inset: 0; background: var(--bed); transform: scaleY(0); transform-origin: bottom; transition: transform .5s var(--ease); z-index: -1; }
  a { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; padding: 20px var(--margin); transition: color .25s; }
  .bed-name { min-width: 0; overflow-wrap: anywhere; font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 7rem); font-weight: 600; letter-spacing: -.04em; line-height: .9; text-transform: uppercase; }
  .temperature { white-space: nowrap; }
  .bed-description { max-width: 40ch; font-family: var(--font-accent); font-style: italic; font-size: clamp(20px, 2vw, 28px); opacity: 0; transition: opacity .3s; }
  li:hover::before, li:focus-within::before { transform: scaleY(1); }
  li:hover a, li:focus-within a { color: var(--bed-ink); }
  li:hover .bed-description, li:focus-within .bed-description { opacity: 1; }
  @media (max-width: 1000px) { .bed-description { display: none; } }
</style>
