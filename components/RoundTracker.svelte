<script type="text/typescript" lang="ts">
  import { backOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

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
        {#if round.failedTeamVotes > 0}
          <div
            class="font-bold text-sm text-warning-800"
            in:scale={{ start: 4, delay: 2650, easing: backOut }}>
            {round.failedTeamVotes}
          </div>
        {/if}
      {/if}
    </li>
  {/each}
</ul>
