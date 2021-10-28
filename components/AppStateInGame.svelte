<script>
  import { fly, fade } from 'svelte/transition';

  import { playerIsLoggedIn } from '../stores/player';
  import { roundstate } from '../stores/round';

  import RoundTracker from './RoundTracker.svelte';
  import RevealRole from './RevealRole.svelte';
  import RoleCard from './RoleCard.svelte';
  import PhaseTeamSelection from './PhaseTeamSelection.svelte';
  import PhaseTeamVote from './PhaseTeamVote.svelte';
  import PhaseTeamReveal from './PhaseTeamReveal.svelte';
  import Mission from './Mission.svelte';
  import MissionReveal from './MissionReveal.svelte';
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

  const phase = {
    TEAM_SELECTION: PhaseTeamSelection,
    TEAM_VOTE: PhaseTeamVote,
    TEAM_REVEAL: PhaseTeamReveal,
    MISSION_START: Mission,
    MISSION_REVEAL: MissionReveal,
  };
</script>

<div id="AppStateInGame" class={blurredClasses} in:fade>
  <RoundTracker />
  {#if !hideRoleReveal && $playerIsLoggedIn}
    <RevealRole />
    <div class="mt-8" in:fly={{ y: 200, duration: 600, delay: 3000 }}>
      <UIButton on:click={hideRoles}>Got it!</UIButton>
    </div>
  {/if}

  {#if hideRoleReveal || !$playerIsLoggedIn}
    <svelte:component this={phase[$roundstate]} />
  {/if}
</div>

{#if $playerIsLoggedIn && hideRoleReveal}
  <RoleCard on:click={toggleCardVisibility} showCard={showPlayerCard} />
{/if}
