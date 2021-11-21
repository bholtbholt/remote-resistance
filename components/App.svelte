<script>
  export let socket;
  export let currentPlayerIdSessionKey;
  export let appState = 'PRE_GAME';
  export let renderAdminController = false;

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

  import AppStateInGame from './AppStateInGame.svelte';
  import AppStateNoGame from './AppStateNoGame.svelte';
  import AppStatePreGame from './AppStatePreGame.svelte';
  import UISpinner from './UISpinner.svelte';
  import AdminController from './AdminController.svelte';

  appstate['appstate::set'](appState);
  const state = {
    IN_GAME: AppStateInGame,
    NO_GAME: AppStateNoGame,
    PRE_GAME: AppStatePreGame,
  };

  if ($appstate === 'NO_GAME') {
    setTimeout(() => {
      history.set([]);
    }, 100);
  }
</script>

{#if $historyIsLoaded}
  <svelte:component this={state[$appstate]} />
{:else}
  <div class="grid place-items-center h-screen">
    <UISpinner class="mx-auto text-indigo-900 dark:text-gray-200 text-2xl" />
  </div>
{/if}

{#if $historyIsLoaded && renderAdminController}
  <AdminController />
{/if}
