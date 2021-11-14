<script>
  import { backOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import { phaseTeamBuilding } from '../stores/phase';
  import { currentRound, rounds } from '../stores/round';

  // maps to round.winner || currentRound, with false as the
  // fallback/default style and true as the currentRound style
  const roundStyle = {
    spies: 'bg-rose-600',
    resistance: 'bg-sky-400 dark:bg-sky-500',
    true: 'bg-yellow-400 dark:bg-indigo-600',
    false: 'bg-indigo-900 dark:bg-gray-600',
  };
</script>

<ul id="RoundTracker" class="flex justify-between mb-8">
  {#each $rounds as round}
    <li
      class:scale-150={round === $currentRound}
      class="relative h-4 w-4 rounded-full transform
        flex justify-center items-center
        {roundStyle[round.winner || round === $currentRound]}"
    >
      {#if round === $currentRound}
        <span
          class="absolute inset-0 z-n
            h-full w-full rounded-full
            animate-slow-pulse bg-inherit"
        />
        {#if $phaseTeamBuilding && round.failedTeamVotes > 0}
          <div
            class="text-xs text-indigo-800 dark:text-indigo-50"
            in:scale={{ start: 4, delay: 2650, easing: backOut }}
          >
            {round.failedTeamVotes}
          </div>
        {/if}
      {/if}
    </li>
  {/each}
</ul>
