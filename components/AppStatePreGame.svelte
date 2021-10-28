<script>
  import { redirect } from '../entry/redirect';

  import { players, playerIsLoggedIn } from '../stores/player';
  import { generateRuleset, maximumPlayerCount, minimumPlayerCount } from '../stores/rules';

  import { fly, fade } from 'svelte/transition';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import Player from './Player.svelte';
  import PlayerForm from './PlayerForm.svelte';
  import UISpinner from './UISpinner.svelte';
  import UIButtonCopy from './UIButtonCopy.svelte';
  import UIButton from './UIButton.svelte';
  import UIBanner from './UIBanner.svelte';

  $: playerSlots = Array(Math.max(0, maximumPlayerCount - $players.length));
  $: enoughPlayers = $players.length >= minimumPlayerCount;
  $: availableSlots = $players.length < maximumPlayerCount;

  function handleSubmit() {
    this.disabled = true;
    const ruleset = generateRuleset($players);
    socket.emit('ruleset::generate', ruleset);
    socket.emit('rounds::init', ruleset);
    socket.emit('leader::change', [$players, undefined]);
    socket.emit('appstate::set', 'IN_GAME');
  }
</script>

<div id="AppStatePreGame" in:fade>
  <ul
    id="playerList"
    class="grid grid-cols-5 gap-2 mb-8
      transition-all duration-1000 ease-out"
    class:blur={!$playerIsLoggedIn}
    class:opacity-50={!$playerIsLoggedIn}
  >
    {#each $players as { ...player }}
      <Player {...player} />
    {/each}
    {#each playerSlots as playerSlot, i}
      <li
        class="animate-pulse
          py-12 rounded-lg shadow
          bg-white dark:bg-gray-800 bg-opacity-30"
        style="animation-delay: {i * 100}ms"
      />
    {/each}
  </ul>

  {#if $playerIsLoggedIn}
    {#if enoughPlayers}
      <div in:fade>
        <UIButton on:click={handleSubmit}>Start the game!</UIButton>
      </div>
    {:else}
      <UIBanner>Waiting for more players to join…</UIBanner>
    {/if}
    <UIButtonCopy class="mx-auto my-8">Share Game URL</UIButtonCopy>
  {:else if availableSlots}
    <PlayerForm />
  {:else}
    <div
      in:fly={{ y: -200, duration: 600 }}
      class="bg-orange-200 dark:bg-gray-800
      text-orange-900 dark:text-gray-300
      p-6 rounded-lg shadow-xl"
    >
      <h2 class="text-xl font-bold mb-2">Too late!</h2>
      <p>
        There are already {maximumPlayerCount} players in the room. Wait here to watch, or
        <a
          href="/"
          on:click|preventDefault={redirect}
          class="font-bold cursor-pointer hover:underline
            text-indigo-700 dark:text-purple-300"
        >
          start a new game
        </a>
        instead.
      </p>
    </div>
  {/if}
</div>
