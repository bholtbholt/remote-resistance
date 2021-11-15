<script>
  let className = '';
  export { className as class };
</script>

<div
  class="{className}
    uppercase font-light tracking-widest text-sm
    text-indigo-700 dark:text-purple-300"
>
  <slot />
</div>
