<script type="text/typescript" lang="ts">
  import { players, playerIsLoggedIn } from './player-store';
  import { ruleset } from './rules-store';

  import RoundTracker from './RoundTracker.svelte';
</script>

<ul class="mb-xl flex justify-between">
  {#each Array.from(Array(5)) as number, i }
    <li class="h-lg w-lg rounded-round relative text-center {i === 0 ? 'bg-warning-400 transform scale-150' : 'bg-gray-600'}">
      {#if i === 0}
        <span class="animate-slow-pulse absolute inset-0 h-full w-full rounded-round bg-warning-300 opacity-75" style="z-index: -1"></span>
      {/if}
      <div class="font-bold text-sm text-warning-900 relative hidden" style="top: .08em">{i + 1}</div>
    </li>
  {/each}
</ul>
