import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')(window.location.pathname);

// Redirect if hitting the parent root
if (window.location.pathname === '/') {
  window.location.pathname = `/${uuid()}`;
}

import App from './components/App.svelte';
export default new App({
  target: document.body,
  props: {
    socket,
  },
});
