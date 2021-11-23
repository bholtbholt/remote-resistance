<script>
  import { redirect } from './redirect';
  import { fly } from 'svelte/transition';
  import { maximumPlayerCount } from '../stores/rules';
</script>

<div
  in:fly={{ y: -200, duration: 600 }}
  class="-mt-20 p-6 rounded-lg shadow-xl
    z-10 relative
    bg-orange-200 dark:bg-gray-800
    text-orange-900 dark:text-gray-300"
>
  <h2 class="text-xl font-bold mb-2">Too late!</h2>
  <p>
    There are already {maximumPlayerCount} players in the room. Wait here to watch, or
    <a
      href="/"
      on:click|preventDefault={() => redirect()}
      class="font-bold cursor-pointer hover:underline
            text-indigo-700 dark:text-purple-300"
    >
      start a new game
    </a>
    instead.
  </p>
</div>
