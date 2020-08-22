function blur(node, { delay = 0, duration = 1000, amount = 0.6 }) {
  const f = getComputedStyle(node).filter.replace(/^none$/, '');

  return {
    delay,
    duration,
    css: (t, u) => `opacity: ${t}; filter: ${f} blur(${u * amount}em)`,
  };
}

export { blur };
