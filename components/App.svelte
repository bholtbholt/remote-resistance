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

  import AppStatePreGame from './AppStatePreGame.svelte';
  import AppStateInGame from './AppStateInGame.svelte';
  import UISpinner from './UISpinner.svelte';
  import AppController from './AppController.svelte';

  const state = {
    PRE_GAME: AppStatePreGame,
    IN_GAME: AppStateInGame,
  };
</script>

{#if $historyIsLoaded}
  <svelte:component this={state[$appstate]} />
{:else}
  <div class="grid place-items-center h-screen">
    <UISpinner class="mx-auto text-indigo-900 dark:text-gray-200 text-2xl" />
  </div>
{/if}

{#if renderAppController}
  <AppController />
{/if}
