<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { quartIn } from 'svelte/easing';
  import { fly, scale } from 'svelte/transition';
  import { blur } from './custom-transitions';

  import { previousLeader, leader } from '../stores/leader';
  import { playerIsLeader, teamMembers } from '../stores/player';
  import { currentRound, spiesWin, resistanceWin } from '../stores/round';
  import { missionPassed } from '../stores/mission';

  import UIButton from './UIButton.svelte';
  import UIHeading from './UIHeading.svelte';
  import { toSentance } from './view-helper';

  // 2..5 Keys for cards.length
  // 0..4 nested keys for card index within the each loop
  const cardStyles = {
    fail: 'text-rose-100 bg-rose-500 border-rose-700',
    pass: 'text-sky-100 bg-sky-500 border-sky-700',
    2: {
      0: '-rotate-2 -translate-x-24 translate-y-3',
      1: 'rotate-3 translate-x-24 translate-y-8',
    },
    3: {
      0: '-rotate-2 -translate-x-24',
      1: 'rotate-3 translate-x-24 translate-y-4',
      2: '-rotate-1 -translate-x-2 translate-y-12',
    },
    4: {
      0: '-rotate-1 -translate-x-20 translate-y-8',
      1: 'rotate-2 translate-x-24 translate-y-6',
      2: 'rotate-3 -translate-x-3 translate-y-12',
      3: '-rotate-2 translate-x-6 -translate-y-3',
    },
    5: {
      0: '-rotate-2 -translate-x-24 translate-y-3',
      1: 'rotate-1 translate-x-28 translate-y-8',
      2: 'rotate-1 -translate-x-16 translate-y-12',
      3: 'translate-x-20 -translate-y-3',
      4: '-rotate-1 translate-y-8',
    },
  };

  $: cards = $currentRound.missionPhase.votes
    .map((missionVote) => missionVote.vote)
    .sort((vote) => vote == 'fail');
  $: transitionDelay = cards.length * 1200;

  function startNextRound() {
    socket.emit('missionvote::reset');
    socket.emit('team::reset');
    socket.emit('teamvote::reset');
    socket.emit('rounds::increment');
    socket.emit('phase::set', 'TEAM_SELECTION');
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

<div id="PhaseMissionReveal" in:blur>
  <UIHeading>
    Team {toSentance($teamMembers.map((teamMember) => `${teamMember.avatar} ${teamMember.name}`))}
    <span slot="subheading">
      Picked by {$previousLeader.name} for the {$currentRound.name} mission
    </span>
  </UIHeading>

  <ul id="missionCards" class="relative mb-10 py-20">
    {#each cards as card, i}
      <li
        in:scale={{ start: 4, duration: 800, delay: i * 1200, easing: quartIn }}
        class="py-8 px-3 mb-3 rounded-lg shadow-xl
        absolute top-0 inset-x-0
        transform {cardStyles[cards.length || 5][i]}
        inline-block w-56 mx-auto border
        {cardStyles[card]}
        text-6xl font-extrabold uppercase tracking-tight text-center"
      >
        {card}
      </li>
    {/each}
  </ul>

  <div class="text-center" in:fly={{ y: 200, duration: 600, delay: transitionDelay }}>
    <h2
      in:scale={{ start: 4, duration: 800, delay: transitionDelay, easing: quartIn }}
      class="text-4xl font-semibold text-center text-white dark:text-purple-50 mb-6"
    >
      {#if $resistanceWin}
        Resistance wins
      {:else if $spiesWin}
        Spies win
      {:else if $missionPassed}
        Mission passed
      {:else}
        Mission failed
      {/if}
    </h2>
    {#if $resistanceWin || $spiesWin}
      <UIButton on:click={endGame}>Start a new game</UIButton>
    {:else if $playerIsLeader}
      <UIButton on:click={startNextRound}>Start next round</UIButton>
    {:else}
      <h3 class="text-2xl text-center text-rose-100 dark:text-purple-50">
        Waiting for {$leader.avatar}
        {$leader.name} to start the next round
      </h3>
    {/if}
  </div>
</div>
