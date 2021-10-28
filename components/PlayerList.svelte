<script>
  export let cols = 5;
  export let players = [];
  import Player from './Player.svelte';
  import { gridSize } from './view-helper';
</script>

<ul id="playerList" class="grid {gridSize(cols)} gap-2">
  {#each players as player}
    <Player {...player} />
  {/each}
</ul>
