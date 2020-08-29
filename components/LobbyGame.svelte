<script type="text/typescript" lang="ts">
  import { fly, fade } from 'svelte/transition';

  import RoundTracker from './RoundTracker.svelte';
  import RevealRole from './RevealRole.svelte';

  let showRoles = true;
</script>

<div id="LobbyGame" in:fade>
  <RoundTracker />
  {#if showRoles}
    <RevealRole />
    <div class="mx-lg" in:fly="{{ y: 200, duration: 600, delay: 3000 }}">
      <button on:click|preventDefault="{() => { showRoles = false }}"
        class="btn-primary font-bold text-lg w-full">Start first round</button>
    </div>
  {/if}
</div>
