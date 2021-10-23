<script>
  //////////////////////////////////////////
  // Controller Setup
  //////////////////////////////////////////
  let showController = false;
  function toggleController() {
    showController = !showController;
  }

  //////////////////////////////////////////
  // App Functionality and Control
  //////////////////////////////////////////
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { currentPlayerId, currentPlayer, players, playerIsLoggedIn } from '../stores/player';
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
  <div class="z-50 py-5">
    {#if $players.length > 0}
      <ul id="playerList" class="grid grid-cols-5 gap-xs">
        {#each $players as { ...player }}
          <div class="relative">
            {#if $leader && $leader.id === player.id}
              <div
                style="top: -.22em; font-size: 2.6em; text-shadow: 0 .05em .08em rgba(0,0,0,.6);"
                class="absolute right-0"
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
      <span class="focus:underline hover:underline cursor-pointer" on:click={changeCurrentPlayer}>
        Change player
      </span>
      <span class="focus:underline hover:underline cursor-pointer" on:click={changeLeader}>
        Change leader
      </span>
    {/if}
    {#if $playerIsLoggedIn}
      <span class="focus:underline hover:underline cursor-pointer" on:click={logOut}>Log out</span>
    {/if}
    <span class="focus:underline hover:underline cursor-pointer" on:click={toggleController}
      >Close</span
    >
  </div>
{:else}
  <button class="fixed right-0 bottom-0" style="font-size: 56px;" on:click={toggleController}
    >🎚</button
  >
{/if}
