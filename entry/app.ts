import { io } from 'socket.io-client';
const originURL = import.meta.env.VITE_CORS_ORIGIN_URL || '';
const socket = io(`${originURL}${window.location.pathname}`);

import App from '../components/App.svelte';
export default new App({
  target: document.body,
  props: {
    socket,
    currentPlayerIdSessionKey: window.sessionStorage.getItem('currentPlayerId'),
    renderAdminController: import.meta.env.DEV,
  },
});
