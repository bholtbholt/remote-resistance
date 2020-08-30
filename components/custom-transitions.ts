export function blur(node, { delay = 0, duration = 1000, amount = 0.6 }) {
  const f = getComputedStyle(node).filter.replace(/^none$/, '');

  return {
    delay,
    duration,
    css: (t, u) => `opacity: ${t}; filter: ${f} blur(${u * amount}em)`,
  };
}

export function rotate(
  node,
  { delay = 0, duration = 400, x = -160, y = 100, deg = -30, origin = 'top right' },
) {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  return {
    delay,
    duration,
    css: (t, u) => `
      transform: ${transform}
        rotate(${(1 - t) * deg}deg)
        translate(${(1 - t) * x}%, ${(1 - t) * y}%);
      transform-origin: ${origin};`,
  };
}
