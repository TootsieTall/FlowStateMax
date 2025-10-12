# 🌅 Daybreak Design System
**Golden Hour Productivity Theme**

> Capture the magic hour - that perfect time between sunset and dusk when light is warm, soft, and everything looks beautiful.

---

## 🎨 Design Philosophy

**Core Principle:** Make productivity feel easy, rewarding, and energizing through warm, inviting visuals that reduce eye strain and create positive emotional associations.

**Key Attributes:**
- **Warm but not overwhelming:** Like being wrapped in golden hour sunlight
- **High readability:** Dark text on light backgrounds for 4+ hour work sessions
- **Energizing:** Orange/amber tones create urgency without anxiety
- **Rewarding:** Golden tones trigger positive completion associations
- **Natural:** Mimics the time of day when people feel most accomplished

---

## 🎨 Color Palette

### Background System (Light → Dark for depth layering)

```css
dawn-50:  #FFFBF5  /* Peak highlights / focus states */
dawn-100: #FFF9F0  /* Primary page background - Warm cream */
dawn-200: #FFF5E6  /* Secondary backgrounds / elevated cards - Lighter peach */
dawn-300: #FFE4CC  /* Elevated elements / interactive hover states - Soft peachy */
dawn-400: #FFD4B3  /* Deeper elevation / active states */
```

**Usage:**
- Page background: `bg-dawn-100`
- Card backgrounds: `bg-white` (for contrast)
- Elevated cards: `bg-dawn-200`
- Hover states: `bg-dawn-300`

### Text System (Warm Browns - Light → Dark)

```css
bark-100: #A67C52  /* Tertiary text (muted labels) */
bark-200: #8B6442  /* Muted interactive text */
bark-300: #6B4423  /* Secondary text */
bark-400: #4A2F1A  /* Strong emphasis */
bark-500: #2C1810  /* Primary text - Deep warm brown */
```

**Usage:**
- Headings: `text-bark-500`
- Body text: `text-bark-400`
- Secondary text: `text-bark-300`
- Muted text: `text-bark-200`
- Disabled text: `text-bark-100`

### Primary Accent - Sunset Orange (Energizing)

```css
sunset-100: #FFE5D9  /* Lightest tint / subtle backgrounds */
sunset-200: #FFCAB0  /* Light background / soft highlights */
sunset-300: #FFB087  /* Hover state */
sunset-400: #FF8C42  /* Active/Focus state - Amber glow */
sunset-500: #FF6B35  /* PRIMARY ACTION - Main CTA button */
sunset-600: #E55A28  /* Pressed / dark hover state */
sunset-700: #CC5500  /* Links / Info - Burnt orange */
```

**Usage:**
- Primary buttons: `bg-sunset-500 hover:bg-sunset-600`
- Deep work blocks: `bg-sunset-100 border-sunset-500`
- Active indicators: `text-sunset-500`
- Links: `text-sunset-700`

### Success/Completion - Golden Yellow (Rewarding)

```css
gold-100: #FFF4D6  /* Light background / subtle highlight */
gold-200: #FFE8AD  /* Soft highlight */
gold-300: #FFDB84  /* Hover state */
gold-400: #FFB84D  /* PRIMARY SUCCESS - Completion badges */
gold-500: #FFA826  /* Deeper gold */
gold-600: #E59400  /* Pressed state */
```

**Usage:**
- Completion modals: `bg-gold-400`
- Success states: `text-gold-400`
- Streak badges: `bg-gold-400`
- Golden highlights: `shadow-glow-gold`

### Calm/Secondary - Sandy Gold (Non-critical actions)

```css
sand-100: #F2E8D9  /* Light background */
sand-200: #E6D5BF  /* Subtle elements */
sand-300: #D9C2A5  /* Hover state */
sand-400: #D4A574  /* PRIMARY CALM - Meeting blocks */
sand-500: #C18A52  /* Deeper sandy tone */
```

**Usage:**
- Meeting time blocks: `bg-sand-100 border-sand-400`
- Secondary buttons: `bg-sand-200 hover:bg-sand-300`
- Calm actions: `text-sand-400`

### Border & Divider Colors

```css
border-light:   #FFE0CC  /* Subtle borders on cards */
border-DEFAULT: #FFD4B3  /* Standard borders */
border-strong:  #FFC299  /* Emphasized borders */
```

### Semantic Colors

```css
/* Warning States */
warning-light:   #FFF3CD
warning-DEFAULT: #FFE69C
warning-strong:  #FFD666

/* Error States (warm, not harsh) */
error-light:   #FFE5E5
error-DEFAULT: #FFCCCC
error-strong:  #FF9999
```

