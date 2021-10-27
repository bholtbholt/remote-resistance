<script>
  export let copyText = window.location.href;
  let copiedSuccessfully = false;
  let className = '';
  export { className as class };

  async function share() {
    await navigator.clipboard.writeText(copyText);

    copiedSuccessfully = true;
    setTimeout(() => {
      copiedSuccessfully = false;
    }, 1000);
  }
</script>

<button
  type="button"
  on:click={share}
  class="{className} block px-6 py-2
    rounded-full border text-center whitespace-nowrap
    text-rose-200 border-rose-200
    hover:text-rose-200 hover:border-rose-900 hover:bg-rose-900
    focus:text-rose-200 focus:border-rose-900 focus:bg-rose-900
    dark:border-purple-300 dark:text-purple-300
    dark:hover:bg-purple-900 dark:hover:text-purple-200 dark:hover:border-purple-900
    dark:focus:bg-purple-900 dark:focus:text-purple-200 dark:focus:border-purple-900
    ease-out duration-200 transition-colors"
>
  {#if copiedSuccessfully}
    Copied!
  {:else}
    <slot>Copy text</slot>
  {/if}
</button>
