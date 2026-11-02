<script lang="ts">
  import { page } from '$app/state';
</script>
<svelte:head><title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} | Nine Coals</title></svelte:head>
<section class="page-top wrap section error-page">
  <p class="small muted">{page.status}</p>
  <h1 class="head">{page.status === 404 ? 'Page not found.' : 'The fire needs a moment.'}</h1>
  <p class="lead">{page.status === 404 ? 'There is nothing cooking at this address.' : 'We could not load this page. Please try again.'}</p>
  <a class="btn" href="/">Back to the fire</a>
</section>
<style>.error-page { min-height: 70svh; display: grid; align-content: center; justify-items: start; gap: 28px; }</style>
