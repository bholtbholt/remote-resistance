import { v4 as uuid } from 'uuid';

function redirect() {
  window.sessionStorage.removeItem('currentPlayerId');
  window.location.pathname = `/${uuid()}`;
}

export { redirect };
