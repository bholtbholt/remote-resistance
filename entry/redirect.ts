import { nanoid } from 'nanoid/non-secure';

function redirect() {
  window.sessionStorage.removeItem('currentPlayerId');
  window.sessionStorage.removeItem('hideRoleReveal');
  window.location.pathname = `/${nanoid(4)}`;
}

export { redirect };
