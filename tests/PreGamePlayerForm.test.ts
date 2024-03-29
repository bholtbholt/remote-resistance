import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import PreGamePlayerForm from '../components/PreGamePlayerForm.svelte';
import { currentPlayerId, players } from '../stores/player';
const socket = require('socket.io-client')('test');

test('should enable the form by default', () => {
  const { getByText, getByLabelText } = render(AppFixture, {
    socket,
    component: PreGamePlayerForm,
  });

  const nameField = getByLabelText('Name') as HTMLInputElement;
  const button = getByText('Join game') as HTMLButtonElement;

  expect(nameField.disabled).toEqual(false);
  expect(button.disabled).toEqual(false);
});

test('should disable the button on submit', async () => {
  const { getByText } = render(AppFixture, { socket, component: PreGamePlayerForm });

  const button = getByText('Join game') as HTMLButtonElement;
  await fireEvent.submit(button.form);

  expect(button.disabled).toEqual(true);
});

test('should set the current player', async () => {
  jest.spyOn(currentPlayerId, 'set');
  const { getByText, getByLabelText } = render(AppFixture, {
    socket,
    component: PreGamePlayerForm,
  });

  const nameField = getByLabelText('Name') as HTMLInputElement;
  const button = getByText('Join game') as HTMLButtonElement;

  await fireEvent.submit(button.form);

  expect(currentPlayerId.set).toBeCalled();
});

test('should add the player to the room', async () => {
  jest.spyOn(socket, 'emit');
  const { getByText, getByLabelText } = render(AppFixture, {
    socket,
    component: PreGamePlayerForm,
  });

  const nameField = getByLabelText('Name') as HTMLInputElement;
  await fireEvent.input(nameField, { target: { value: 'Binks' } });

  const button = getByText('Join game') as HTMLButtonElement;
  await fireEvent.submit(button.form);

  expect(socket.emit).toHaveBeenCalledWith(
    'player::add',
    expect.objectContaining({ name: 'Binks', avatar: '🐶' }),
  );
});

test('should disable avatars that players have selected', () => {
  players['player::add']({ id: '1234', avatar: '🐶', name: 'Binks' });
  const { getByText, getByRole } = render(AppFixture, { socket, component: PreGamePlayerForm });

  const button = getByText('Join game') as HTMLButtonElement;
  const dogAvatar = getByRole('radio', { name: '🐶' }) as HTMLInputElement;
  const catAvatar = getByRole('radio', { name: '🐱' }) as HTMLInputElement;

  expect(dogAvatar.disabled).toEqual(true);
  expect(catAvatar.disabled).toEqual(false);
  expect(catAvatar.checked).toEqual(true);
});
