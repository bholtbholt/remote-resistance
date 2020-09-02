<script type="text/typescript" lang="ts">
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { fly } from 'svelte/transition';
  import { blur } from './custom-transitions';

  import { leader } from '../stores/leader';
  import { players, teamMembers } from '../stores/player';
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
</script>

<div id="TeamBuildingForm" in:blur>
  <h2 class="heading text-gray-100 text-center">
    Team <span class="{teamNameColor} transition-colors duration-150"> {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))} </span>
  </h2>
  <h3 class="text-lg text-gray-500 text-center mb-lg">
    Picked by {$leader.name} for the {$currentRound.name} mission
  </h3>
  <ul id="playerList" class="grid {gridSize(playerVotes.length)} -mx-lg gap-xs">
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
  <div
    in:fly={{ y: 200, duration: 600, delay: 2000 }}
    on:introend={() => (teamNameColor = $teamVoteApproved ? 'text-success-300' : 'text-fail-300')}
    class="{$teamVoteApproved ? 'bg-success-200' : 'bg-fail-200'} rounded-lg shadow-xl mx-lg mb-xl -mt-lg
      p-md relative z-10 text-center">
    <h2 class="heading {$teamVoteApproved ? 'text-success-900' : 'text-fail-900'}">
      {$teamVoteApproved ? 'Approved' : 'Rejected'}
    </h2>
  </div>
</div>