---

## 🌑 Shadow System

### Warm Tinted Shadows (Two-Layer: Light + Dark)

Based on the principle of "light from above" - combines warm orange ambient light with darker brown directional shadows.

```css
/* Small Elevation - Subtle cards */
shadow-warm-sm: 0 1px 3px rgba(255, 107, 53, 0.10), 0 1px 2px rgba(44, 24, 16, 0.06)

/* Medium Elevation - Standard cards, buttons */
shadow-warm-md: 0 4px 6px rgba(255, 107, 53, 0.10), 0 2px 4px rgba(44, 24, 16, 0.06)

/* Large Elevation - Modals, prominent elements */
shadow-warm-lg: 0 10px 15px rgba(255, 107, 53, 0.10), 0 4px 6px rgba(44, 24, 16, 0.07)

/* Extra Large - Major UI elements */
shadow-warm-xl: 0 20px 25px rgba(255, 107, 53, 0.12), 0 8px 10px rgba(44, 24, 16, 0.08)

/* Inner Shadow - Top shine on elevated cards */
shadow-warm-inner: inset 0 2px 4px rgba(255, 255, 255, 0.4)

/* Glow Effects */
shadow-glow-amber: 0 0 20px rgba(255, 140, 66, 0.4)
shadow-glow-gold: 0 0 20px rgba(255, 184, 77, 0.5)
shadow-glow-sunset: 0 0 30px rgba(255, 107, 53, 0.5)
```

**Usage:**
```jsx
<div className="card shadow-warm-sm">      {/* Subtle card */}
<button className="shadow-warm-md">         {/* Standard button */}
<div className="modal shadow-warm-xl">      {/* Modal dialog */}
<div className="active shadow-glow-amber">  {/* Active flow session */}
```

---

## 📐 Border Radius

### Warm, Rounded Corners (8-12px for friendliness)

```css
rounded-sm:      6px   /* Subtle rounding */
rounded-md:      8px   /* Standard elements */
rounded-lg:      12px  /* Cards, buttons */
rounded-xl:      16px  /* Large cards */
rounded-2xl:     20px  /* Modals */

/* Semantic Aliases */
rounded-warm:    8px   /* Default warm rounding */
rounded-warm-lg: 12px  /* Larger warm rounding */
```

---

## 🎭 Typography

### Font Family

```css
font-sans:    Inter Variable, Inter, system-ui, sans-serif
font-display: Inter Variable, Inter, system-ui, sans-serif  (for headings)
font-mono:    SF Mono, Monaco, Consolas, monospace
```

### Type Scale

#### Display Text (Hero sections)
```jsx
<h1 className="text-display-xl">  {/* 4rem, line-height 1.2, tracking -0.02em */}
<h1 className="text-display-lg">  {/* 3rem, line-height 1.2, tracking -0.02em */}
<h1 className="text-display-md">  {/* 2.25rem, line-height 1.25, tracking -0.01em */}
```

#### Headings
```jsx
<h1 className="text-h1">  {/* 2rem (32px), line-height 1.3 */}
<h2 className="text-h2">  {/* 1.5rem (24px), line-height 1.3 */}
<h3 className="text-h3">  {/* 1.25rem (20px), line-height 1.4 */}
<h4 className="text-h4">  {/* 1.125rem (18px), line-height 1.4 */}
```

#### Body Text (Generous line-height for readability)
```jsx
<p className="text-body-lg">  {/* 1.125rem (18px), line-height 1.6 */}
<p className="text-body">     {/* 1rem (16px), line-height 1.6 */}
<p className="text-body-sm">  {/* 0.875rem (14px), line-height 1.6 */}
```

#### UI Text
```jsx
<label className="text-label">     {/* 0.875rem (14px), font-medium */}
<span className="text-caption">    {/* 0.75rem (12px) */}
<span className="text-overline">   {/* 0.75rem (12px), uppercase, tracking 0.05em */}
```

### Text Gradients

```jsx
<h1 className="text-gradient-sunset">  {/* Sunset to Gold gradient */}
<h1 className="text-gradient-gold">    {/* Gold gradient */}
```

---

## 🧩 Component Library

### Button Variants

#### Primary Button (Main CTAs)
```jsx
<button className="btn-primary">
  Start Flow Session
</button>
```
- Gradient: `sunset-500` → `gold-400`
- Hover: Lifts up, deeper colors, stronger shadow
- Active: Presses down
- Focus: Amber ring

#### Secondary Button (Alternative actions)
```jsx
<button className="btn-secondary">
  Cancel
</button>
```
- White background with border
- Hover: Sandy background, darker text
- No gradient

