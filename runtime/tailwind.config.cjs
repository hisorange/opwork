/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  mode: 'jit',
  content: ['./src/view/**/*.{tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#00ffc8',
        secondary: '#46bdc6',
        midnight: '#15171b',
      },
      transitionTimingFunction: {
        blink: 'cubic-bezier(0.575, 1.51, 0.55, -0.58)',
      },
    },
  },
  plugins: [],
};
