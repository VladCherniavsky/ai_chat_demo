import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:           '#000048',
          'navy-hover':   '#0a0a6e',
          teal:           '#248D95',
          'teal-dark':    '#1c7079',
          'teal-50':      '#edf7f8',
          lightblue:      '#82C7DE',
          'lightblue-10': '#f0f8fb',
        },
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
