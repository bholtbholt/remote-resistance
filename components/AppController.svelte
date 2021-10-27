<script>
  //////////////////////////////////////////
  // Controller Setup
  //////////////////////////////////////////
  let showController = false;
  function toggleController() {
    showController = !showController;
  }

  const btn = {
    class:
      'flex-none py-1 px-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-800 focus:bg-gray-800 hover:text-gray-200 focus:text-gray-200',
    tabindex: 1,
  };

  //////////////////////////////////////////
  // App Functionality and Control
  //////////////////////////////////////////
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { currentPlayerId, players, playerIsLoggedIn } from '../stores/player';
  import { leader } from '../stores/leader';
  import { ruleset } from '../stores/rules';

  import Player from './Player.svelte';

  function changeLeader() {
    socket.emit('leader::change', [$players, $leader?.id]);
  }

  function changeCurrentPlayer() {
    const nextIndex = $players.findIndex((player) => player.id === $currentPlayerId) + 1;
    const nextPlayerIndex = nextIndex === $players.length ? 0 : nextIndex;

    currentPlayerId.set($players[nextPlayerIndex].id);
  }

  function logOut() {
    window.sessionStorage.removeItem('hideRoleReveal');
    window.sessionStorage.removeItem('currentPlayerId');
    currentPlayerId.set('');
  }
</script>

{#if showController}
  <div class="fixed bottom-0 inset-x-0 mx-auto z-50 py-5" style="width: min(28rem, 95vw);">
    <ul id="playerList" class="grid grid-cols-5 gap-2 mb-6">
      {#each $players as { ...player }}
        <div class="relative">
          {#if $leader && $leader.id === player.id}
            <div
              style="text-shadow: 0 .05em .08em rgba(0,0,0,.6);"
              class="absolute -top-0 -right-1.5 text-4xl"
            >
              🏅
            </div>
          {/if}
          {#if $ruleset && $ruleset.spyIds.includes(player.id)}
            <div class="absolute left-0 top-0">🔻</div>
          {/if}
          <Player {...player} />
        </div>
      {/each}
    </ul>
    <div class="flex gap-2">
      {#if $players.length > 0}
        <button {...btn} on:click={changeCurrentPlayer}>🔁 Player</button>
        <button {...btn} on:click={changeLeader}>🔁 Leader</button>
      {/if}
      {#if $playerIsLoggedIn}
        <button {...btn} on:click={logOut}>Log out</button>
      {/if}
      <button
        tabindex="1"
        class="flex-none text-gray-300 text-2xl ml-auto"
        on:click={toggleController}>×</button
      >
    </div>
  </div>
{:else}
  <button class="fixed right-0 bottom-0 text-6xl mb-3" on:click={toggleController}>🎚</button>
{/if}
