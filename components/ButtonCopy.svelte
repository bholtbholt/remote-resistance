<script>
  export let copyText = window.location.href;
  let success = 'Coped!';
  let copying = false;

  async function share() {
    await navigator.clipboard.writeText(copyText);

    copying = true;
    setTimeout(() => {
      copying = false;
    }, 1000);
  }
</script>

<button type="button" on:click={share}>
  {#if copying}
    {success}
  {:else}
    <slot>Copy text</slot>
  {/if}
</button>
