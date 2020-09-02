<script type="text/typescript" lang="ts">
  import { redirect } from '../client/js/redirect';

  import { players, playerIsLoggedIn } from '../stores/player';
  import { generateRuleset, maximumPlayerCount, minimumPlayerCount } from '../stores/rules';

  import { fly, fade } from 'svelte/transition';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import Player from './Player.svelte';
  import PlayerForm from './PlayerForm.svelte';
  import Spinner from './Spinner.svelte';

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

<div id="LobbyPreGame" in:fade>
  <ul
    id="playerList"
    class="grid grid-cols-5 grid-rows-2 mb-lg gap-xs transition-all duration-1000 ease-out"
    class:blur={!$playerIsLoggedIn}
    class:opacity-50={!$playerIsLoggedIn}>
    {#each $players as { ...player }}
      <Player {...player} />
    {/each}
    {#each playerSlots as playerSlot, i}
      <li
        class="bg-gray-900 animate-pulse rounded-sm min-h-xl"
        style="animation-delay: {i * 100}ms" />
    {/each}
  </ul>

  {#if $playerIsLoggedIn}
    {#if enoughPlayers}
      <div class="mx-lg" in:fade>
        <button
          on:click|preventDefault={handleSubmit}
          class="btn-primary font-bold text-lg w-full">Start the game!</button>
      </div>
    {:else}
      <div
        class="bg-success-200 rounded-lg shadow-xl mx-lg mb-xl p-md relative z-10 flex items-center"
        in:fade>
        <Spinner color="text-success-900" margins="mr-sm" />
        <h2 class="subheading text-success-900">Waiting for more players to join…</h2>
      </div>
    {/if}
  {:else if availableSlots}
    <PlayerForm />
  {:else}
    <div
      in:fly={{ y: -200, duration: 600 }}
      class="bg-warning-200 rounded-lg shadow-xl mx-lg mb-xl -mt-xl p-md relative z-10">
      <h2 class="subheading text-warning-900">Too late!</h2>
      <p class="text-warning-700">
        There are already {maximumPlayerCount} players in this game. Wait here to watch, or <a class="underline
            cursor-pointer" on:click={redirect}>start a new one instead.</a>
      </p>
    </div>
  {/if}
</div>
