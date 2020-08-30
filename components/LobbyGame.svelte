<script type="text/typescript" lang="ts">
  import { fly, fade } from 'svelte/transition';

  import RoundTracker from './RoundTracker.svelte';
  import RevealRole from './RevealRole.svelte';
  import TeamBuilding from './TeamBuilding.svelte';

  let hideRoleReveal = window.sessionStorage.getItem('hideRoleReveal');
  function hideRoles() {
    hideRoleReveal = true;
    window.sessionStorage.setItem('hideRoleReveal', true);
  }
</script>

<div id="LobbyGame" in:fade>
  <RoundTracker />
  {#if hideRoleReveal}
    <TeamBuilding />
  {:else}
    <RevealRole />
    <div class="mx-lg" in:fly="{{ y: 200, duration: 600, delay: 3000 }}">
      <button on:click|preventDefault="{hideRoles}"
        class="btn-primary font-bold text-lg w-full">Start first round</button>
    </div>
  {/if}
</div>
