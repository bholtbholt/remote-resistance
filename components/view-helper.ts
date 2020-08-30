export function gridSize(playerCount) {
  const gridMap = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-3 grid-rows-2',
    7: 'grid-cols-4 grid-rows-2',
    8: 'grid-cols-4 grid-rows-2',
    9: 'grid-cols-5 grid-rows-2',
    10: 'grid-cols-5 grid-rows-2',
  };

  return gridMap[playerCount];
}

export function playerNamesToSentance(players, currentPlayer = '') {
  let sentance;

  const index = players.indexOf(currentPlayer);

  if (index !== -1) {
    players.splice(index, 1);
    sentance = toSentance(['You', ...players]);
  } else {
    sentance = toSentance(players);
  }

  return sentance;
}

export function toSentance(words) {
  let sentance;

  if (words.length === 2) {
    sentance = words.join(' and ');
  } else {
    words.push('and ' + words.pop());
    sentance = words.join(', ');
  }

  return sentance;
}
