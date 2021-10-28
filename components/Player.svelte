<script>
  import { currentPlayerId } from '../stores/player';

  export let avatar;
  export let name;
  export let id;
</script>

<li
  {id}
  class="p-1 rounded-lg text-center
    bg-white dark:bg-gray-700 shadow"
  class:ring-teal-400={id === $currentPlayerId}
  class:ring={id === $currentPlayerId}
>
  <div class="py-2 text-5xl">{avatar}</div>
  <div
    class="truncate {id === $currentPlayerId
      ? 'text-teal-500 dark:text-teal-400 font-medium'
      : 'text-gray-600 dark:text-gray-300'}"
  >
    {name}
  </div>
</li>
