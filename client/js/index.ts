import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')(window.location.pathname);

// Hitting the root sends the player to a brand new room and should feel like
// the first time they've been on the app – so we clear storage and redirect
if (window.location.pathname === '/') {
  window.sessionStorage.removeItem('currentPlayerId');
  window.location.pathname = `/${uuid()}`;
}

import App from './components/App.svelte';
export default new App({
  target: document.body,
  props: {
    socket,
    currentPlayerIdSessionKey: window.sessionStorage.getItem('currentPlayerId'),
  },
});
