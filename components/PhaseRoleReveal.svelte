<script>
  import { currentPlayer, players, playerIsASpy, spies } from '../stores/player';
  import { ruleset } from '../stores/rules';

  import { blur } from './custom-transitions';

  import Player from './Player.svelte';
  import UIHeading from './UIHeading.svelte';
  import { gridSize, playerNamesToSentance } from './view-helper';
</script>

<div id="PhaseRoleReveal" in:blur>
  {#if $playerIsASpy}
    <UIHeading>
      {playerNamesToSentance(
        $spies.map((spy) => spy.name),
        $currentPlayer.name,
      )} are <span class="text-rose-500 font-bold">spies</span> amongst the resistance!
    </UIHeading>
    <ul id="playerList" class="grid {gridSize($ruleset.spyCount)} gap-2">
      {#each $spies as { ...player }}
        <Player {...player} />
      {/each}
    </ul>
  {:else}
    <UIHeading>
      You're part of the <span class="text-sky-400 font-bold">resistance</span>, but there are {$ruleset.spyCount}
      spies in your midst.
    </UIHeading>
    <ul id="playerList" class="grid {gridSize($ruleset.playerCount)} gap-2">
      {#each $players as { ...player }}
        <Player {...player} />
      {/each}
    </ul>
  {/if}
</div>
