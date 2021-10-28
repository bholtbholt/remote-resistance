<script>
  export let disabled = false;
  export let theme = 'primary';
  const colors = {
    primary: 'bg-teal-400 hover:bg-teal-500 focus:bg-teal-500 focus:ring-teal-400 primary-border',
    fail: 'text-white bg-rose-500 hover:bg-rose-600 focus:bg-rose-600 focus:ring-rose-500 fail-border',
    success:
      'text-white bg-sky-500 hover:bg-sky-400 focus:bg-sky-400 focus:ring-sky-500 success-border',
  };

  import UISpinner from './UISpinner.svelte';
</script>

<button
  on:click
  {disabled}
  class:opacity-75={disabled}
  class:cursor-not-allowed={disabled}
  class="{colors[theme] || colors.primary} px-6 py-2
    ease-out duration-200 transition-colors
    w-full rounded-full
    active:transform active:translate-y-0.5
    text-xl text-center whitespace-nowrap"
>
  <slot />
  {#if disabled}
    <UISpinner class="ml-1 mb-0.5 text-inherit inline-block" size="1em" />
  {/if}
</button>

<style>
  .primary-border {
    --border-color: theme('colors.teal.700');
  }
  .fail-border {
    --border-color: theme('colors.rose.800');
  }
  .success-border {
    --border-color: theme('colors.sky.800');
  }
  button:not(:focus) {
    --border: 0 0.15em 0 0.01em;
    box-shadow: var(--border) var(--border-color);
  }
  button:active {
    --inset-border: inset 0 0.08em 0.05em;
    box-shadow: var(--inset-border) var(--border-color);
  }
</style>
