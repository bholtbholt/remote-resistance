<script>
  export let showCard = false;
  import { fly } from 'svelte/transition';
  import { cardFlip } from './custom-transitions';
  import { currentPlayer, playerIsASpy } from '../stores/player';

  import Player from './Player.svelte';

  $: borderColor = $playerIsASpy ? 'border-red-700' : 'border-blue-700';
  $: outlineColor = $playerIsASpy ? 'outline-red-700' : 'outline-blue-700';
  $: headingColor = $playerIsASpy ? 'text-red-600' : 'text-blue-600';
  $: headingText = $playerIsASpy ? "You're a Spy" : 'Resistance';
</script>

{#if showCard}
  <div class="fixed inset-0 z-10 cursor-pointer background-red-700" on:click>
    <div
      class="fixed top-0 inset-x-0 rounded-lg shadow-xl border-solid border-xl {borderColor}"
      transition:cardFlip
    >
      <div class="text-center bg-white rounded-lg {outlineColor}">
        <h2 class="text-xl font-extrabold {headingColor}">{headingText}</h2>
        <svg viewBox="0 0 20 20">
          <text x="50%" y="80%" class="align-middle overflow-visible text-anchor-middle">
            {$currentPlayer.avatar}
          </text>
        </svg>
        <div class="text-gray-700 text-lg font-bold">{$currentPlayer.name}</div>
      </div>
    </div>
  </div>
{:else}
  <button
    in:fly={{ y: 100, delay: 250 }}
    class="fixed left-0 bottom-0"
    style="font-size: 56px;"
    on:click>🃏</button
  >
{/if}
