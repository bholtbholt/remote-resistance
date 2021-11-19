import { redirect } from './redirect';
import { io } from 'socket.io-client';
const originURL = import.meta.env.VITE_CORS_ORIGIN_URL || '';
const socket = io(`${originURL}${window.location.pathname}`);

// Hitting the root sends the player to a brand new room and should feel like
// the first time they've been on the app – so we clear storage and redirect
if (window.location.pathname === '/') redirect();

import App from '../components/App.svelte';
export default new App({
  target: document.body,
  props: {
    socket,
    currentPlayerIdSessionKey: window.sessionStorage.getItem('currentPlayerId'),
    renderAdminController: import.meta.env.DEV,
  },
});
