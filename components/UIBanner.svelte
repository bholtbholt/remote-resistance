<script>
  export let theme = 'teal';
  const colors = {
    teal: 'bg-teal-400 text-teal-800',
    rose: 'bg-rose-500 text-rose-100',
    sky: 'bg-sky-500 text-sky-900',
  };

  import UISpinner from './UISpinner.svelte';
</script>

<div
  class="{colors[theme] || colors.teal}
  py-3 px-4 rounded-lg shadow-xl
  flex items-center flex-wrap"
>
  <UISpinner class="mr-3 flex-initial" />
  <div class="flex-1">
    <h2 class="text-xl"><slot /></h2>
    <slot name="details" />
  </div>
</div>
