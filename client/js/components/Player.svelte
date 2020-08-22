<script type="text/typescript" lang="ts">
  import type { Player } from '../../../types';
  import { currentPlayerId } from './player-store';

  export let avatar;
  export let name;
  export let id;
</script>

<li {id} class="text-center bg-white rounded-sm" class:outline="{id === $currentPlayerId}">
  <svg viewBox="0 0 20 20">
    <text x="50%" y="80%" class="align-middle overflow-visible" style="text-anchor: middle;">{avatar}</text>
  </svg>
  <div class="truncate px-xs mb-sm text-gray-700">{name}</div>
</li>
