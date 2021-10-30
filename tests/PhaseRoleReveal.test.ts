import { render } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import PhaseRoleReveal from '../components/PhaseRoleReveal.svelte';
import { currentPlayerId } from '../stores/player';
import { roundOneStart, players } from './history-states';
const socket = require('socket.io-client')('test');

describe('when player is resistance', () => {
  test('should show resistance', () => {
    const [spy1, spy2, spy3, player] = players;
    currentPlayerId.set(player.id);

    const { container, getByRole } = render(AppFixture, {
      socket,
      component: PhaseRoleReveal,
      historyState: roundOneStart,
    });

    const h2 = getByRole('heading', {
      name: "You're part of the resistance , but there are 3 spies in your midst.",
    });

    expect(h2);
    expect(container.querySelectorAll('#playerList > li').length).toEqual(7);
  });
});

describe('when player is a spy', () => {
  test('should show spies', () => {
    const [spy1, spy2, spy3] = players;
    currentPlayerId.set(spy1.id);

    const { container, getByRole } = render(AppFixture, {
      socket,
      component: PhaseRoleReveal,
      historyState: roundOneStart,
    });

    const h2 = getByRole('heading', {
      name: `You, ${spy2.name}, and ${spy3.name} are spies amongst the resistance!`,
    });

    expect(h2);
    expect(container.querySelectorAll('#playerList > li').length).toEqual(3);
  });
});
