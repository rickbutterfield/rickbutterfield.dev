/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    fontFamily: {
      sans: [
        '"Inter"',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'sans-serif',
      ],
      heading: [
        '"Hanken Grotesk"',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'sans-serif',
      ],
      mono: [
        '"IBM Plex Mono"',
        'ui-monospace',
        '"SFMono-Regular"',
        '"SF Mono"',
        'Menlo',
        'Consolas',
        'monospace',
      ],
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
      screens: {
        '3xl': '1600px'
      }
    },
	},
	plugins: [
    require('@tailwindcss/typography')
  ],
}
