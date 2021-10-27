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
  class="{colors[theme] || colors.primary}
  py-3 px-4 rounded-lg shadow-xl
  flex items-center flex-wrap"
>
  <UISpinner class="mr-3 flex-none" />
  <h2 class="text-xl flex-1"><slot /></h2>
</div>
