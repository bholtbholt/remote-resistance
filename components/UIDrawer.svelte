<script>
  let className = '';
  export { className as class };

  import { fly } from 'svelte/transition';

  import UIBackdrop from './UIBackdrop.svelte';

  let openDrawer = false;
  function toggleDrawer() {
    openDrawer = !openDrawer;
  }
</script>

<button
  on:click={toggleDrawer}
  class="text-indigo-200 dark:text-gray-300
    hover:text-indigo-50 focus:text-indigo-50
    dark:hover:text-gray-50 focus:text-gray-50
    ease-out duration-200 transition-colors"
>
  <svg viewBox="0 0 90 74" height="18" fill="currentColor">
    <rect rx="2" ry="2" width="90" height="6" y="6" />
    <rect rx="2" ry="2" width="90" height="6" y="36" />
    <rect rx="2" ry="2" width="90" height="6" y="66" />
  </svg>
</button>

{#if openDrawer}
  <div class="fixed inset-0 z-40 h-full overflow-auto">
    <div
      class="{className} min-h-full relative z-10 shadow w-10/12 max-w-sm"
      transition:fly={{ x: -400, duration: 600 }}
    >
      <slot />
    </div>
    <UIBackdrop on:click={toggleDrawer} />
  </div>
{/if}
