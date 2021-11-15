<script>
  let gameCode;

  import UIButton from './UIButton.svelte';
  import UIFormText from './UIFormText.svelte';

  function redirectGame() {
    window.location.replace(`/${gameCode}`);
  }
</script>

<form on:submit|preventDefault={redirectGame}>
  <UIFormText id="game" name="game" bind:value={gameCode} autofocus>New Game code</UIFormText>
  <UIButton>Go to new game</UIButton>
</form>
