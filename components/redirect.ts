import { nanoid } from 'nanoid/non-secure';

function redirect(code = undefined) {
  window.sessionStorage.removeItem('currentPlayerId');
  window.sessionStorage.removeItem('hideRoleReveal');
  window.location.replace(`/${code || nanoid(4)}`);
}

export { redirect };
