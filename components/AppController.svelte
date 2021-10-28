<script>
  //////////////////////////////////////////
  // Controller Setup
  //////////////////////////////////////////
  import { fly } from 'svelte/transition';
  let showController = false;
  function toggleController() {
    showController = !showController;
  }

  const btn = {
    class: 'block w-full text-left mt-2 text-gray-300 hover:text-gray-200 focus:text-gray-200',
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
  <ul
    class="fixed bottom-0 inset-x-0 mx-auto py-3 flex justify-center gap-2 items-end"
    transition:fly={{ y: 200, duration: 300 }}
  >
    {#each $players as { ...player }}
      <div class="relative w-20 md:block" class:hidden={player.id !== $currentPlayerId}>
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
    <div class="ml-3">
      {#if $players.length > 0}
        <button {...btn} on:click={changeCurrentPlayer}>🔁 Player</button>
        <button {...btn} on:click={changeLeader}>🔁 Leader</button>
      {/if}
      {#if $playerIsLoggedIn}
        <button {...btn} on:click={logOut}>Log out</button>
      {/if}
    </div>
  </ul>
{/if}
<button
  class="fixed right-0 bottom-0 text-6xl mb-3 transform"
  style={showController ? '' : 'bottom: 1.5px;'}
  class:scale-y-flip={!showController}
  on:click={toggleController}>🎚</button
>
