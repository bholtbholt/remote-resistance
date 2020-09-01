<script type="text/typescript" lang="ts">
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
    teamMembers,
  } from '../stores/player';
  import { leader } from '../stores/leader';
  import { currentRound } from '../stores/round';
  import { teamVotes } from '../stores/team';

  import Spinner from './Spinner.svelte';
  import { toSentance } from './view-helper';

  let playerVote;
  $: voteOptions = [
    {
      value: '👎',
      id: 'vote-reject',
      label: 'Reject',
      labelClass: 'text-fail-400',
      selected: playerVote === '👎',
      border: 'border-fail-500',
      svgClass: 'transform scale-x-flip',
      y: '80%',
      rotateDeg: -18,
      rotateX: -60,
    },
    {
      value: '👍',
      id: 'vote-approve',
      label: 'Approve',
      labelClass: 'text-success-400',
      selected: playerVote === '👍',
      border: 'border-success-500',
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
    socket.emit('roundstate::set', 'TEAM_REVEAL');
  }
</script>

<div id="TeamBuildingVote" in:fade>
  <h2 class="heading text-gray-100 text-center">
    Vote for team
    <span class="text-success-300">
      {toSentance($teamMembers.map(teamMember => `${teamMember.avatar} ${teamMember.name}`))}
    </span>
  </h2>
  <h3 class="text-lg text-gray-500 text-center mb-xl">
    Picked by {$leader.name} for the {$currentRound.name} mission
  </h3>

  {#if $playerIsLoggedIn && !$playerHasVoted}
    <form on:submit|preventDefault="{submitVote}">
      <div class="grid grid-cols-2 mb-xl gap-lg">
        {#each voteOptions as vote }
          <label for="{vote.id}"
            in:rotate="{{ deg: vote.rotateDeg, x: vote.rotateX, y: 20 }}"
            class:opacity-50="{playerVote && !vote.selected}"
            class="relative text-center cursor-pointer">
            <input id="{vote.id}"
              class="absolute bottom-0 right-0 opacity-0"
              type="radio"
              name="vote"
              bind:group={playerVote}
              value={vote.value}>
            <div class="mb-md rounded-round
              transition-border duration-150 ease-out
              border-solid {vote.selected ? `${vote.border} border-lg` : 'border-transparent border'}">
              <svg viewBox="0 0 20 20"
                class="shadow rounded-round bg-gray-900 {vote.svgClass}
                transition-border duration-150 ease-out
                border-solid border-transparent {vote.selected ? 'border' : 'border-lg'}">
                <text x="50%" y="{vote.y}" class="align-middle overflow-visible text-anchor-middle">
                  {vote.value}
                </text>
              </svg>
            </div>

            <div class="uppercase text-lg tracking-widest {vote.labelClass}">{vote.label}</div>
          </label>
        {/each}
      </div>

      {#if playerVote}
        <button class="btn-primary font-bold text-lg w-full" in:fly="{{ y: 200, duration: 600 }}">
          {voteOptions.find((vote) => vote.value === playerVote).label} this team
        </button>
      {/if}
    </form>
  {:else if $allPlayersHaveVoted && $playerIsLeader}
    <div in:fly="{{ y: 200, duration: 600 }}"
      class="bg-white rounded-lg shadow-xl mx-lg mb-xl p-md relative z-10 text-center">
      <h2 class="heading text-primary-500 mb-lg">
        Are votes are in!
      </h2>
      <button on:click="{revealVotes}"
        class="btn-primary font-bold text-lg w-full">
        Reveal votes
      </button>
    </div>
  {:else}
    <div in:fly="{{ y: 200, duration: 600 }}"
      class="bg-success-200 rounded-lg shadow-xl mx-lg mb-xl p-md relative z-10 flex items-center">
      <Spinner color="text-success-700" margins="mr-md" />
      <h2 class="text-lg text-success-900">
        Waiting for vote results
      </h2>
    </div>
  {/if}
</div>
