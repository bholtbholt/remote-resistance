<script>
  import { fade } from 'svelte/transition';
</script>

<div
  id="PhaseRoleReveal"
  class="fixed inset-0 z-10 cursor-pointer
    bg-black bg-opacity-75 px-3
    grid place-items-center h-screen"
  on:click
  transition:fade
>
  <slot />
</div>
