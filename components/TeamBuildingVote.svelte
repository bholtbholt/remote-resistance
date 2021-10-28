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

  import UIBanner from './UIBanner.svelte';
  import UIButton from './UIButton.svelte';
  import UISpinner from './UISpinner.svelte';
  import UIHeading from './UIHeading.svelte';
  import { toSentance } from './view-helper';

  let playerVote;
  $: voteOptions = [
    {
      value: '👎',
      id: 'vote-reject',
      label: 'Reject',
      labelClass: 'text-rose-500',
      selected: playerVote === '👎',
      border: 'ring-rose-500 ring-offset-rose-500',
      emojiClass: 'transform scale-x-flip',
      rotateDeg: -18,
      rotateX: -90,
    },
    {
      value: '👍',
      id: 'vote-approve',
      label: 'Approve',
      labelClass: 'text-sky-400',
      selected: playerVote === '👍',
      border: 'ring-sky-400 ring-offset-sky-400',
      emojiClass: '',
      rotateDeg: 18,
      rotateX: 90,
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
  <UIHeading>
    Vote for team <span class="text-teal-400">
      {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))}
    </span>
    <span slot="subheading">
      Picked by {$leader.name} for the {$currentRound.name} mission
    </span>
  </UIHeading>

  {#if $playerIsLoggedIn && !$playerHasVoted}
    <form on:submit|preventDefault={submitVote}>
      <div class="flex justify-center gap-6 mb-10">
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
              class:scale-110={vote.selected}
              class:scale-90={playerVote && !vote.selected}
              class:ring-offset-4={vote.selected}
              class="text-8xl pt-6 pb-2 px-3 rounded-lg
                ring {vote.border}
                bg-white dark:bg-gray-700
                transition-all duration-500 ease-out"
            >
              <div class="{vote.emojiClass} mb-5">{vote.value}</div>
              <div class="text-lg font-medium {vote.labelClass}">{vote.label}</div>
            </div>
          </label>
        {/each}
      </div>

      {#if playerVote}
        <div in:fly={{ y: 200, duration: 600 }}>
          {#if playerVote === '👍'}
            <UIButton theme="sky">Approve this team</UIButton>
          {:else if playerVote === '👎'}
            <UIButton theme="rose">Reject this team</UIButton>
          {/if}
        </div>
      {/if}
    </form>
  {:else if $allPlayersHaveVoted && $playerIsLeader}
    <div in:fly={{ y: 200, duration: 600 }} class="text-center">
      <h2 class="text-4xl font-semibold text-white dark:text-purple-50 mb-6">Are votes are in!</h2>
      <UIButton on:click={revealVotes}>Reveal votes</UIButton>
    </div>
  {:else}
    <div in:fly={{ y: 200, duration: 600 }}>
      <UIBanner>Waiting for vote results</UIBanner>
    </div>
  {/if}
</div>
