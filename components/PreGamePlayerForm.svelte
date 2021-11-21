<script>
  import { currentPlayerId, players } from '../stores/player';
  import { nanoid } from 'nanoid/non-secure';

  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import UIButton from './UIButton.svelte';
  import UIFormLink from './UIFormLink.svelte';
  import UIFormText from './UIFormText.svelte';
  import UIFormLabel from './UIFormLabel.svelte';

  // prettier-ignore
  const avatars = [
    '🐶','🐱','🦊','🐯','🦁',
    '🐸','🐼','🐨','🐵','🐻',
    '🐹','🐰','🐷','🐳','🐙',
    '🌞','👹','🐲','🤡','🤖',
    '☘️','🍄','🌺','🌸','🌼'
  ];
  let playerName;
  let playerAvatar;
  let enableForm = true;
  $: takenAvatars = $players.map((player) => player.avatar);
  // Select default avatar from available avatars
  onMount(() => {
    playerAvatar = avatars.filter((n) => !takenAvatars.includes(n))[0];
  });

  function joinGame() {
    enableForm = false;
    const player = {
      id: nanoid(),
      name: playerName,
      avatar: playerAvatar,
    };

    socket.emit('player::add', player);
    currentPlayerId.set(player.id);
    this.reset();
  }
</script>

<form on:submit|preventDefault={joinGame}>
  <UIFormText
    id="name"
    name="name"
    bind:value={playerName}
    disabled={!enableForm}
    required
    autofocus
  >
    Name
  </UIFormText>

  <UIFormLabel class="mb-2">Avatar</UIFormLabel>
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
          required
        />
        {avatar}
      </label>
    {/each}
  </div>

  <UIButton class="mb-6" disabled={!enableForm}>Join game</UIButton>
  <UIFormLink on:click>Change game</UIFormLink>
</form>
