<script>
  import { redirect } from './redirect';

  import UIButton from './UIButton.svelte';
  import UIFormLink from './UIFormLink.svelte';
  import UIFormText from './UIFormText.svelte';

  let gameCode;
</script>

<form on:submit|preventDefault={() => redirect(gameCode)}>
  <UIFormText id="game" name="game" bind:value={gameCode} autofocus>Game code</UIFormText>
  <UIButton class="mb-6">Join game</UIButton>
  <UIFormLink on:click={() => redirect()}>or start a new game</UIFormLink>
</form>
