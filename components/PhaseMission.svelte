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

  import UIHeading from './UIHeading.svelte';
  import PlayerList from './PlayerList.svelte';
  import UIButton from './UIButton.svelte';
  import UIBanner from './UIBanner.svelte';
  import UISpinner from './UISpinner.svelte';
  import { toSentance } from './view-helper';

  let playerVote;
  $: voteOptions = [
    {
      value: 'fail',
      id: 'vote-fail',
      label: 'Fail',
      defaultColor: 'text-rose-500 bg-white bg-opacity-80 dark:bg-gray-700',
      selectedColor: 'text-rose-100 bg-rose-500 ',
      selected: playerVote === 'fail',
      disabled: !$playerIsASpy,
      rotateDeg: -18,
      rotateX: -90,
      origin: 'origin-left',
    },
    {
      value: 'pass',
      id: 'vote-pass',
      label: 'Pass',
      defaultColor: 'text-sky-500 bg-white bg-opacity-80 dark:bg-gray-700',
      selectedColor: 'text-sky-100 bg-sky-500',
      selected: playerVote === 'pass',
      disabled: false,
      rotateDeg: 18,
      rotateX: 90,
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

<div id="PhaseMission" in:fade>
  {#if $playerIsTeamMember}
    <UIHeading>
      Pass or fail this mission
      <span slot="subheading">
        {#if $playerIsASpy}
          Spies may pass or fail
        {:else}
          Resistance must pass
        {/if}
      </span>
    </UIHeading>
    {#if !$playerHasCompletedMission}
      <form on:submit|preventDefault={submitVote}>
        <div class="flex justify-center gap-6 mb-10">
          {#each voteOptions as vote}
            <label
              for={vote.id}
              in:rotate={{ deg: vote.rotateDeg, x: vote.rotateX, y: 20 }}
              class:opacity-30={(playerVote && !vote.selected) || vote.disabled}
              class:cursor-pointer={!vote.disabled}
              class:cursor-not-allowed={vote.disabled}
              class:scale-110={vote.selected}
              class:scale-90={playerVote && !vote.selected}
              class="relative flex-1
                text-6xl font-extrabold uppercase tracking-tight text-center
                py-8 px-3 rounded-lg shadow-xl
                transform {vote.origin}
                {vote.selected ? vote.selectedColor : vote.defaultColor}
                transition-all duration-300 ease-out"
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
          <div class="mt-8" in:fly={{ y: 200, duration: 600 }}>
            {#if playerVote === 'pass'}
              <UIButton theme="sky">Pass this mission</UIButton>
            {:else if playerVote === 'fail'}
              <UIButton theme="rose">Fail this mission</UIButton>
            {/if}
          </div>
        {/if}
      </form>
    {/if}
  {:else}
    <PlayerList cols={$teamMembers.length} players={$teamMembers} />
    <UIHeading>
      {toSentance($teamMembers.map((teamMember) => teamMember.name))} are on the {$currentRound.name}
      mission
    </UIHeading>
  {/if}

  {#if $playerIsLeader && $missionIsComplete}
    <div in:fly={{ y: 200, duration: 600 }} class="text-center">
      <h2 class="text-4xl font-semibold text-white dark:text-purple-50 mb-6">
        The mission is complete!
      </h2>
      <UIButton on:click={revealVotes}>Reveal results</UIButton>
    </div>
  {:else if ($playerIsTeamMember && $playerHasCompletedMission) || !$playerIsTeamMember}
    <div in:fly={{ y: 200, duration: 600 }}>
      <UIBanner>
        Waiting for mission results
        <p slot="details">
          {#if $currentRound.permittedMissionVoteFails}
            Spies must play 2 fails to win this mission
          {:else}
            All players must pass to win this mission
          {/if}
        </p>
      </UIBanner>
    </div>
  {/if}
</div>