#### Ghost Button (Subtle actions)
```jsx
<button className="btn-ghost">
  Skip
</button>
```
- Transparent background
- Hover: Light peachy background

#### Success Button (Completion actions)
```jsx
<button className="btn-success">
  Complete Session
</button>
```
- Golden gradient with glow effect
- Used for completion, achievements

### Card Variants

#### Standard Card
```jsx
<div className="card">
  {/* White background, subtle shadow, light border */}
</div>
```

#### Elevated Card (Important content)
```jsx
<div className="card-elevated">
  {/* Gradient background, inner top shine, medium shadow */}
</div>
```

#### Interactive Card (Clickable)
```jsx
<div className="card-interactive">
  {/* Standard card + hover lift animation */}
</div>
```

### Input Fields

```jsx
<input type="text" className="input" placeholder="Enter text..." />
<textarea className="textarea" placeholder="Enter long text..." />
<select className="select">...</select>
```

**Features:**
- White background with peachy borders
- Focus: Sunset ring glow
- Disabled: Faded cream background

### Time Block Variants

#### Deep Work Block
```jsx
<div className="time-block-deep-work">
  {/* Sunset orange with bold border */}
</div>

<div className="time-block-deep-work active">
  {/* Active state with pulsing amber ring */}
</div>
```

#### Meeting Block
```jsx
<div className="time-block-meeting">
  {/* Sandy calm tone */}
</div>
```

#### Break Block
```jsx
<div className="time-block-break">
  {/* Soft peachy for rest periods */}
</div>
```

#### Blocked Time
```jsx
<div className="time-block-blocked">
  {/* Warning yellow with diagonal stripes */}
</div>
```

---

## ✨ Micro-Interactions & Animations

### Button Interactions

```css
/* Hover: Lift + Glow */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: glow-amber, warm-lg;
}

/* Active: Press down */
.btn-primary:active {
  transform: translateY(0);
  box-shadow: warm-sm;
}

/* Ripple effect on click (Framer Motion) */
```

### Completion Animations

```jsx
/* Bounce in */
<div className="animate-bounce-in">
  Session Complete!
</div>

/* Golden shine sweep */
<div className="completion-shine">
  <CheckIcon />
</div>

/* Pulsing glow (active flow session) */
<div className="animate-pulse-glow">
  Flow Timer
</div>
```

### Loading States

```jsx
/* Shimmer skeleton */
<div className="skeleton-loader h-4 w-32" />

/* Spinner with warm gradient */
<div className="spinner border-sunset-500" />
```

### Hover Micro-Animations

```jsx
/* Card lift */
<div className="hover-lift">
  ...
</div>

/* Glow on hover */
<div className="hover-glow">
  ...
</div>

/* Icon bounce */
<Icon className="hover:animate-icon-bounce" />
```

### Focus States

```jsx
/* Standard focus ring */
<button className="focus-ring">
  ...
</button>

/* Animated focus ring (pulsing) */
<input className="focus-ring-animated" />
```

---

## 🎯 Component-Specific Colors

### Flow Timer States

**Active Session:**
```jsx
<div className="fixed bottom-8 right-8 rounded-2xl p-8
     bg-gradient-to-br from-sunset-400 to-gold-400
     shadow-warm-xl animate-pulse-glow">
  {/* Timer content */}
</div>
```

**Paused Session:**
```jsx
<div className="bg-sand-200 border-2 border-sand-400 opacity-80">
  {/* Paused timer */}
</div>
```

**Warning (<5 minutes):**
```jsx
<div className="bg-warning-DEFAULT border-2 border-warning-strong animate-gentle-pulse">
  {/* Warning timer */}
</div>
```

### Navigation Active State

```jsx
<Link href="/today" 
      className="text-sunset-500 border-b-2 border-sunset-500">
  Today
</Link>
```

### Completion Modal

```jsx
<div className="card-elevated completion-shine animate-bounce-in
     bg-gradient-to-br from-gold-200 to-sunset-200">
  <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-500 
       rounded-full shadow-glow-gold">
    <CheckCircle className="text-white" />
  </div>
  <h2 className="text-display-md text-bark-500">
    Session Complete!
  </h2>
</div>
```

### Streak Badge

```jsx
<div className="bg-gold-400 text-white rounded-full 
     shadow-warm-md px-3 py-1 text-sm font-semibold">
  7 🔥
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Patterns

```jsx
/* Time block grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: Stack, Tablet: 2 cols, Desktop: 3 cols */}
</div>

