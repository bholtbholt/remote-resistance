<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { fade, fly } from 'svelte/transition';
  import { rotate } from './custom-transitions';

  import { leader } from '../stores/leader';
  import { missionIsComplete, missionPassed, missionVotes } from '../stores/mission';
  import {
    currentPlayer,
    playerHasCompletedMission,
    playerIsASpy,
    playerIsLeader,
    playerIsTeamMember,
    players,
    teamMembers,
  } from '../stores/player';
  import { currentRound } from '../stores/round';
  import { team } from '../stores/team';

  import Player from './Player.svelte';
  import UISpinner from './UISpinner.svelte';
  import { gridSize, toSentance } from './view-helper';

  let playerVote;
  $: voteOptions = [
    {
      value: 'fail',
      id: 'vote-fail',
      label: 'Fail',
      defaultColor: 'text-red-600 bg-red-200',
      selectedColor: 'bg-red-600 text-red-200',
      selected: playerVote === 'fail',
      disabled: !$playerIsASpy,
      rotateDeg: -18,
      rotateX: -60,
      origin: 'origin-left',
    },
    {
      value: 'pass',
      id: 'vote-pass',
      label: 'Pass',
      defaultColor: 'text-blue-700 bg-blue-200',
      selectedColor: 'bg-blue-600 text-blue-200',
      selected: playerVote === 'pass',
      disabled: false,
      rotateDeg: 18,
      rotateX: 60,
      origin: 'origin-right',
    },
  ];

  function submitVote() {
    socket.emit('missionvote::cast', { playerId: $currentPlayer.id, vote: playerVote });
  }

  function revealVotes() {
    const update = {
      missionPhase: {
        team: $team,
        votes: $missionVotes,
        result: $missionPassed ? 'successful' : 'failed',
      },
    };
    socket.emit('rounds::update', [$currentRound.index, update]);
    socket.emit('leader::change', [$players, $leader.id]);
    socket.emit('roundstate::set', 'MISSION_REVEAL');
  }
</script>

<div id="Mission" in:fade>
  {#if $playerIsTeamMember}
    <h2 class="text-gray-100 text-center">Pass or fail this mission</h2>
    <h3 class="text-lg text-gray-500 text-center">
      <!-- prettier-ignore -->
      {#if $playerIsASpy}
        Spies may pass or fail
      {:else}
        Resistance must pass
      {/if}
    </h3>
    {#if !$playerHasCompletedMission}
      <form on:submit|preventDefault={submitVote}>
        <div class="grid grid-cols-2 gap-lg">
          {#each voteOptions as vote}
            <label
              for={vote.id}
              in:rotate={{ deg: vote.rotateDeg, x: vote.rotateX, y: 20 }}
              class:opacity-25={(playerVote && !vote.selected) || vote.disabled}
              class:cursor-pointer={!vote.disabled}
              class:cursor-not-allowed={vote.disabled}
              class:scale-110={vote.selected}
              class:scale-90={playerVote && !vote.selected}
              class="{vote.selected
                ? vote.selectedColor
                : vote.defaultColor} transition duration-150
                transform relative rounded-lg shadow text-center text-xl font-extrabold uppercase
                tracking-widest {vote.origin}"
            >
              <input
                id={vote.id}
                class="absolute bottom-0 right-0 opacity-0"
                type="radio"
                name="vote"
                bind:group={playerVote}
                disabled={vote.disabled}
                value={vote.value}
              />
              {vote.label}
            </label>
          {/each}
        </div>

        {#if playerVote}
          <button class="btn-primary font-bold text-lg w-full" in:fly={{ y: 200, duration: 600 }}>
            {voteOptions.find((vote) => vote.value === playerVote).label} this mission
          </button>
        {/if}
      </form>
    {/if}
  {:else}
    <ul id="playerList" class="grid {gridSize($teamMembers.length)} gap-xs">
      {#each $teamMembers as { ...player }}
        <Player {...player} />
      {/each}
    </ul>
    <h2 class="text-lg text-gray-500 text-center">
      {toSentance($teamMembers.map((teamMember) => teamMember.name))} are on the {$currentRound.name}
      mission
    </h2>
  {/if}

  {#if $playerIsLeader && $missionIsComplete}
    <div
      in:fly={{ y: 200, duration: 600 }}
      class="bg-white rounded-lg shadow-xl relative z-10 text-center"
    >
      <h2 class="text-primary-500">The mission is complete!</h2>
      <button on:click={revealVotes} class="btn-primary font-bold text-lg w-full">
        Reveal results
      </button>
    </div>
  {:else if ($playerIsTeamMember && $playerHasCompletedMission) || !$playerIsTeamMember}
    <div
      in:fly={{ y: 200, duration: 600 }}
      class="bg-blue-200 rounded-lg shadow-xl relative z-10 flex items-center"
    >
      <UISpinner color="text-blue-700" />
      <div>
        <h2 class="text-blue-900">Waiting for mission results</h2>
        <p class="text-blue-700">
          <!-- prettier-ignore -->
          {#if $currentRound.permittedMissionVoteFails}
            Spies must play 2 fails to win this mission
          {:else}
            All players must pass to win this mission
          {/if}
        </p>
      </div>
    </div>
  {/if}
</div>
