<script type="text/typescript" lang="ts">
  import { players, playerIsLoggedIn } from '../stores/player';
  import { ruleset } from '../stores/rules';
  import { currentRound, rounds } from '../stores/round';

  import RoundTracker from './RoundTracker.svelte';
</script>

<ul class="mb-xl flex justify-between">
  {#each $rounds as round}
    <li
      class="h-lg w-lg rounded-round relative text-center {round === $currentRound ? 'bg-warning-400 transform scale-150' : 'bg-gray-600'}">
      {#if round === $currentRound}
        <span
          class="animate-slow-pulse absolute inset-0 h-full w-full rounded-round bg-warning-300
            opacity-75 z-n" />
      {/if}
      <div class="font-bold text-sm text-warning-900 relative hidden" style="top: .08em">
        placeholder for vote tracking
      </div>
    </li>
  {/each}
</ul>
