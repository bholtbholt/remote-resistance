<script>
  import { backOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import { currentRound, rounds, phaseTeamBuilding } from '../stores/round';

  // maps to round.winner || currentRound, with undefined as the
  // fallback/default style and true as the currentRound style
  const roundStyle = {
    spies: 'bg-rose-600',
    resistance: 'bg-sky-400 dark:bg-sky-500',
    true: 'bg-yellow-400 dark:bg-indigo-600 transform scale-150',
    undefined: 'bg-indigo-900 dark:bg-gray-600',
  };
</script>

<ul id="RoundTracker" class="flex justify-between mb-8">
  {#each $rounds as round}
    <li
      class="relative h-4 w-4 rounded-full
        flex justify-center items-center
        {roundStyle[round === $currentRound || round.winner]}"
    >
      {#if round === $currentRound}
        <span
          class="absolute inset-0 h-full w-full rounded-full z-n
            animate-slow-pulse opacity-75
            bg-yellow-200 dark:bg-indigo-400"
        />
        {#if $phaseTeamBuilding && round.failedTeamVotes > 0}
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
