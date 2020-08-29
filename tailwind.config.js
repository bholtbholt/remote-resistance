const plugin = require('tailwindcss/plugin');
const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./components/**/*.svelte'],
  theme: {
    borderRadius: {
      none: '0',
      sm: '.4rem',
      lg: '.8rem',
      round: '9999px',
    },
    borderWidth: {
      default: '.2rem',
      transparent: 'transparent',
      '0': '0',
    },
    colors: {
      primary: colors.teal,
      warning: colors.yellow,
      fail: colors.red,
      success: colors.blue,
      gray: colors.gray,
      black: colors.black,
      white: colors.white,
      current: colors.currentColor,
      transparent: colors.transparent,
    },
    fontSize: {
      xs: 'var(--font-xs)',
      sm: 'var(--font-sm)',
      md: 'var(--font-md)',
      lg: 'var(--font-lg)',
      xl: 'var(--font-xl)',
    },
    spacing: {
      xs: 'var(--space-xs)',
      sm: 'var(--space-sm)',
      md: 'var(--space-md)',
      lg: 'var(--space-lg)',
      xl: 'var(--space-xl)',
    },
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
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    opacity: ['disabled'],
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.outline': {
          boxShadow: `0 0 0 ${theme('borderWidth.default')} ${theme('colors.primary.500')}`,
        },
        '.blur': {
          filter: 'blur(0.6em)',
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
