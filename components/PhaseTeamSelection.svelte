<script>
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { fade, fly } from 'svelte/transition';

  import { leader } from '../stores/leader';
  import { players, playerIsLeader } from '../stores/player';
  import { currentRound } from '../stores/round';
  import { ruleset } from '../stores/rules';
  import { team } from '../stores/team';

  import UIBanner from './UIBanner.svelte';
  import UIButton from './UIButton.svelte';
  import UIHeading from './UIHeading.svelte';
  import { gridSize } from './view-helper';

  $: disableSelection = $team.length >= $currentRound.teamSize;
  $: enableSubmit = $team.length === $currentRound.teamSize;

  function selectPlayer() {
    socket.emit('team::selection', this.value);
  }

  function confirmTeam() {
    socket.emit('team::confirmation', $team);
    socket.emit('roundstate::set', 'TEAM_VOTE');
  }
</script>

<div id="PhaseTeamSelection" in:fade>
  {#if $playerIsLeader}
    <UIHeading>
      Pick <span class="text-teal-400 font-bold">{$currentRound.teamSize} players</span> for the {$currentRound.name}
      mission.
    </UIHeading>
  {/if}

  <form on:submit|preventDefault={confirmTeam}>
    <div class="grid {gridSize($ruleset.playerCount)} gap-2 mb-10">
      {#each $players.map((player) => {
        return { selected: $team.includes(player.id), ...player };
      }) as player}
        <label
          for="player_{player.id}"
          class="relative cursor-pointer
            p-1 rounded-lg text-center
            bg-white dark:bg-gray-700 shadow"
          class:ring-teal-400={player.selected}
          class:ring={player.selected}
          class:cursor-not-allowed={!$playerIsLeader || (disableSelection && !player.selected)}
          class:opacity-25={disableSelection && !player.selected}
        >
          <input
            id="player_{player.id}"
            class="absolute bottom-0 right-0 opacity-0"
            type="checkbox"
            on:click={selectPlayer}
            name="players[]"
            value={player.id}
            disabled={!$playerIsLeader || (disableSelection && !player.selected)}
          />
          <div class="py-2 text-5xl">{player.avatar}</div>
          <div
            class="truncate {player.selected
              ? 'text-teal-500 dark:text-teal-400 font-medium'
              : 'text-gray-600 dark:text-gray-300'}"
          >
            {player.name}
          </div>
        </label>
      {/each}
    </div>

    {#if $playerIsLeader && enableSubmit}
      <div in:fly={{ y: 200, duration: 600 }}>
        <UIButton>Confirm this team</UIButton>
      </div>
    {/if}
  </form>

  {#if !$playerIsLeader}
    <div in:fly={{ y: 200, duration: 600 }}>
      <UIBanner>
        <span class="font-extrabold">{$leader.name}</span> is picking {$currentRound.teamSize} players
        for the {$currentRound.name} mission.
      </UIBanner>
    </div>
  {/if}
</div>
