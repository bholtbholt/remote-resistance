<script>
  import UIDrawer from './UIDrawer.svelte';
</script>

<header class="mb-8 flex items-center">
  <UIDrawer class="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 p-3 pb-6">
    <section class="mb-8">
      <h4 class="text-xl font-bold">How to play</h4>
      <p class="mb-3">
        There are 2 teams, <strong class="text-sky-400">resistance</strong> and
        <strong class="text-rose-500">spies</strong>. The first team to
        <strong>win 3 missions</strong> within 5 rounds wins the game.
      </p>
      <h5 class="font-bold">How to win as <strong class="text-sky-400">resistance</strong></h5>
      <ul class="list-disc pl-5 mb-3">
        <li>Figure out who the spies are.</li>
        <li>Get on missions and pass them.</li>
        <li>Reject picks with spies.</li>
      </ul>
      <h5 class="font-bold">How to win as <strong class="text-rose-500">spies</strong></h5>
      <ul class="list-disc pl-5 mb-3">
        <li>Keep your identity a secret.</li>
        <li>Get on missions and fail them.</li>
        <li>Reject picks without a spy.</li>
      </ul>
      <h5 class="font-bold">Gameplay</h5>
      <ul class="space-y-1 list-disc pl-5 mb-3">
        <li>
          Everyone is randomly assigned to a team. Spies know other spies, but resistance only knows
          the number of spies.
        </li>
        <li>
          At the start of each round, the leader picks players to go on a mission, then everyone
          votes to approve or reject the pick. If rejected, a new leader picks. Spies win the game
          if there are 5 rejections in a row.
        </li>
        <li>
          Players on the mission decide the outcome of the round. Resistance pass missions, while
          spies can pass or fail. A new round starts when the mission is complete.
        </li>
      </ul>
    </section>
  </UIDrawer>
  <h1 class="font-light tracking-tight text-indigo-200 dark:text-gray-300 text-xl ml-2">
    Remote Resistance
  </h1>
  <span class="px-1 text-xs leading-snug rounded-full bg-rose-100 text-rose-800 self-start">
    beta
  </span>
  <div
    id="game-code"
    class="ml-auto px-1 rounded
      border border-indigo-200 text-indigo-200
      dark:border-gray-300 dark:text-gray-300"
  >
    {window.location.pathname.slice(1)}
  </div>
</header>
