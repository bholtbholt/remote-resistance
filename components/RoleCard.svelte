<script>
  export let showCard = false;
  import { fly } from 'svelte/transition';
  import { cardFlip } from './custom-transitions';
  import { currentPlayer, playerIsASpy } from '../stores/player';

  import UIBackdrop from './UIBackdrop.svelte';

  $: cardColor = $playerIsASpy ? 'ring-rose-700 bg-rose-600' : 'ring-sky-600 bg-sky-500';
  $: headingColor = $playerIsASpy ? 'text-rose-600' : 'text-sky-400';
  $: headingText = $playerIsASpy ? 'Spy' : 'Resistance';
</script>

{#if showCard}
  <UIBackdrop on:click>
    <div class="rounded-lg text-center" transition:cardFlip>
      <div
        class="p-6 pb-3 mb-6
          rounded-lg shadow-2xl
          {cardColor} text-black
          ring-4 ring-offset-2 ring-offset-gray-900"
      >
        <div class="mb-6 text-9xl" style="text-shadow: 0 .02em .15em rgba(0,0,0,.4);">
          {$currentPlayer.avatar}
        </div>
        <div class="text-xl font-medium">{$currentPlayer.name}</div>
      </div>
      <h2 class="text-4xl font-bold tracking-tight {headingColor}">{headingText}</h2>
    </div>
  </UIBackdrop>
{:else}
  <button
    in:fly={{ y: 100, delay: 250 }}
    class="fixed left-0 bottom-0
      text-6xl ml-3 mb-3 p-3
      border border-white rounded-lg"
    on:click>{$currentPlayer.avatar}</button
  >
{/if}
