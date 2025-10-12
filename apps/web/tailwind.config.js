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
        // DAYBREAK GOLDEN HOUR THEME
        
        // Background System - Warm cream layers (Light → Dark for depth) - Toned down for comfort
        dawn: {
          50: '#F8F6F3',   // Lightest - peak highlights (toned down)
          100: '#F5F2ED',  // Primary page background (less bright)
          200: '#F0EBE3',  // Secondary background / elevated cards
          300: '#E8DFD4',  // Elevated elements / hover states
          400: '#E0D4C5',  // Deeper elevation / active states
        },
        
        // Text System - Warm browns (Light → Dark)
        bark: {
          100: '#A67C52',  // Tertiary text (muted)
          200: '#8B6442',  // Muted interactive text
          300: '#6B4423',  // Secondary text
          400: '#4A2F1A',  // Strong emphasis
          500: '#2C1810',  // Primary text (deep warm brown)
        },
        
        // Primary Accent - Energizing Sunset Orange (slightly muted)
        sunset: {
          100: '#F5DED3',  // Lightest tint / backgrounds (toned down)
          200: '#F0C9B0',  // Light background / subtle highlights
          300: '#E5AB87',  // Hover state
          400: '#E87D42',  // Active/Focus state (amber)
          500: '#E66235',  // Primary action button (less intense)
          600: '#CC5428',  // Pressed state / dark hover
          700: '#B84D00',  // Link/Info (burnt orange)
        },
        
        // Success/Completion - Rewarding Golden Yellow (softer)
        gold: {
          100: '#F5EDD6',  // Light background / subtle highlight (less bright)
          200: '#F0E0AD',  // Soft highlight
          300: '#E8D384',  // Hover state
          400: '#E5B04D',  // Primary success / completion badge (toned down)
          500: '#D99F26',  // Deeper gold
          600: '#CC8A00',  // Pressed state
        },
        
        // Calm/Secondary Actions - Sandy Gold
        sand: {
          100: '#F2E8D9',  // Light background
          200: '#E6D5BF',  // Subtle elements
          300: '#D9C2A5',  // Hover state
          400: '#D4A574',  // Primary calm action / meeting blocks
          500: '#C18A52',  // Deeper sandy tone
        },
        
        // Borders & Dividers - Soft peachy tones
        border: {
          light: '#FFE0CC',    // Subtle borders
          DEFAULT: '#FFD4B3',  // Standard borders
          strong: '#FFC299',   // Emphasized borders
        },
        
        // Warning States
        warning: {
          light: '#FFF3CD',
          DEFAULT: '#FFE69C',
          strong: '#FFD666',
        },
        
        // Error States (warm, not harsh red)
        error: {
          light: '#FFE5E5',
          DEFAULT: '#FFCCCC',
          strong: '#FF9999',
        },
      },
      
      // Shadow System with Warm Tints (Two-Layer: Light + Dark)
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(255, 107, 53, 0.10), 0 1px 2px rgba(44, 24, 16, 0.06)',
        'warm-md': '0 4px 6px rgba(255, 107, 53, 0.10), 0 2px 4px rgba(44, 24, 16, 0.06)',
        'warm-lg': '0 10px 15px rgba(255, 107, 53, 0.10), 0 4px 6px rgba(44, 24, 16, 0.07)',
        'warm-xl': '0 20px 25px rgba(255, 107, 53, 0.12), 0 8px 10px rgba(44, 24, 16, 0.08)',
        'warm-2xl': '0 25px 50px rgba(255, 107, 53, 0.15), 0 12px 20px rgba(44, 24, 16, 0.10)',
        'warm-inner': 'inset 0 2px 4px rgba(255, 255, 255, 0.4)',
        'glow-amber': '0 0 20px rgba(255, 140, 66, 0.4)',
        'glow-gold': '0 0 20px rgba(255, 184, 77, 0.5)',
        'glow-sunset': '0 0 30px rgba(255, 107, 53, 0.5)',
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
            boxShadow: '0 0 20px rgba(255, 140, 66, 0.4), 0 20px 25px rgba(255, 107, 53, 0.12), 0 8px 10px rgba(44, 24, 16, 0.08)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 184, 77, 0.6), 0 20px 25px rgba(255, 107, 53, 0.15), 0 8px 10px rgba(44, 24, 16, 0.08)',
          },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shine-sweep': {
          '0%': { left: '-100%' },
          '50%, 100%': { left: '100%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(100%)', opacity: '0' },
        },
        'focus-ring-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 140, 66, 0.4)' },
          '100%': { boxShadow: '0 0 0 6px rgba(255, 140, 66, 0)' },
        },
        'icon-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shine': 'shine-sweep 1.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out-right': 'slide-out-right 200ms ease-in',
        'focus-ring-pulse': 'focus-ring-pulse 1.5s infinite',
        'icon-bounce': 'icon-bounce 400ms ease-in-out',
      },
    },
  },
  plugins: [],
};
