import { cubicOut } from 'svelte/easing';

export function blur(node, { delay = 0, duration = 1000, amount = 0.6 }) {
  const f = getComputedStyle(node).filter.replace(/^none$/, '');

  return {
    delay,
    duration,
    css: (t, u) => `opacity: ${t}; filter: ${f} blur(${u * amount}em)`,
  };
}

export function cardFlip(node, { delay = 0, duration = 400, flip = false }) {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const [x, deg, origin] = flip ? [160, 30, 'left'] : [-160, -30, 'right'];

  return {
    delay,
    duration,
    easing: cubicOut,
    css: (t, u) => `
      transform: ${transform}
        rotate(${(1 - t) * deg}deg)
        translate(${(1 - t) * x}%, ${(1 - t) * 100}%);
      transform-origin: top ${origin};`,
  };
}

export function rotate(
  node,
  { delay = 0, duration = 400, x = 0, y = 0, deg = -30, easing = cubicOut },
) {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const o = +style.opacity;

  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
      transform: ${transform}
        rotate(${(1 - t) * deg}deg)
        translate(${(1 - t) * x}%, ${(1 - t) * y}%);
      opacity: ${t * o};`,
  };
}
