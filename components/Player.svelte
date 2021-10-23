<script>
  import { currentPlayerId } from '../stores/player';

  export let avatar;
  export let name;
  export let id;
</script>

<li {id} class="text-center bg-white rounded-sm" class:outline={id === $currentPlayerId}>
  <svg viewBox="0 0 20 20">
    <text x="50%" y="80%" class="align-middle overflow-visible text-anchor-middle">{avatar}</text>
  </svg>
  <div class="truncate text-gray-700" class:font-extrabold={id === $currentPlayerId}>
    {name}
  </div>
</li>
