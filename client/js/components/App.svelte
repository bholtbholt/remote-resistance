<script type="text/typescript" lang="ts">
  export let socket;

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);

  import PlayerForm from './PlayerForm.svelte';
  import { history } from './history-store';

  socket.on('history::add', history['history::add']);
  socket.once('history::init', history['history::init']);
</script>

<PlayerForm />
