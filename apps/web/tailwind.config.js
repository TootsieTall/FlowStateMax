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
        // Light black primary color scheme
        primary: {
          50: '#f5f5f5',   // Very light gray
          100: '#e0e0e0',  // Light gray
          200: '#bdbdbd',  // Medium light gray
          300: '#9e9e9e',  // Medium gray
          400: '#757575',  // Medium dark gray
          500: '#616161',  // Dark gray
          600: '#424242',  // Darker gray
          700: '#303030',  // Very dark gray
          800: '#212121',  // Light black
          900: '#1a1a1a',  // Darker black
        },
        // Accent colors that are easy on the eyes
        accent: {
          blue: '#4a90e2',     // Soft blue
          green: '#7cb342',    // Soft green
          orange: '#ff8c42',   // Soft orange
          purple: '#9c88ff',   // Soft purple
        },
        // Background colors optimized for reading
        background: {
          primary: '#ffffff',   // Pure white
          secondary: '#f8f9fa', // Very light gray
          tertiary: '#e9ecef',  // Light gray
        },
        // Text colors with optimal contrast
        text: {
          primary: '#212529',   // Almost black
          secondary: '#495057', // Dark gray
          tertiary: '#6c757d',   // Medium gray
          muted: '#adb5bd',     // Light gray
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
