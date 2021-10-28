<script>
  import { currentPlayer, players, playerIsASpy, spies } from '../stores/player';
  import { ruleset } from '../stores/rules';

  import { blur } from './custom-transitions';

  import PlayerList from './PlayerList.svelte';
  import UIHeading from './UIHeading.svelte';
  import { playerNamesToSentance } from './view-helper';
</script>

<div id="PhaseRoleReveal" in:blur>
  {#if $playerIsASpy}
    <UIHeading>
      {playerNamesToSentance(
        $spies.map((spy) => spy.name),
        $currentPlayer.name,
      )} are <span class="text-rose-500 font-bold">spies</span> amongst the resistance!
    </UIHeading>
    <PlayerList cols={$ruleset.spyCount} players={$spies} />
  {:else}
    <UIHeading>
      You're part of the <span class="text-sky-400 font-bold">resistance</span>, but there are {$ruleset.spyCount}
      spies in your midst.
    </UIHeading>
    <PlayerList cols={$ruleset.playerCount} players={$players} />
  {/if}
</div>
