<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { players, playerIsLoggedIn } from '../stores/player';

  import PlayerInline from './PlayerInline.svelte';

  let editing = false;
  function toggleEditing() {
    editing = !editing;
  }

  function removePlayer() {
    socket.emit('player::remove', this.value);
  }
</script>

<header class="flex items-center">
  <h4 class="text-xl font-bold">
    {editing && $playerIsLoggedIn ? 'Remove Players' : 'Players'}
  </h4>
  {#if $playerIsLoggedIn}
    <button
      title="Remove player"
      type="button"
      on:click={toggleEditing}
      class="block ml-3 text-sm px-2
        rounded-full border text-center whitespace-nowrap
        text-gray-400 border-gray-400
        hover:text-gray-900 hover:border-teal-500 hover:bg-teal-500
        focus:text-gray-900 focus:border-teal-500 focus:bg-teal-500
        ease-out duration-200 transition-colors"
    >
      {editing ? 'Done' : 'Edit'}
    </button>
  {/if}
</header>

<ul>
  {#each $players as player}
    <li class="flex align-center mb-2">
      {#if editing && $playerIsLoggedIn}
        <button
          title="Remove player"
          type="button"
          on:click={removePlayer}
          value={player.id}
          class="rounded-full h-6 w-6 mr-2
          text-rose-600 border border-2 border-rose-600
          hover:text-rose-50 hover:bg-rose-600
          focus:text-rose-50 focus:bg-rose-600
          ease-out duration-200 transition-colors"
        >
          <svg class="mx-auto" width="18" viewBox="0 0 64 64" fill="currentColor">
            <rect rx="6" ry="6" width="40" height="12" y="27" x="12" />
          </svg>
        </button>
      {/if}
      <PlayerInline avatar={player.avatar} name={player.name} />
    </li>
  {/each}
</ul>
{#if $players.length === 0}
  <p>Be the first to join the game, then invite some friends to play!</p>
{/if}
