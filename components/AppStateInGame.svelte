<script>
  import { fly, fade } from 'svelte/transition';

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
  import UIButton from './UIButton.svelte';

  let hideRoleReveal = window.sessionStorage.getItem('hideRoleReveal');
  function hideRoles() {
    hideRoleReveal = true;
    window.sessionStorage.setItem('hideRoleReveal', true);
  }

  // toggleCardVisibility is in AppStateInGame so everything behind the card is blurred
  $: blurredClasses = showPlayerCard ? 'transition-all duration-1000 ease-out blur opacity-50' : '';
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

<div id="AppStateInGame" class={blurredClasses} in:fade>
  <RoundTracker />
  {#if !hideRoleReveal && $playerIsLoggedIn}
    <PhaseRoleReveal />
    <div class="mt-8" in:fly={{ y: 200, duration: 600, delay: 3000 }}>
      <UIButton on:click={hideRoles}>Got it!</UIButton>
    </div>
  {/if}

  {#if hideRoleReveal || !$playerIsLoggedIn}
    <svelte:component this={phases[$phase]} />
  {/if}
</div>

{#if $playerIsLoggedIn && hideRoleReveal}
  <RoleCard on:click={toggleCardVisibility} showCard={showPlayerCard} />
{/if}
