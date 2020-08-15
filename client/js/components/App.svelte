<script type="text/typescript" lang="ts">
  export let socket;
  export let currentPlayerIdSessionKey;

  import { setContext } from 'svelte';
  setContext('socketIORoom', socket);

  import { currentPlayerId, playerIsLoggedIn } from './player-store';
  currentPlayerId.set(currentPlayerIdSessionKey);

  import PlayerForm from './PlayerForm.svelte';
  import { history } from './history-store';

  socket.once('history::init', history['history::init']);
</script>

<PlayerForm />
<!-- <PreGameLobby /> -->
<!-- <Game /> -->
<!-- <PostGameLobby /> -->
