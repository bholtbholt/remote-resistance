<script type="text/typescript" lang="ts">
  import type { Player } from 'types';
  import { players } from './player-store';
  import { v4 as uuid } from 'uuid';

  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');
  socket.on('player::add', players['player::add']);

  // prettier-ignore
  const avatars = [
    '🐶','🐱','🦊','🐯','🦁',
    '🐸','🐼','🐨','🐵','🐻',
    '🐹','🐰','🐷','🐳','🐙',
    '🌞','👹','🐲','🤡','🤖',
    '☘️','🍄','🌺','🌸','🌼'
  ];
  $: selectedAvatars = $players.map((player) => player.avatar);
  $: checkedAvatar = avatars.filter((n) => !selectedAvatars.includes(n))[0];

  function handleSubmit() {
    const player: Player = {
      id: uuid(),
      name: this.elements['name'].value,
      avatar: this.elements['avatar'].value,
    };

    socket.emit('player::add', player);
    this.reset();
  }
</script>

<ul>
  {#each $players as { avatar, name }}
  <li>{avatar} {name}</li>
  {/each}
</ul>

<form on:submit|preventDefault="{handleSubmit}">
  <label for="name">
    Name: <input id="name" name="name" autocomplete="off" required autofocus />
  </label>
  <div>
    {#each avatars as avatar, i}
    <label for="avatar_{i}">
      <input id="avatar_{i}" type=radio name="avatar" value={avatar} checked={checkedAvatar ===
      avatar} disabled={selectedAvatars.includes(avatar)}>{avatar}
    </label>
    {/each}
  </div>

  <button>Join Room</button>
</form>
