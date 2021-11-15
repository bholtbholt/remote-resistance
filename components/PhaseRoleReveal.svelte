<script>
  import { players, playerIsASpy, spies } from '../stores/player';
  import { ruleset } from '../stores/rules';

  import PlayerList from './PlayerList.svelte';
  import UIHeading from './UIHeading.svelte';
  import UIBackdrop from './UIBackdrop.svelte';
</script>

<UIBackdrop on:click>
  <div id="PhaseRoleReveal">
    {#if $playerIsASpy}
      <UIHeading>
        You're <span class="text-rose-500 font-bold">spies</span> amongst the resistance!
      </UIHeading>
      <PlayerList cols={$ruleset.spyCount} players={$spies} />
    {:else}
      <UIHeading>
        You're <span class="text-sky-400 font-bold">resistance</span> but {$ruleset.spyCount} spies are
        among you.
      </UIHeading>
      <PlayerList cols={$ruleset.playerCount} players={$players} />
    {/if}
  </div>
</UIBackdrop>
