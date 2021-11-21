<script>
  import { fly, fade } from 'svelte/transition';

  import PreGameHeader from './PreGameHeader.svelte';
  import PreGameNewCode from './PreGameNewCode.svelte';
</script>

<div id="AppStateNoGame" in:fade>
  <PreGameHeader />
  <div
    class="p-4 mb-10
      bg-white dark:bg-gray-800 bg-opacity-80
      rounded-lg shadow-2xl relative z-10"
    in:fly={{ y: 100, duration: 700 }}
    out:fade={{ duration: 150 }}
  >
    <PreGameNewCode />
  </div>
</div>
