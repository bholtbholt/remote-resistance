<script>
  import { fade } from 'svelte/transition';

  import { playerIsLoggedIn } from '../stores/player';
  import { phase } from '../stores/phase';

  import RoundTracker from './RoundTracker.svelte';
  import PhaseRoleReveal from './PhaseRoleReveal.svelte';
  import RoleCard from './RoleCard.svelte';
  import PhaseTeamSelection from './PhaseTeamSelection.svelte';
  import PhaseTeamVote from './PhaseTeamVote.svelte';
  import PhaseTeamReveal from './PhaseTeamReveal.svelte';
  import PhaseMission from './PhaseMission.svelte';
  import PhaseMissionReveal from './PhaseMissionReveal.svelte';

  let hideRoleReveal = window.sessionStorage.getItem('hideRoleReveal');
  function hideRoles() {
    hideRoleReveal = true;
    window.sessionStorage.setItem('hideRoleReveal', true);
  }

  // toggleCardVisibility is in AppStateInGame so everything behind the card is blurred
  $: blurGame = $playerIsLoggedIn && (showPlayerCard || !hideRoleReveal);
  $: showPlayerCard = false;
  function toggleCardVisibility() {
    showPlayerCard = !showPlayerCard;
  }

  const phases = {
    TEAM_SELECTION: PhaseTeamSelection,
    TEAM_VOTE: PhaseTeamVote,
    TEAM_REVEAL: PhaseTeamReveal,
    MISSION_START: PhaseMission,
    MISSION_REVEAL: PhaseMissionReveal,
  };
</script>

<div
  id="AppStateInGame"
  class={blurGame && 'transition-all duration-1000 ease-out blur opacity-50'}
  in:fade
>
  <RoundTracker />
  <svelte:component this={phases[$phase]} />
</div>

{#if $playerIsLoggedIn}
  {#if hideRoleReveal}
    <RoleCard on:click={toggleCardVisibility} showCard={showPlayerCard} />
  {:else}
    <PhaseRoleReveal on:click={hideRoles} />
  {/if}
{/if}
