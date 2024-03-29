<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { quartIn } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';
  import { blur } from './custom-transitions';

  import { leader, previousLeader } from '../stores/leader';
  import { players, playerIsLeader, playerIsTeamMember, teamMembers } from '../stores/player';
  import { currentRound, teamBuildingFailure } from '../stores/round';
  import { team, teamVoteApproved, teamVotes } from '../stores/team';

  import PlayerInline from './PlayerInline.svelte';
  import UIHeading from './UIHeading.svelte';
  import UIButton from './UIButton.svelte';
  import { gridSize, toSentance } from './view-helper';

  let teamNameColor;
  $: playerVotes = $teamVotes.map((teamVote) => {
    const player = $players.find((player) => player.id === teamVote.playerId);
    const teamMember = $team.includes(player.id);

    return { vote: teamVote.vote, teamMember, ...player };
  });
  $: leaderName = $teamVoteApproved ? $leader.name : $previousLeader.name;

  function pickNewTeam() {
    socket.emit('teamvote::reset');
    socket.emit('team::reset');
    socket.emit('phase::set', 'TEAM_SELECTION');
  }

  function startMission() {
    socket.emit('phase::set', 'MISSION_START');
  }

  function endGame() {
    socket.emit('appstate::reset');
    socket.emit('missionvote::reset');
    socket.emit('team::reset');
    socket.emit('teamvote::reset');
    socket.emit('phase::set', 'TEAM_SELECTION');
    socket.emit('rounds::reset');
  }
</script>

<div id="PhaseTeamReveal" in:blur>
  <UIHeading>
    Team <span class="{teamNameColor} transition-colors duration-150">
      {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))}
    </span>
    <span slot="subheading">
      Picked by {leaderName} for the {$currentRound.name} mission
    </span>
  </UIHeading>
  <ul id="playerList" class="grid {gridSize(playerVotes.length)} gap-2 mb-10">
    {#each playerVotes as player}
      <li
        class="p-1 rounded-lg text-center
          bg-white dark:bg-gray-700 shadow"
        class:ring-teal-400={player.teamMember}
        class:ring={player.teamMember}
      >
        <div class="py-2 text-5xl">{player.vote}</div>
        <PlayerInline avatar={player.avatar} name={player.name} truncate={true} />
      </li>
    {/each}
  </ul>
  {#if $teamBuildingFailure}
    <h2
      in:scale={{ start: 4, duration: 800, delay: 2000, easing: quartIn }}
      on:introend={() => (teamNameColor = 'text-red-300')}
      class="text-4xl font-semibold text-center text-white dark:text-purple-50 mb-2"
    >
      Spies win
    </h2>
    <div class="mt-6" in:fade={{ delay: 3000 }}>
      <UIButton on:click={endGame}>Start a new game</UIButton>
    </div>
  {:else if $teamVoteApproved}
    <h2
      in:scale={{ start: 4, duration: 800, delay: 2000, easing: quartIn }}
      on:introend={() => (teamNameColor = 'text-blue-300')}
      class="text-4xl font-semibold text-center text-white dark:text-purple-50 mb-2"
    >
      Approved
    </h2>
    {#if $playerIsTeamMember}
      <div class="mt-6" in:fade={{ delay: 3000 }}>
        <UIButton on:click={startMission}>Start mission</UIButton>
      </div>
    {:else}
      <h3 class="text-2xl text-center text-rose-100 dark:text-purple-50" in:fade={{ delay: 3000 }}>
        Waiting for {toSentance($teamMembers.map((teamMember) => teamMember.name))} to start the mission
      </h3>
    {/if}
  {:else}
    <h2
      in:scale={{ start: 4, duration: 800, delay: 2000, easing: quartIn }}
      on:introend={() => (teamNameColor = 'text-red-300')}
      class="text-4xl font-semibold text-center text-white dark:text-purple-50 mb-2"
    >
      Rejected
    </h2>
    {#if $playerIsLeader}
      <div class="mt-6 mb-4" in:fade={{ delay: 3000 }}>
        <UIButton on:click={pickNewTeam}>Pick a new team</UIButton>
      </div>
    {:else}
      <h3 class="text-2xl text-center text-rose-100 dark:text-purple-50" in:fade={{ delay: 3000 }}>
        {$leader.name} is the new leader
      </h3>
    {/if}
    {#if $currentRound.failedTeamVotes === $currentRound.permittedTeamVoteFails}
      <h4 class="text-center text-rose-100 dark:text-purple-50" in:fade={{ delay: 3000 }}>
        <strong class="font-bold">Spies win</strong> if the next team is rejected
      </h4>
    {/if}
  {/if}
</div>
