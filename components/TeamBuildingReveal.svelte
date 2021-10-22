<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { quartIn } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';
  import { blur } from './custom-transitions';

  import { leader, previousLeader } from '../stores/leader';
  import { players, playerIsLeader, playerIsTeamMember, teamMembers } from '../stores/player';
  import { currentRound } from '../stores/round';
  import { team, teamVoteApproved, teamVotes } from '../stores/team';

  import { gridSize, toSentance } from './view-helper';

  let teamNameColor;
  $: playerVotes = $teamVotes.map((teamVote) => {
    const player = $players.find((player) => player.id === teamVote.playerId);
    const teamMember = $team.includes(player.id);
    const svgClass = teamVote.vote === '👎' ? 'transform scale-x-flip' : '';
    const svgY = teamVote.vote === '👎' ? '78%' : '74%';

    return { vote: teamVote.vote, svgClass, svgY, teamMember, ...player };
  });
  $: leaderName = $teamVoteApproved ? $leader.name : $previousLeader.name;

  function pickNewTeam() {
    socket.emit('teamvote::reset');
    socket.emit('team::reset');
    socket.emit('roundstate::set', 'TEAM_SELECTION');
  }

  function startMission() {
    socket.emit('roundstate::set', 'MISSION_START');
  }
</script>

<div id="TeamBuildingReveal" in:blur>
  <h2 class="text-gray-100 text-center">
    Team <span class="{teamNameColor} transition-colors duration-150"> {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))} </span>
  </h2>
  <h3 class="text-lg text-gray-500 text-center mb-lg">
    Picked by {leaderName} for the {$currentRound.name} mission
  </h3>
  <ul id="playerList" class="grid {gridSize(playerVotes.length)} -mx-md gap-xs">
    {#each playerVotes as player}
      <li class="text-center bg-white rounded-sm pt-sm" class:outline={player.teamMember}>
        <div class="truncate px-xs text-gray-700" class:font-extrabold={player.teamMember}>
          {player.avatar}
          {player.name}
        </div>
        <svg viewBox="0 0 25 25" class="-mt-md {player.svgClass}">
          <text x="50%" y={player.svgY} class="align-middle overflow-visible text-anchor-middle">
            {player.vote}
          </text>
        </svg>
      </li>
    {/each}
  </ul>
  {#if $teamVoteApproved}
    <div
      in:scale={{ start: 4, duration: 800, delay: 2000, easing: quartIn }}
      on:introend={() => (teamNameColor = 'text-success-300')}
      class="rounded-lg shadow-xl mx-lg mb-lg -mt-lg p-md relative z-10 text-center bg-success-200">
      <h2 class="text-success-900">Approved</h2>
    </div>
    {#if $playerIsTeamMember}
      <div class="mx-xl" in:fade={{ delay: 3000 }}>
        <button class="btn-success text-lg w-full" on:click={startMission}>Start mission</button>
      </div>
    {/if}
  {:else}
    <div
      in:scale={{ start: 4, duration: 800, delay: 2000, easing: quartIn }}
      on:introend={() => (teamNameColor = 'text-fail-300')}
      class="rounded-lg shadow-xl mx-lg mb-lg -mt-lg p-md relative z-10 text-center bg-fail-200">
      <h2 class="text-fail-900">Rejected</h2>
    </div>
    {#if $playerIsLeader}
      <div class="mx-xl" in:fade={{ delay: 3000 }}>
        <button class="btn-fail text-lg w-full" on:click={pickNewTeam}>Pick a new team</button>
      </div>
    {:else}
      <h3 class="text-gray-500 text-center" in:fade={{ delay: 3000 }}>
        {$leader.name} is the new leader
      </h3>
    {/if}
  {/if}
</div>
