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
		extend: {
      typography: ({theme}) => ({
        white: {
          css: {
            '--tw-prose-body': theme('colors.zinc[900]'),
            '--tw-prose-headings': theme('colors.zinc[900]'),
            '--tw-prose-lead': theme('colors.zinc[900]'),
            '--tw-prose-invert-body': theme('colors.zinc[50]'),
            '--tw-prose-invert-headings': theme('colors.zinc[50]'),
            '--tw-prose-invert-lead': theme('colors.zinc[50]'),
          }
        }
      }),
      screens: {
        '3xl': '1600px'
      }
    },
	},
	plugins: [
    require('@tailwindcss/typography')
  ],
}
