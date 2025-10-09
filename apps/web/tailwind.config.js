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
        // Light black/charcoal primary color scheme
        primary: {
          50: '#e8e8e8',   // Light gray for highlights
          100: '#d0d0d0',  // Lighter gray
          200: '#b8b8b8',  // Medium light gray
          300: '#909090',  // Medium gray
          400: '#686868',  // Medium dark gray
          500: '#505050',  // Dark gray (default)
          600: '#404040',  // Darker gray
          700: '#303030',  // Very dark gray
          800: '#242424',  // Light black
          900: '#1a1a1a',  // Darkest black
          DEFAULT: '#303030', // Default primary color
        },
        // Accent colors with good contrast on dark backgrounds
        accent: {
          blue: '#60a5fa',     // Bright soft blue
          green: '#86efac',    // Bright soft green
          orange: '#fdba74',   // Bright soft orange
          purple: '#c084fc',   // Bright soft purple
          yellow: '#fcd34d',   // Bright soft yellow
        },
        // Teal for primary buttons - pops nicely without being aggressive
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Main teal
          600: '#0d9488',  // Primary button color
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Coral for buttons - warm complement to teal
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd1c7',
          300: '#ffb09f',
          400: '#ff8b6d',
          500: '#ff6b4a',  // Main coral
          600: '#f04f2f',  // Button color - pops beautifully
          700: '#d63d1f',
          800: '#b0311a',
          900: '#8f2a1a',
        },
        // Amber for quotes and accents
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warm amber for quotes
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Background colors for light black theme
        background: {
          primary: '#1a1a1a',   // Darkest background
          secondary: '#242424', // Secondary dark
          tertiary: '#303030',  // Tertiary dark
          card: '#2a2a2a',      // Card background
        },
        // Text colors with optimal contrast on dark
        text: {
          primary: '#f5f5f5',   // Almost white
          secondary: '#d0d0d0', // Light gray
          tertiary: '#a0a0a0',  // Medium gray
          muted: '#707070',     // Muted gray
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
