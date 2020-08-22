<script type="text/typescript" lang="ts">
  export let socket;
  export let currentPlayerIdSessionKey;

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);

  import { history } from './history-store';
  import { ruleset } from './rules-store';
  import { players, currentPlayerId } from './player-store';
  import { gamestate } from './game-store';

  socket.once('history::init', history['history::init']);
  socket.once('ruleset::generate', ruleset['ruleset::generate']);
  socket.on('player::add', players['player::add']);
  socket.on('gamestate::set', gamestate['gamestate::set']);
  currentPlayerId.set(currentPlayerIdSessionKey);

  import LobbyPreGame from './LobbyPreGame.svelte';
  import LobbyGame from './LobbyGame.svelte';
  import LobbyPostGame from './LobbyPostGame.svelte';
  import Credits from './Credits.svelte';

  $: historyIsLoaded = Array.isArray($history);
  const state = {
    PRE_GAME: LobbyPreGame,
    IN_GAME: LobbyGame,
    POST_GAME: LobbyPostGame,
  };
</script>

{#if historyIsLoaded}
<svelte:component this="{state[$gamestate]}" />
{:else}
<div class="loading-dots mx-auto my-xl"></div>
{/if}
<Credits />
