<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { fade, fly } from 'svelte/transition';
  import { rotate } from './custom-transitions';

  import {
    allPlayersHaveVoted,
    currentPlayer,
    playerHasVoted,
    playerIsLeader,
    playerIsLoggedIn,
    players,
    teamMembers,
  } from '../stores/player';
  import { leader } from '../stores/leader';
  import { currentRound } from '../stores/round';
  import { teamVoteApproved } from '../stores/team';

  import Spinner from './Spinner.svelte';
  import { toSentance } from './view-helper';

  let playerVote;
  $: voteOptions = [
    {
      value: '👎',
      id: 'vote-reject',
      label: 'Reject',
      labelClass: 'text-red-400',
      selected: playerVote === '👎',
      border: 'border-red-500',
      svgClass: 'transform scale-x-flip',
      y: '80%',
      rotateDeg: -18,
      rotateX: -60,
    },
    {
      value: '👍',
      id: 'vote-approve',
      label: 'Approve',
      labelClass: 'text-blue-400',
      selected: playerVote === '👍',
      border: 'border-blue-500',
      svgClass: '',
      y: '74%',
      rotateDeg: 18,
      rotateX: 60,
    },
  ];

  function submitVote() {
    socket.emit('teamvote::cast', { playerId: $currentPlayer.id, vote: playerVote });
  }

  function revealVotes() {
    if (!$teamVoteApproved) {
      const update = {
        failedTeamVotes: $currentRound.failedTeamVotes + 1,
      };

      socket.emit('rounds::update', [$currentRound.index, update]);
      socket.emit('leader::change', [$players, $leader.id]);
    }
    socket.emit('roundstate::set', 'TEAM_REVEAL');
  }
</script>

<div id="TeamBuildingVote" in:fade>
  <h2 class="text-gray-100 text-center">
    Vote for team <span class="text-blue-300">
      {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))}
    </span>
  </h2>
  <h3 class="text-lg text-gray-500 text-center">
    Picked by {$leader.name} for the {$currentRound.name} mission
  </h3>

  {#if $playerIsLoggedIn && !$playerHasVoted}
    <form on:submit|preventDefault={submitVote}>
      <div class="grid grid-cols-2 gap-lg">
        {#each voteOptions as vote}
          <label
            for={vote.id}
            in:rotate={{ deg: vote.rotateDeg, x: vote.rotateX, y: 20 }}
            class:opacity-50={playerVote && !vote.selected}
            class="relative text-center cursor-pointer"
          >
            <input
              id={vote.id}
              class="absolute bottom-0 right-0 opacity-0"
              type="radio"
              name="vote"
              bind:group={playerVote}
              value={vote.value}
            />
            <div
              class="rounded-round transition-border duration-150 ease-out border-solid {vote.selected
                ? `${vote.border} border-lg`
                : 'border-transparent border'}"
            >
              <svg
                viewBox="0 0 20 20"
                class="shadow rounded-round bg-gray-900 {vote.svgClass} transition-border duration-150
                  ease-out border-solid border-transparent {vote.selected ? 'border' : 'border-lg'}"
              >
                <text x="50%" y={vote.y} class="align-middle overflow-visible text-anchor-middle">
                  {vote.value}
                </text>
              </svg>
            </div>

            <div class="uppercase text-lg tracking-widest {vote.labelClass}">{vote.label}</div>
          </label>
        {/each}
      </div>

      {#if playerVote}
        <button class="btn-primary font-bold text-lg w-full" in:fly={{ y: 200, duration: 600 }}>
          {voteOptions.find((vote) => vote.value === playerVote).label} this team
        </button>
      {/if}
    </form>
  {:else if $allPlayersHaveVoted && $playerIsLeader}
    <div
      in:fly={{ y: 200, duration: 600 }}
      class="bg-white rounded-lg shadow-xl relative z-10 text-center"
    >
      <h2 class="text-primary-500 ">Are votes are in!</h2>
      <button on:click={revealVotes} class="btn-primary font-bold text-lg w-full">
        Reveal votes
      </button>
    </div>
  {:else}
    <div
      in:fly={{ y: 200, duration: 600 }}
      class="bg-blue-200 rounded-lg shadow-xl relative z-10 flex items-center"
    >
      <Spinner color="text-blue-700" />
      <h2 class="text-lg text-blue-900">Waiting for vote results</h2>
    </div>
  {/if}
</div>
