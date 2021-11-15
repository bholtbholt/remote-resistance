import { nanoid } from 'nanoid/non-secure';

function redirect() {
  window.sessionStorage.removeItem('currentPlayerId');
  window.sessionStorage.removeItem('hideRoleReveal');
  window.location.replace(`/${nanoid(4)}`);
}

export { redirect };
