<script>
  import { fade } from 'svelte/transition';
</script>

<div
  id="PhaseRoleReveal"
  class="fixed inset-0 cursor-pointer
    bg-black bg-opacity-75 h-screen
    grid place-items-center px-3"
  on:click
  transition:fade
>
  <slot />
</div>
