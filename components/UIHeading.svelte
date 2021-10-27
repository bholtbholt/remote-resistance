<header class="mb-8 text-center">
  <h2 class="text-3xl tracking-tight font-semibold text-indigo-200 dark:text-gray-300">
    <slot />
  </h2>
  {#if $$slots.subheading}
    <h3 class="text-xl mt-2 text-indigo-300 dark:text-gray-400">
      <slot name="subheading" />
    </h3>
  {/if}
</header>
