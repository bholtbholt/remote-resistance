<script>
  export let socket;
  export let currentPlayerIdSessionKey;
  export let renderAppController = false;

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);

  import { history, historyIsLoaded } from '../stores/history';
  import { actions } from '../actions';
  import { currentPlayerId } from '../stores/player';
  import { appstate } from '../stores/app';

  currentPlayerId.set(currentPlayerIdSessionKey);
  socket.once('history::init', history['history::init']);
  Object.entries(actions).map(([actionName, callback]) => {
    socket.on(actionName, callback);
  });

  import LobbyPreGame from './LobbyPreGame.svelte';
  import LobbyGame from './LobbyGame.svelte';
  import LobbyPostGame from './LobbyPostGame.svelte';
  import Credits from './Credits.svelte';
  import AppController from './AppController.svelte';

  const state = {
    PRE_GAME: LobbyPreGame,
    IN_GAME: LobbyGame,
    POST_GAME: LobbyPostGame,
  };
</script>

{#if $historyIsLoaded}
  <svelte:component this={state[$appstate]} />
{:else}
  <div class="loading-dots mx-auto my-xl" />
{/if}
<Credits />

{#if renderAppController}
  <AppController />
{/if}
