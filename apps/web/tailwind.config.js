/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          dark: '#1565C0',
          light: '#42A5F5',
        },
        deepwork: {
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
        },
        meeting: '#6B7280',
        break: '#10B981',
        gym: '#F97316',
      },
      animation: {
        'breathe-in': 'breathe-in 5s ease-in-out',
        'breathe-out': 'breathe-out 5s ease-in-out',
      },
      keyframes: {
        'breathe-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'breathe-out': {
          '0%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}