<script>
  import { backOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import { currentRound, rounds } from '../stores/round';
</script>

<ul id="RoundTracker" class="flex justify-between mb-8">
  {#each $rounds as round}
    <li
      class="relative h-4 w-4 rounded-full
        flex justify-center items-center
        {round === $currentRound
        ? 'bg-yellow-400 dark:bg-indigo-600 transform scale-150'
        : 'bg-indigo-900 dark:bg-gray-600'}"
    >
      {#if round === $currentRound}
        <span
          class="absolute inset-0 h-full w-full rounded-full z-n
            animate-slow-pulse opacity-75
            bg-yellow-200 dark:bg-indigo-400"
        />
        {#if round.failedTeamVotes > 0}
          <div
            class="text-xs text-indigo-800 dark:text-indigo-50"
            style="font-size: 0.66em"
            in:scale={{ start: 4, delay: 2650, easing: backOut }}
          >
            {round.failedTeamVotes}
          </div>
        {/if}
      {/if}
    </li>
  {/each}
</ul>
