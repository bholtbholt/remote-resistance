<script type="text/typescript" lang="ts">
  import { fly, fade } from 'svelte/transition';

  import { playerIsLoggedIn } from '../stores/player';
  import { roundstate } from '../stores/round';

  import RoundTracker from './RoundTracker.svelte';
  import RevealRole from './RevealRole.svelte';
  import RoleCard from './RoleCard.svelte';
  import TeamBuildingForm from './TeamBuildingForm.svelte';
  import TeamBuildingVote from './TeamBuildingVote.svelte';
  import TeamBuildingReveal from './TeamBuildingReveal.svelte';

  let hideRoleReveal = window.sessionStorage.getItem('hideRoleReveal');
  function hideRoles() {
    hideRoleReveal = true;
    window.sessionStorage.setItem('hideRoleReveal', true);
  }

  $: blurredClasses = showPlayerCard ? 'transition-all duration-1000 ease-out blur opacity-50' : '';
  $: showPlayerCard = false;
  function toggleCardVisibility() {
    showPlayerCard = !showPlayerCard;
  }

  const phase = {
    TEAM_SELECTION: TeamBuildingForm,
    TEAM_VOTE: TeamBuildingVote,
    TEAM_REVEAL: TeamBuildingReveal,
  };
</script>

<div id="LobbyGame" class={blurredClasses} in:fade>
  <RoundTracker />
  {#if !hideRoleReveal && $playerIsLoggedIn}
    <RevealRole />
    <div class="mx-lg" in:fly={{ y: 200, duration: 600, delay: 3000 }}>
      <button on:click|preventDefault={hideRoles} class="btn-primary font-bold text-lg w-full">Start
        first round</button>
    </div>
  {/if}

  {#if hideRoleReveal || !$playerIsLoggedIn}
    <svelte:component this={phase[$roundstate]} />
  {/if}
</div>

{#if $playerIsLoggedIn && hideRoleReveal}
  <RoleCard on:click={toggleCardVisibility} showCard={showPlayerCard} />
{/if}
