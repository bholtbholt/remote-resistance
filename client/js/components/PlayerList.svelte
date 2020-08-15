<script type="text/typescript" lang="ts">
  import { players } from './player-store';

  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');
  socket.on('player::add', players['player::add']);
</script>

<ul>
  {#each $players as { avatar, name }}
  <li>{avatar} {name}</li>
  {/each}
</ul>
