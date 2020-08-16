<script type="text/typescript" lang="ts">
  import { players, playerIsLoggedIn } from './player-store';
  import { generateRuleset, maximumPlayerCount, minimumPlayerCount } from './rules-store';

  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import Player from './Player.svelte';
  import PlayerForm from './PlayerForm.svelte';

  $: playerSlots = Array(Math.max(0, maximumPlayerCount - $players.length));
  $: enoughPlayers = $players.length >= minimumPlayerCount;
  $: availableSlots = $players.length < maximumPlayerCount;

  function handleSubmit() {
    const ruleset = generateRuleset($players);
    socket.emit('ruleset::generate', ruleset);
  }
</script>

<style>
  .player-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 1rem;
  }
</style>

<ul class="player-list">
  {#each $players as {...player}}
    <Player {...player} />
  {/each}
  {#each playerSlots as playerSlot}
    <li>Empty slot</li>
  {/each}
</ul>

{#if $playerIsLoggedIn}
  {#if enoughPlayers}
    <button on:click|preventDefault="{handleSubmit}">Start the game!</button>
  {:else}
    <p>Waiting for more players to join…</p>
  {/if}
{:else}
  {#if availableSlots}
    <PlayerForm />
  {:else}
    <p>Game is about to start</p>
  {/if}
{/if}
