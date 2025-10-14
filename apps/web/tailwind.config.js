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
        // DARK SUNRISE THEME - Pre-dawn darkness with sunrise breaking through

        // Neutral / Dark Base Colors
        'bg-primary': '#0b0b0b',       // Deep blackish base background
        'bg-secondary': '#141414',     // Slightly lighter for section contrast
        'bg-elevated': '#1e1e1e',      // Used for cards, modals, panels
        'bg-surface': '#252525',       // Slightly lighter surface for overlays

        // Accent / Sunrise Highlights
        'accent-gold': '#FFC857',      // Primary accent for CTAs, highlights
        'accent-orange': '#FF8C42',    // Secondary accent for interactive states
        'accent-warm': '#FFB84D',      // Soft warm tone for subtle glows

        // Text / Typography
        'text-primary': '#F5F2ED',     // Warm off-white for main text
        'text-secondary': '#B8B0A8',   // Muted warm gray for subtext
        'text-tertiary': '#6B6560',    // Dim warm gray for less important text

        // Supporting Elements
        'border-default': '#2C2C2C',   // Card / component borders
      },
      
      // Glow System (replaces shadows for dark backgrounds)
      boxShadow: {
        'glow-subtle': '0 0 10px rgba(255, 184, 77, 0.1), 0 0 20px rgba(255, 184, 77, 0.05)',
        'glow-medium': '0 0 15px rgba(255, 184, 77, 0.2), 0 0 30px rgba(255, 184, 77, 0.1), 0 4px 6px rgba(0, 0, 0, 0.3)',
        'glow-strong': '0 0 20px rgba(255, 200, 87, 0.3), 0 0 40px rgba(255, 200, 87, 0.15), 0 8px 16px rgba(0, 0, 0, 0.4)',
        'glow-interactive': '0 0 25px rgba(255, 140, 66, 0.4), 0 0 50px rgba(255, 140, 66, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      
      // Border Radius - Warm, rounded corners
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'warm': '8px',      // Alias for semantic use
        'warm-lg': '12px',  // Alias for semantic use
      },
      
      // Transition System
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '400ms',
      },
      
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // Typography Scale
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      
      // Animation Keyframes
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 184, 77, 0.3), 0 0 40px rgba(255, 184, 77, 0.15), 0 8px 16px rgba(0, 0, 0, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 184, 77, 0.5), 0 0 60px rgba(255, 184, 77, 0.25), 0 12px 24px rgba(0, 0, 0, 0.5)',
          },
        },
        'pulse-subtle': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.02)',
          },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2.5s ease-in-out infinite',
        'bounce-in': 'bounce-in 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};
