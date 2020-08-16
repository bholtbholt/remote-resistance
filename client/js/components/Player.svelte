<script type="text/typescript" lang="ts">
  import type { Player } from 'types';
  import { currentPlayerId } from './player-store';

  export let avatar;
  export let name;
  export let id;
</script>

<li {id}>
  {avatar} {name} {#if id === $currentPlayerId }
  <span>– It YOU!</span>
  {/if}
</li>
