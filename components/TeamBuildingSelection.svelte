<script type="text/typescript" lang="ts">
  import { getContext } from 'svelte';
  const socket = getContext('socketIORoom');

  import { fade, fly } from 'svelte/transition';

  import { leader } from '../stores/leader';
  import { players, playerIsLeader } from '../stores/player';
  import { currentRound } from '../stores/round';
  import { ruleset } from '../stores/rules';
  import { team } from '../stores/team';

  import Spinner from './Spinner.svelte';
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

<div id="TeamBuildingSelection" in:fade>
  {#if $playerIsLeader}
    <h2 class="heading text-gray-100 mb-lg text-center">
      Pick <span class="text-success-300">{$currentRound.teamSize} players</span> for the {$currentRound.name}
      mission.
    </h2>
  {/if}

  <form on:submit|preventDefault={confirmTeam}>
    <div
      class="grid {gridSize($ruleset.playerCount)} -mx-lg mb-xl gap-xs border solid border-gray-800">
      {#each $players.map((player) => {
        return { selected: $team.includes(player.id), ...player };
      }) as player}
        <label
          for="player_{player.id}"
          class="relative text-center bg-white rounded-sm ease-in duration-75 transition-shadow
            cursor-pointer"
          class:outline={player.selected}
          class:cursor-not-allowed={!$playerIsLeader || (disableSelection && !player.selected)}
          class:opacity-25={disableSelection && !player.selected}>
          <input
            id="player_{player.id}"
            class="absolute bottom-0 right-0 opacity-0"
            type="checkbox"
            on:click={selectPlayer}
            name="players[]"
            value={player.id}
            disabled={!$playerIsLeader || (disableSelection && !player.selected)} />
          <svg viewBox="0 0 20 20">
            <text x="50%" y="80%" class="align-middle overflow-visible text-anchor-middle">
              {player.avatar}
            </text>
          </svg>
          <div class="truncate px-xs mb-sm text-gray-700" class:font-extrabold={player.selected}>
            {player.name}
          </div>
        </label>
      {/each}
    </div>

    {#if $playerIsLeader && enableSubmit}
      <button class="btn-primary font-bold text-lg w-full" in:fly={{ y: 200, duration: 600 }}>
        Confirm this team
      </button>
    {/if}
  </form>

  {#if !$playerIsLeader}
    <div
      class="bg-success-200 rounded-lg shadow-xl mx-lg mb-xl p-md relative z-10 flex items-center"
      in:fly={{ y: 200, duration: 600 }}>
      <Spinner color="text-success-700" margins="mr-md" />
      <h2 class="text-lg text-success-900">
        <span class="font-extrabold">{$leader.name}</span> is picking {$currentRound.teamSize} players
        for the {$currentRound.name} mission.
      </h2>
    </div>
  {/if}
</div>