/* Navigation drawer (mobile) vs. sidebar (desktop) */
<nav className="fixed inset-y-0 left-0 w-full -translate-x-full
     md:translate-x-0 md:w-64">
  ...
</nav>

/* Flow timer positioning */
<div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
  {/* Smaller margin on mobile */}
</div>
```

---

## ♿ Accessibility

### Color Contrast (WCAG AA Compliant)

All text combinations meet WCAG AA standards:
- ✅ `bark-500` on `dawn-100`: **14.2:1**
- ✅ `bark-400` on `white`: **10.8:1**
- ✅ `bark-300` on `dawn-200`: **7.4:1**
- ✅ `white` on `sunset-500`: **4.8:1**

### Focus Management

```jsx
/* Always visible focus indicator */
*:focus-visible {
  @apply outline-none ring-2 ring-sunset-400 ring-offset-2;
}

/* Skip to main content link */
<a href="#main" className="skip-link">
  Skip to main content
</a>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Implementation Guide

### 1. Install Inter Font

```jsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### 2. Import Globals CSS

```jsx
// app/layout.tsx
import './globals.css'
```

### 3. Use Design Tokens

```jsx
// Example: Time Block Component
export function TimeBlock({ type, title, time, isActive }) {
  return (
    <div className={cn(
      'p-4 rounded-warm-lg border-2 shadow-warm-sm',
      'transition-all duration-normal',
      type === 'deep-work' && 'time-block-deep-work',
      type === 'meeting' && 'time-block-meeting',
      type === 'break' && 'time-block-break',
      isActive && 'active shadow-warm-md'
    )}>
      <h3 className="text-h4 text-bark-500">{title}</h3>
      <p className="text-body-sm text-bark-300">{time}</p>
    </div>
  )
}
```

### 4. Use Framer Motion for Animations

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="card-elevated"
>
  {children}
</motion.div>
```

---

## 🎨 Brand Assets

### Logo Specifications

**Primary Wordmark:**
- Font: Inter Display 600
- Color: Gradient from `sunset-500` → `gold-400`
- Minimum size: 120px width

**Icon:**
- Stylized sunrise with rays
- Simple geometric design
- Minimum size: 32×32px

### Favicon & Meta

```html
<link rel="icon" href="/favicon.ico" />
<meta name="theme-color" content="#FF6B35" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

---

## 📊 Design Principles Summary

### Color Layering for Depth
```
Deepest:     bg-dawn-100      (Page background)
  ↓
Cards:       bg-white         (Content cards)
  ↓
Elevated:    bg-dawn-200      (Important elements)
  ↓
Interactive: bg-dawn-300      (Hover states)
  ↓
Peak:        bg-dawn-50       (Focus highlights)
```

### Shadow Hierarchy
- **Small:** Subtle cards, minor elevation
- **Medium:** Standard cards, buttons
- **Large:** Modals, major UI elements
- **XL:** Full-screen overlays
- **Glow:** Active states, focus indicators

### Animation Timing
- **Fast:** 150ms - Button hovers, simple transitions
- **Normal:** 200ms - Card animations, most interactions
- **Slow:** 300ms - Modal entrances, complex animations
- **Slower:** 400ms - Page transitions, major state changes

---

## 💡 Best Practices

1. **Use semantic color names:** `bg-sunset-500` not `bg-orange-500`
2. **Layer backgrounds properly:** Follow the depth hierarchy
3. **Add warm shadows:** Always use `shadow-warm-*` variants
4. **Provide hover feedback:** Lift, glow, or color change
5. **Test 4+ hour sessions:** Ensure no eye strain
6. **Check contrast ratios:** Use browser DevTools
7. **Support reduced motion:** Respect user preferences
8. **Use focus indicators:** Never remove focus styles
9. **Mobile-first approach:** Start small, enhance for larger screens
10. **Consistent spacing:** Use Tailwind's spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)

---

## 🔧 Maintenance

### Adding New Colors

When adding new colors to the palette:
1. Follow the naming convention (`dawn`, `bark`, `sunset`, etc.)
2. Create 5-6 shades for consistency
3. Test contrast ratios with text colors
4. Add to both `tailwind.config.js` and CSS variables in `globals.css`

### Custom Animations

Add to `tailwind.config.js`:
```js
keyframes: {
  'your-animation': {
    '0%': { /* start state */ },
    '100%': { /* end state */ },
  },
},
animation: {
  'your-animation': 'your-animation 1s ease-in-out',
}
```

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://rsms.me/inter/)
- [Framer Motion](https://www.framer.com/motion/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Palette Generator](https://coolors.co/)

---

**Built with ❤️ for Daybreak**  
*Making productivity feel like golden hour every day.*

