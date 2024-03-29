<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { playerIsLoggedIn, currentPlayerId } from '../stores/player';
  import { redirect } from './redirect';

  import UIDrawer from './UIDrawer.svelte';
  import PreGamePlayerDrawer from './PreGamePlayerDrawer.svelte';

  const gameCode = window.location.pathname.slice(1);
  const nav = 'block px-3 py-2 hover:underline dark:hover:text-teal-400 dark:focus:text-teal-400';
  const link = { target: '_blank', class: 'cursor-pointer hover:underline' };

  function startNewGame() {
    socket.emit('player::remove', $currentPlayerId);
    redirect();
  }

  function leaveGame() {
    socket.emit('player::remove', $currentPlayerId);
  }
</script>

<header class="mb-8 flex items-center">
  <UIDrawer class="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 p-3 pb-6">
    <nav
      class="mb-8 rounded-lg
      text-indigo-800 dark:text-gray-300
      bg-indigo-100 dark:bg-gray-600
      divide-y divide-indigo-300 dark:divide-gray-700"
    >
      <a href="/" class={nav} on:click|preventDefault={startNewGame}>Start a new game</a>
      <a href="/" class={nav} on:click={leaveGame}>Join another game</a>
      {#if $playerIsLoggedIn}
        <a href="/" class={nav} on:click|preventDefault={leaveGame}>Leave game</a>
      {/if}
    </nav>
    <section class="mb-8">
      <PreGamePlayerDrawer />
    </section>
    <section class="mb-8">
      <h4 class="text-xl font-bold">How to play</h4>
      <p class="mb-3">
        There are 2 teams, <strong class="text-sky-400">resistance</strong> and
        <strong class="text-rose-500">spies</strong>. The first team to
        <strong>win 3 missions</strong> within 5 rounds wins the game.
      </p>
      <h5 class="font-bold">How to win as <strong class="text-sky-400">resistance</strong></h5>
      <ul class="list-disc pl-5 mb-3">
        <li>Figure out who the spies are.</li>
        <li>Get on missions and pass them.</li>
        <li>Reject picks with spies.</li>
      </ul>
      <h5 class="font-bold">How to win as <strong class="text-rose-500">spies</strong></h5>
      <ul class="list-disc pl-5 mb-3">
        <li>Keep your identity a secret.</li>
        <li>Get on missions and fail them.</li>
        <li>Reject picks without a spy.</li>
      </ul>
      <h5 class="font-bold">Gameplay</h5>
      <ul class="space-y-1 list-disc pl-5 mb-3">
        <li>
          Everyone is randomly assigned to a team. Spies know other spies, but resistance only knows
          the number of spies.
        </li>
        <li>
          At the start of each round, the leader picks players to go on a mission, then everyone
          votes to approve or reject the pick. If rejected, a new leader picks. Spies win the game
          if there are 5 rejections in a row.
        </li>
        <li>
          Players on the mission decide the outcome of the round. Resistance pass missions, while
          spies can pass or fail. A new round starts when the mission is complete.
        </li>
      </ul>
    </section>
    <section class="mb-8">
      <h4 class="text-xl font-bold">Credits</h4>
      <p>
        Made in 2021 by
        <a href="https://twitter.com/bholtbholt" {...link} class:font-bold={true}>@BHOLTBHOLT</a>
        with <a href="https://svelte.dev" {...link}>Svelte</a>. Visit
        <a href="https://boardgamegeek.com/boardgame/41114/resistance/credits" {...link}
          >Board Game Geek</a
        >
        for game credits.
        <a
          href="https://ko-fi.com/bholtbholt"
          target="_blank"
          class="block mt-6 px-6 py-2
            rounded-full border text-center whitespace-nowrap
            text-rose-600 border-rose-600
            hover:text-rose-200 hover:border-rose-800 hover:bg-rose-800
            focus:text-rose-200 focus:border-rose-800 focus:bg-rose-800
            dark:border-rose-300 dark:text-rose-300
            ease-out duration-200 transition-colors"
          >❤️ Support me on Ko-fi
        </a>
      </p>
    </section>
  </UIDrawer>
  <h1 class="font-light tracking-tight text-indigo-200 dark:text-gray-300 text-xl ml-2">
    Remote Resistance
  </h1>
  <div
    id="game-code"
    class="ml-auto px-1 rounded
      border border-indigo-200 text-indigo-200
      dark:border-gray-300 dark:text-gray-300"
  >
    {gameCode}
  </div>
</header>
