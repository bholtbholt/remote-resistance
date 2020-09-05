<script type="text/typescript" lang="ts">
  export let socket;
  export let component;
  export let historyState = [];

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);

  import { history } from '../stores/history';
  import { actions } from '../actions';

  history['history::init'](historyState);
  Object.entries(actions).map(([actionName, callback]) => {
    socket.on(actionName, callback);
  });
</script>

<svelte:component this={component} />
