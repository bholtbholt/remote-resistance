<script>
  export let showCard = false;
  import { fly } from 'svelte/transition';
  import { cardFlip } from './custom-transitions';
  import { currentPlayer, playerIsASpy } from '../stores/player';

  import Player from './Player.svelte';

  $: borderColor = $playerIsASpy ? 'border-fail-700' : 'border-success-700';
  $: outlineColor = $playerIsASpy ? 'outline-fail-700' : 'outline-success-700';
  $: headingColor = $playerIsASpy ? 'text-fail-600' : 'text-success-600';
  $: headingText = $playerIsASpy ? "You're a Spy" : 'Resistance';
</script>

{#if showCard}
  <div class="fixed inset-0 z-10 cursor-pointer background-fail-700" on:click>
    <div
      class="fixed top-0 inset-x-0 m-xl rounded-lg shadow-xl border-solid border-xl {borderColor}"
      transition:cardFlip>
      <div class="text-center bg-white rounded-lg p-lg pt-xl {outlineColor}">
        <h2 class="text-xl font-extrabold -mb-lg {headingColor}">{headingText}</h2>
        <svg viewBox="0 0 20 20">
          <text x="50%" y="80%" class="align-middle overflow-visible text-anchor-middle">
            {$currentPlayer.avatar}
          </text>
        </svg>
        <div class="text-gray-700 text-lg font-bold mb-sm">{$currentPlayer.name}</div>
      </div>
    </div>
  </div>
{:else}
  <button
    in:fly={{ y: 100, delay: 250 }}
    class="fixed left-0 bottom-0"
    style="font-size: 56px;"
    on:click>🃏</button>
{/if}
