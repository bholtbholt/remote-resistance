import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import RevealRole from '../components/RevealRole.svelte';
import { get } from 'svelte/store';
import { currentPlayerId, players } from '../components/player-store';
import { generateRuleset, ruleset } from '../components/rules-store';
import { createPlayer, repeat } from './test-helper';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return players.set([]);
});

afterEach(() => {
  return currentPlayerId.set('');
});

test('should show resistance', () => {
  const spy1 = createPlayer();
  const spy2 = createPlayer();
  const player = createPlayer();
  players['player::add'](spy1);
  players['player::add'](spy2);
  players['player::add'](player);
  currentPlayerId.set(player.id);
  repeat(2, () => {
    players['player::add'](createPlayer());
  });

  let rules = generateRuleset(get(players));
  rules.spyIds = [spy1.id, spy2.id];
  ruleset.set(rules);

  const { container, getByRole } = render(AppFixture, { socket, component: RevealRole });

  const h2 = getByRole('heading', {
    name: "You're part of the resistance , but there are 2 spies in your midst.",
  });

  expect(h2);
  expect(container.querySelectorAll('#playerList > li').length).toEqual(5);
});

test('should show spies if player is a spy', () => {
  const player = createPlayer();
  const spy2 = createPlayer({ name: 'Zuku' });
  players['player::add'](player);
  players['player::add'](spy2);
  currentPlayerId.set(player.id);
  repeat(3, () => {
    players['player::add'](createPlayer());
  });

  let rules = generateRuleset(get(players));
  rules.spyIds = [player.id, spy2.id];
  ruleset.set(rules);

  const { container, getByRole } = render(AppFixture, { socket, component: RevealRole });

  const h2 = getByRole('heading', { name: 'You and Zuku are spies amongst the resistance!' });

  expect(h2);
  expect(container.querySelectorAll('#playerList > li').length).toEqual(2);
});
