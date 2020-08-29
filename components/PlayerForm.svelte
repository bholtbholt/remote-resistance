<script type="text/typescript" lang="ts">
  import type { Player } from '../types';
  import { currentPlayerId, players } from '../stores/player';
  import { v4 as uuid } from 'uuid';

  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  // prettier-ignore
  const avatars = [
    '🐶','🐱','🦊','🐯','🦁',
    '🐸','🐼','🐨','🐵','🐻',
    '🐹','🐰','🐷','🐳','🐙',
    '🌞','👹','🐲','🤡','🤖',
    '☘️','🍄','🌺','🌸','🌼'
  ];
  let playerAvatar;
  let enableForm = true;
  $: takenAvatars = $players.map((player) => player.avatar);
  // Select default avatar from available avatars
  onMount(() => {
    playerAvatar = avatars.filter((n) => !takenAvatars.includes(n))[0];
  });

  function handleSubmit() {
    enableForm = false;
    const player: Player = {
      id: uuid(),
      name: this.elements['name'].value,
      avatar: this.elements['avatar'].value,
    };

    socket.emit('player::add', player);
    currentPlayerId.set(player.id);
    this.reset();
  }
</script>

<form
  class="bg-white rounded-lg shadow-xl mx-lg mb-xl -mt-xl p-lg relative z-10"
  in:fly="{{ y: -200, duration: 900 }}" out:fade="{{ duration: 150 }}"
  on:submit|preventDefault="{handleSubmit}">

  <label for="name"
    class="border-b border-gray-400 focus-within:border-primary-500 pb-sm mb-lg block transition-colors duration-200 ease-in" >
    <div class="text-sm uppercase text-gray-500 font-bold mb-xs">Name:</div>
    <input id="name"
      name="name"
      class="appearance-none bg-transparent border-none w-full text-gray-800 text-lg focus:outline-none"
      autocomplete="off"
      disabled="{!enableForm}"
      required
      autofocus />
  </label>

  <div class="text-sm uppercase text-gray-500 font-bold mb-sm">Avatar:</div>
  <div class="grid grid-cols-5 grid-rows-2 mb-lg">
    {#each avatars as avatar, i}
    <label for="avatar_{i}"
      class="relative text-center rounded-sm ease-in duration-75 transition-shadow"
      class:outline={avatar === playerAvatar}
      class:opacity-25="{takenAvatars.includes(avatar)}">
      <input id="avatar_{i}"
        class="absolute bottom-0 right-0 opacity-0"
        type=radio
        bind:group={playerAvatar}
        name="avatar"
        value={avatar}
        disabled={takenAvatars.includes(avatar)}>
      <svg viewBox="0 0 20 20">
        <text x="51%" y="78%" class="align-middle overflow-visible" style="text-anchor: middle;">{avatar}</text>
      </svg>
    </label>
    {/each}
  </div>

  <button disabled="{!enableForm}" class="btn-primary font-bold text-lg w-full">
    {#if enableForm}
      Join game
    {:else}
      <div class="loading-dots mx-auto my-sm"></div>
    {/if}
  </button>
</form>
