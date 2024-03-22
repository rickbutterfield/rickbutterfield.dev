/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    fontFamily: {
      sans: [
        'InterVariable',
        'Inter',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ]
    },
		extend: {},
	},
	plugins: [],
}
