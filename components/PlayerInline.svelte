<script>
  export let id;
  export let avatar;
  export let name;
  export let color = 'text-gray-600 dark:text-gray-300';
  export let truncate = false;
</script>

<span class="{color} whitespace-nowrap" class:block={truncate} class:truncate>
  {avatar}
  {name}
</span>
