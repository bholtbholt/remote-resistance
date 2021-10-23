const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './components/**/*'],
  theme: {
    extend: {
      animation: {
        'slow-pulse': 'slow-pulse 3s cubic-bezier(0, 0, 0.2, 1) infinite',
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
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.blur': {
          filter: 'blur(0.6em)',
        },
        '.outline': {
          boxShadow: `0 0 0 ${theme('borderWidth.default')} ${theme('colors.teal.500')}`,
        },
        '.outline-blue-700': {
          boxShadow: `0 0 0 ${theme('borderWidth.lg')} ${theme('colors.blue.700')}`,
        },
        '.outline-red-700': {
          boxShadow: `0 0 0 ${theme('borderWidth.lg')} ${theme('colors.red.700')}`,
        },
        '.text-anchor-middle': {
          textAnchor: 'middle',
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
