# 🌅 Dark Sunrise Theme Transformation Progress

## ✅ Completed

### 1. Core Setup
- **Tailwind Config** - Updated with Dark Sunrise color palette and glow system
- **globals.css** - Streamlined dark theme component classes
- **Test Page** - Created `/theme-test` for verification

### 2. Showcase Pages
- **onboarding/complete** - Fully transformed with Framer Motion animations ✨

## 🎨 Transformation Pattern

Use this pattern for all remaining pages:

### Import Framer Motion
```tsx
import { motion } from 'framer-motion'
```

### Replace Light Theme Colors

| Old (Light) | New (Dark) | Usage |
|-------------|------------|-------|
| `bg-dawn-100` | `bg-bg-primary` | Page background |
| `bg-dawn-50` | `bg-bg-elevated` | Cards, panels |
| `bg-white` | `bg-bg-surface` | Elevated surfaces |
| `text-bark-500` | `text-text-primary` | Headings |
| `text-bark-400` | `text-text-secondary` | Body text |
| `text-bark-300` | `text-text-tertiary` | Muted text |
| `text-sunset-500` | `text-accent-gold` | Primary accent |
| `text-sunset-600` | `text-accent-orange` | Hover states |
| `text-gold-400` | `text-accent-gold` | Success states |
| `border-sunset-200` | `border-accent-gold/20` | Borders |
| `border-border` | `border-border-default` | Standard borders |
| `shadow-warm-md` | `shadow-glow-medium` | Standard elevation |
| `shadow-warm-lg` | `shadow-glow-strong` | High elevation |

### Animation Patterns

**Page Entry:**
```tsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
```

**Stagger Children:**
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
```

**Button Interactions:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn-primary"
>
```

### Gradient Backgrounds
Replace solid backgrounds with gradient:
```tsx
// Old
className="bg-dawn-100"

// New
className="bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary"
```

### Button Classes
```tsx
// Primary CTA
className="bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-bold px-6 py-3 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all"

// Secondary
className="bg-transparent border-2 border-accent-gold/30 text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10 transition-all"

// Ghost
className="bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all"
```

## 📋 Remaining Pages to Transform

### Onboarding Flow (8 pages)
- [ ] `/onboarding` - Welcome page
- [ ] `/onboarding/goals` - Focus area selection
- [ ] `/onboarding/integrations` - Calendar/email setup
- [ ] `/onboarding/locations` - Geofencing triggers
- [ ] `/onboarding/apps` - App blocking configuration
- [ ] `/onboarding/ritual` - Pre-work ritual builder
- [ ] `/onboarding/boredom` - Break preferences
- [ ] `/onboarding/recovery` - Active recovery planning

### Main App Pages (8 pages)
- [ ] `/today` - Daily dashboard (primary view)
- [ ] `/week` - Week planning calendar
- [ ] `/explore` - Optional features showcase
- [ ] `/settings` - User preferences
- [ ] `/capture` - Quick task capture
- [ ] `/flow` - Active flow session view
- [ ] `/flow/complete` - Post-session feedback
- [ ] `/shutdown` - Evening shutdown ritual

### Auth Pages (3 pages)
- [ ] `/` - Landing page
- [ ] `/login` - Sign in
- [ ] `/signup` - Registration

### Shared Components
- [ ] `BottomNav.tsx` - Navigation bar
- [ ] `QuickCapture.tsx` - Task capture modal
- [ ] `SessionChecklist.tsx` - Pre-session ritual
- [ ] `ConnectAccountPrompt.tsx` - OAuth prompt

## 🚀 Next Steps

1. Run dev server: `npm run dev`
2. Visit `/theme-test` to verify setup
3. Visit `/onboarding/complete` to see showcase example
4. Apply transformation pattern to remaining pages
5. Test each page for visual consistency

## 🎯 Success Criteria

- ✅ All pages use dark theme color palette
- ✅ Glows replace shadows throughout
- ✅ Smooth Framer Motion animations on key interactions
- ✅ Consistent sunrise accent usage
- ✅ Readable text with proper contrast
- ✅ Mobile responsive layouts maintained

## 🔧 Quick Commands

```bash
# Start dev server
npm run dev

# View test page
open http://localhost:3000/theme-test

# View transformed example
open http://localhost:3000/onboarding/complete
```

## 📚 References

- **Design Brief:** `DARK_THEME_UI_TRANSFORMATION_BRIEF.md`
- **Claude Instructions:** `claude.md`
- **Implementation Doc:** `flowstate-dark-sunrise-implementation.md`
