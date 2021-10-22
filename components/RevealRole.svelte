<script>
  import { currentPlayer, players, playerIsASpy, spies } from '../stores/player';
  import { ruleset } from '../stores/rules';

  import { blur } from './custom-transitions';

  import Player from './Player.svelte';
  import { gridSize, playerNamesToSentance } from './view-helper';
</script>

{#if $playerIsASpy}
  <h2 class="text-gray-100 text-center" in:blur>
    {playerNamesToSentance( $spies.map((spy) => spy.name), $currentPlayer.name, )} are <span
      class="text-fail-300">spies</span> amongst the resistance!
  </h2>
  <ul id="playerList" class="grid {gridSize($ruleset.spyCount)} gap-xs" in:blur>
    {#each $spies as { ...player }}
      <Player {...player} />
    {/each}
  </ul>
{:else}
  <h2 class="text-gray-100 text-center" in:blur>
    You're part of the <span class="text-success-300">resistance</span>, but there are {$ruleset.spyCount}
    spies in your midst.
  </h2>
  <ul id="playerList" class="grid {gridSize($ruleset.playerCount)} gap-xs" in:blur>
    {#each $players as { ...player }}
      <Player {...player} />
    {/each}
  </ul>
{/if}
