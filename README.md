# Remote Resistance

Play Resistance with your friends anywhere – a real-time remote version of the game.

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
- [Parcel](https://parceljs.org).

## Structure and Content

- `./actions`: Public events emitted and listened for with socket.io.
- `./client`: Parcel entry files.
- `./client/css`: CSS Variable definitions and custom CSS components outside of Tailwind. Bundled with PostCSS by Parcel. See `tailwind.config.js` for definitions and extensions.
- `./components`: App UI, written in Svelte.
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
- `round{Number}Start{P|F: Pass|Fail}`, as in `roundTwoStartF` or `roundThreeStartFP`
- `round{Number}Team`, as in `roundOneTeam`
- `round{Number}VotesApproved`, as in `roundOneVotesApproved`
- `round{Number}VotesRejected`, as in `roundOneVotesRejected`
- `round{Number}VotesPending`, as in `roundOneVotesPending`
- `round{Number}TeamApproved`, as in `roundOneTeamApproved`
- `round{Number}TeamRejected`, as in `roundOneTeamRejected`
- `round{Number}NewVote`, as in `roundOneNewVote`
- `round{Number}LastVote`, as in `roundOneLastVote`
- `round{Number}MissionApproved`, as in `roundOneMissionApproved`
- `round{Number}MissionFailed`, as in `roundOneMissionFailed`

History states outside of rounds:

- `withPlayers` before the game has started
- `spiesWin` after the game with a spy victory
- `resistanceWin` after the game with a resistance victory

## Admin Control with App Controller

`AppController.svelte` is an admin tool for controlling player state. Change the logged-in player or the leader, see the spies, and log-out. It's controlled by `ADMIN` environment variable in your `.env` setting. It can't be set by CLI because Parcel doesn't support that.

```
# In your .env file
ADMIN=true
```

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
import 'ts-jest';
import { get } from 'svelte/store';
import { repeat } from './test-helper';

// For component tests:
import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
const socket = require('socket.io-client')('test');
```

## Troubleshooting

<dl>
  <dt>Tailwind changes aren't taking affect</dt>
  <dd>Parcel keeps a long-lived cache. Run <code>npm run clean</code> to delete the cache and built files.</dd>
  <dt>.env settings aren't taking affect</dt>
  <dd>Parcel keeps a long-lived cache. Run <code>npm run clean</code> to delete the cache and re-load it.</dd>
  <dt>Tests are failing as a group, but pass individually</dt>
  <dd>Jest runs tests with shared state, so you need to add <code>afterEach(() => { …; return; })</code> to undo the state.</dd>
</dl>