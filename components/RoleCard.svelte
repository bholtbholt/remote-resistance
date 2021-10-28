<script>
  export let showCard = false;
  import { fly, fade } from 'svelte/transition';
  import { cardFlip } from './custom-transitions';
  import { currentPlayer, playerIsASpy } from '../stores/player';

  $: ringColor = $playerIsASpy ? 'ring-offset-rose-500' : 'ring-offset-sky-400';
  $: headingColor = $playerIsASpy ? 'text-rose-600' : 'text-sky-400';
  $: headingText = $playerIsASpy ? "You're a Spy" : 'Resistance';
</script>

{#if showCard}
  <div
    class="fixed inset-0 z-10 cursor-pointer
      bg-black bg-opacity-75
      grid place-items-center h-screen"
    on:click
    transition:fade
  >
    <div class="rounded-lg ring-offset-8 ring-8 ring-indigo-600" transition:cardFlip>
      <div
        class="text-center rounded-lg p-6
        bg-white dark:bg-gray-800
        ring-4 ring-white dark:ring-gray-700 ring-offset-8 {ringColor}"
      >
        <h2 class="text-4xl mb-4 font-bold tracking-tight {headingColor}">{headingText}</h2>
        <div class="mb-2 text-9xl" style="font-size: 10rem;">{$currentPlayer.avatar}</div>
      </div>
    </div>
  </div>
{:else}
  <button in:fly={{ y: 100, delay: 250 }} class="fixed left-0 bottom-0 text-6xl mb-3" on:click
    >🃏</button
  >
{/if}
