<script lang="ts">
  import { onMount } from 'svelte';
  let status = $state('The fire is lit at 15:00 every afternoon.');
  let lit = $state(false);
  onMount(() => {
    function update() {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
      const minutes = Number(part('hour')) * 60 + Number(part('minute'));
      lit = part('weekday') !== 'Mon' && minutes >= 900 && minutes < 1410;
      status = part('weekday') === 'Mon' ? 'No fire on Mondays. Lit again tomorrow at 15:00.' : lit ? 'The fire is lit. Come and sit by it.' : 'The fire is lit at 15:00 every afternoon.';
    }
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  });
</script>
<p class="fire-status small" aria-live="polite"><span class={['status-dot', { lit }]} aria-hidden="true"></span>{status}</p>
<style>
  .fire-status { display: flex; align-items: center; gap: 10px; }
  .status-dot { flex-shrink: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--muted); }
  .status-dot.lit { background: var(--flame); }
</style>
