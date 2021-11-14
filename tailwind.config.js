const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './components/**/*'],
  theme: {
    extend: {
      animation: {
        'slow-pulse': 'slow-pulse 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      colors: {
        orange: colors.orange,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        rose: colors.rose,
      },
      keyframes: {
        'slow-pulse': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '25%, 100%': { transform: 'scale(2)', opacity: 0 },
        },
      },
      minHeight: {
        xl: 'var(--space-xl)',
      },
      transitionProperty: {
        border: 'border',
      },
      scale: {
        flip: '-1',
      },
      zIndex: {
        n: '-1',
      },
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    opacity: ['disabled'],
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.blur': {
          filter: 'blur(0.6em)',
        },
        '.bg-inherit': {
          backgroundColor: 'inherit',
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
