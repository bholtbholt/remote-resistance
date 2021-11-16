# Remote Resistance

Play Resistance with your friends anywhere – a real-time remote version of the game.

## Deploying

Remote Resistance is served with [Heroku](https://dashboard.heroku.com/apps). Use the following commands for deploying:

```
# Deploying the main branch
git push heroku main

# Deploying a non-main branch
git push heroku other-branch:main

# Reset to main branch (must do after deploying another branch)
git push -f heroku main:main

```

### Additional Heroku Commands

```
# Tail logs
heroku logs --tail

# Run the Heroku app locally
npm run build
heroku local web

# Redeploy without changes (deploys twice and reverts empty commit)
git commit --allow-empty -m "Redeploy"; git push heroku main
git reset HEAD~; git push -f heroku main
```

## Installation

- Download the latest version of [Node](https://nodejs.org/en/) and NPM.
- Run `npm run setup`, which copies `.env` and runs `npm install`.
- Run `npm start` and visit `http://localhost:3000/`

### Tech

- [Svelte](https://svelte.dev).
- [TailwindCSS](https://tailwindcss.com).
- [TypeScript](https://www.typescriptlang.org).
- [Express Server](https://expressjs.com).
- [Socket.io](https://socket.io).
- [Vite](https://vitejs.dev).

## Structure and Content

- `./actions`: Public events emitted and listened for with socket.io.
- `./components`: App UI, written in Svelte.
- `./entry`: CSS + JavaScript entry files.
- `./server`: App server.
- `./stores`: Reactive Svelte stores used by the UI. Stores are similar to _Models_ in design. _Anything that should submit an public action should use a store_.
- `./tests`: Jest tests. All tests live in a flat directory so import statements match elsewhere. Store tests are prefixed with `__store__*` by convention.
- `./types`: Global types for the app.

## History

The app hosts multiple rooms via unique URL and shares history with any visitor to that URL. History is built from public actions and emitted with websockets on app load once with `history::init`. It follows an Event-Driven Architecture pattern.

If the visitor loses their connection, arrives late, or refreshes the page, the history replays events to bring them to the current state.

Players are "logged in" via `SessionStorage` and can only join a game prior to it starting. If a player loses their connection they will re-join the game if their login key matches a player in the game.

### Replay History in Development

In development, you can pass a `HISTORY` environment variable to quickly arrive at a given game state. The variable is the name of the `export const` for a given state. All states live in `./tests/history-states.ts`.

The server **must** be restarted for history to apply.

```
# From the CLI
HISTORY=withPlayers npm start
HISTORY=roundOneStart npm start
HISTORY=roundOneTeamApproved npm start

# OR In your .env file
HISTORY=withPlayers
```

Rounds use the following pattern:

- `round{Number}Start`, as in `roundOneStart`
- `round{Number}Team`, as in `roundOneTeam`
- `round{Number}VotesApproved`, as in `roundOneVotesApproved`
- `round{Number}VotesRejected`, as in `roundOneVotesRejected`
- `round{Number}VotesPending`, as in `roundOneVotesPending`
- `round{Number}TeamApproved`, as in `roundOneTeamApproved`
- `round{Number}TeamRejected`, as in `roundOneTeamRejected`
- `round{Number}NewVote`, as in `roundOneNewVote`
- `round{Number}LastVote`, as in `roundOneLastVote`
- `round{Number}MissionPassed`, as in `roundOneMissionPassed`
- `round{Number}MissionFailed`, as in `roundOneMissionFailed`

History states outside of rounds:

- `withPlayers` before the game has started

Rounds alternate resistance then spy win conditions:

- `roundTwoStart` = Round 1 resistance win
- `roundThreeStart` = Round 2 spy win
- `roundFourStart` = Round 3 resistance win
- `roundFiveStart` = Round 4 spy win

## AdminController

`AdminController.svelte` is a tool for controlling player state. Change the logged-in player or the leader, see the spies, and log-out. It's turned on for development.

## Testing

Tests are written with [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro#this-solution) and [Jest](https://jestjs.io).

Run `npm run test` for the Jest watcher.

### Test Helpers

- `AppFixture.svelte`: For wrapping a given Svelte component for isolated testing. Takes the `socket` connection and `component`.
- `history-states.ts`: Actions to rebuild history to any given state.
- `test-helper.ts`: Helper functions.

### Test setup

Most tests need the following boilerplate:

```typescript
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import AppFixture from './AppFixture.svelte';
import Component from './Component.svelte';
import { currentPlayerId } from '../stores/player';
import { createHistoryEvent, historyState, players } from './history-states';
const socket = require('socket.io-client')('test');

test('should do a thing', () => {
  const [player] = players;
  currentPlayerId.set(player.id);

  const { getByRole } = render(AppFixture, {
    socket,
    component: Component,
    historyState: historyState,
  });

  const element = getByRole();
});
```

Using `history-states` is the easiest way to build up a true state in the application with little effort. Import the history events needed to land at any given state.

## Troubleshooting

<dl>
  <dt>Tests are failing as a group, but pass individually</dt>
  <dd>Jest runs tests with shared state, so you need to add <code>afterEach(() => { …; return; })</code> to undo the state.</dd>
  <dt>The app is running, but the loading state never ends</dt>
  <dd>You probably have a typo in your ENV URLS, likely `VITE_CORS_ORIGIN_URL`. Make sure there are no trailing slashes at the end of the URL. The socket queries against `window.location.pathname`, which returns something like `/game-id`.</dd>
</dl>
