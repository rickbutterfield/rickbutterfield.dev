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
            '--tw-prose-body': theme('colors.imperial-primer[950]'),
            '--tw-prose-headings': theme('colors.imperial-primer[950]'),
            '--tw-prose-lead': theme('colors.imperial-primer[950]'),
            '--tw-prose-links': theme('colors.imperial-primer[950]'),
            '--tw-prose-invert-body': theme('colors.chalk[50]'),
            '--tw-prose-invert-headings': theme('colors.chalk[50]'),
            '--tw-prose-invert-lead': theme('colors.chalk[50]'),
          }
        }
      }),
      colors: {
        'chalk': {
          '50': '#f4f4f0', //default
          '100': '#edede7',
          '200': '#dad9ce',
          '300': '#c3c2ae',
          '400': '#aaa78d',
          '500': '#999476',
          '600': '#8c856a',
          '700': '#756d59',
          '800': '#605a4c',
          '900': '#4f4a3f',
          '950': '#2a2620',
        },
        'mesa-sunrise': {
          '50': '#fdf5f3',
          '100': '#fde9e3',
          '200': '#fcd7cc',
          '300': '#f8bca9',
          '400': '#f29477',
          '500': '#ea8160', //default
          '600': '#d4562e',
          '700': '#b24523',
          '800': '#933c21',
          '900': '#7b3721',
          '950': '#421a0d',
        },
        'imperial-primer': {
          '50': '#f5f8fa',
          '100': '#e9eff5',
          '200': '#cfdde8',
          '300': '#a4c1d5',
          '400': '#73a0bd',
          '500': '#5284a5',
          '600': '#3f6a8a',
          '700': '#345670',
          '800': '#2e495e',
          '900': '#2a3f50',
          '950': '#21303e', //default
        },
      },
      screens: {
        '3xl': '1600px'
      }
    },
	},
	plugins: [
    require('@tailwindcss/typography')
  ],
}
