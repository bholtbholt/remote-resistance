<script type="text/typescript" lang="ts">
  export let socket;
  export let component;

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);
</script>

<svelte:component this={component}/>
