<script>
  import { players, playerIsLoggedIn } from '../stores/player';
  import { generateRuleset, maximumPlayerCount, minimumPlayerCount } from '../stores/rules';

  import { fly, fade } from 'svelte/transition';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import PreGameFilledSlots from './PreGameFilledSlots.svelte';
  import PreGameHeader from './PreGameHeader.svelte';
  import PreGameNewCode from './PreGameNewCode.svelte';
  import PreGamePlayerForm from './PreGamePlayerForm.svelte';
  import PreGamePlayerList from './PreGamePlayerList.svelte';
  import UIBanner from './UIBanner.svelte';
  import UIButton from './UIButton.svelte';
  import UIButtonCopy from './UIButtonCopy.svelte';

  $: availableSlots = $players.length < maximumPlayerCount;
  $: enoughPlayers = $players.length >= minimumPlayerCount;

  function startGame() {
    const ruleset = generateRuleset($players);
    socket.emit('ruleset::generate', ruleset);
    socket.emit('rounds::init', ruleset);
    socket.emit('leader::init', $players);
    socket.emit('appstate::init');
  }

  let changingRoom = false;
  function changeRoom() {
    changingRoom = true;
  }
</script>

<div id="AppStatePreGame" in:fade>
  <PreGameHeader />
  <PreGamePlayerList />

  {#if $playerIsLoggedIn}
    {#if enoughPlayers}
      <div in:fade>
        <UIButton on:click={startGame}>Start the game!</UIButton>
      </div>
    {:else}
      <UIBanner>Waiting for more players to join…</UIBanner>
    {/if}
    <UIButtonCopy class="mx-auto my-8">Share Game URL</UIButtonCopy>
  {:else if availableSlots}
    <div
      class="-mt-48 p-4 mb-10
        bg-white dark:bg-gray-800 bg-opacity-80
        rounded-lg shadow-2xl relative z-10"
      in:fly={{ y: -200, duration: 900 }}
      out:fade={{ duration: 150 }}
    >
      {#if changingRoom}
        <PreGameNewCode />
      {:else}
        <PreGamePlayerForm on:click={changeRoom} />
      {/if}
    </div>
  {:else}
    <PreGameFilledSlots />
  {/if}
</div>
