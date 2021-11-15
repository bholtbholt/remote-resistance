<script>
  import { players, playerIsLoggedIn } from '../stores/player';
  import { maximumPlayerCount } from '../stores/rules';

  import Player from './Player.svelte';

  $: playerSlots = Array(Math.max(0, maximumPlayerCount - $players.length));
</script>

<ul
  id="playerList"
  class="grid grid-cols-5 gap-2 mb-8
      transition-all duration-1000 ease-out"
  class:blur={!$playerIsLoggedIn}
  class:opacity-50={!$playerIsLoggedIn}
>
  {#each $players as { ...player }}
    <Player {...player} />
  {/each}
  {#each playerSlots as {}, i}
    <li
      class="animate-pulse
          py-12 rounded-lg shadow
          bg-white dark:bg-gray-800 bg-opacity-30"
      style="animation-delay: {i * 100}ms"
    />
  {/each}
</ul>
