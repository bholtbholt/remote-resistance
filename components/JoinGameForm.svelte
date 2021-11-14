<script>
  import { currentPlayerId, players } from '../stores/player';
  import { nanoid } from 'nanoid/non-secure';

  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import UIButton from './UIButton.svelte';

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
    const player = {
      id: nanoid(),
      name: this.elements['name'].value,
      avatar: this.elements['avatar'].value,
    };

    socket.emit('player::add', player);
    currentPlayerId.set(player.id);
    this.reset();
  }
</script>

<form
  class="-mt-48 p-4 mb-10
    bg-white dark:bg-gray-800 bg-opacity-80
    rounded-lg shadow-2xl relative z-10"
  in:fly={{ y: -200, duration: 900 }}
  out:fade={{ duration: 150 }}
  on:submit|preventDefault={handleSubmit}
>
  <label
    for="name"
    class="border-b-4 border-indigo-200 dark:border-gray-600
      focus-within:border-teal-400
      block mb-8
      ease-out duration-200 transition-colors"
  >
    <div class="uppercase font-light tracking-widest text-sm text-indigo-700 dark:text-purple-300">
      Name
    </div>
    <input
      id="name"
      name="name"
      class="appearance-none focus:outline-none
        bg-transparent border-none w-full py-1
        text-gray-800 dark:text-gray-200 text-2xl"
      autocomplete="off"
      disabled={!enableForm}
      required
      autofocus
    />
  </label>

  <div
    class="uppercase font-light tracking-widest text-sm text-indigo-700 dark:text-purple-300 mb-2"
  >
    Avatar
  </div>
  <div class="grid grid-cols-5 gap-1 mb-8">
    {#each avatars as avatar, i}
      <label
        for="avatar_{i}"
        class="relative
          ease-out duration-200 transition-colors
          py-2 rounded-lg bg-white dark:bg-transparent
          text-center text-5xl"
        class:ring-teal-400={avatar === playerAvatar}
        class:ring={avatar === playerAvatar}
        class:opacity-25={takenAvatars.includes(avatar)}
        class:cursor-pointer={!takenAvatars.includes(avatar)}
      >
        <input
          id="avatar_{i}"
          class="absolute bottom-0 right-0 opacity-0"
          type="radio"
          bind:group={playerAvatar}
          name="avatar"
          value={avatar}
          disabled={takenAvatars.includes(avatar)}
        />
        {avatar}
      </label>
    {/each}
  </div>

  <UIButton disabled={!enableForm}>Join game</UIButton>
</form>
