import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const randomNamespace = uniqueNamesGenerator({
  dictionaries: [adjectives, animals],
  separator: '-',
  length: 2,
});

function redirect() {
  window.sessionStorage.removeItem('currentPlayerId');
  window.sessionStorage.removeItem('hideRoleReveal');
  window.location.pathname = `/${randomNamespace}`;
}

export { redirect };
