# Daybreak Pages Implementation Plan

## Assessment Summary

### Pages Requiring Updates:
1. **Week View** - Complete redesign needed
2. **Flow Page** - Minimal (already uses updated FlowSessionView)  
3. **Capture Page** - Complete redesign needed
4. **Explore Page** - Complete redesign needed
5. **Settings Page** - Complete redesign needed
6. **Onboarding Pages** (9 pages) - All need updates

---

## Design Approach

### Colors to Replace:
- **Old:** `indigo-*`, `blue-*`, `gray-*` dark theme
- **New:** `sunset-*`, `gold-*`, `sand-*`, `bark-*`, `dawn-*`

### Components to Use:
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-success`
- `.card`, `.card-elevated`, `.card-interactive`
- `.input`, `.textarea`, `.select`
- Typography classes: `text-h1`, `text-body`, etc.
- `shadow-warm-sm/md/lg`

### Whimsical Touches to Add:
- Hover lift animations (`hover:-translate-y-0.5`)
- Icon bounce on hover (`animate-icon-bounce`)
- Completion shine effects (`completion-shine`)
- Gradient text for headings (`text-gradient-sunset`)
- Smooth transitions (`transition-all duration-fast`)

---

## Implementation Order

### Phase 1: Main App Pages
1. Week View
2. Capture Page
3. Explore Page
4. Settings Page

### Phase 2: Onboarding Flow
1. Onboarding start page
2. Goals page
3. Ritual page
4. Integrations page
5. Locations page
6. Apps page
7. Boredom page
8. Recovery page
9. Complete page

---

## Key Design Elements

### Navigation Bar Pattern:
```tsx
<nav className="bg-white border-b border-border-light shadow-warm-sm">
  <h1 className="text-2xl font-bold text-gradient-sunset">Daybreak</h1>
  <a className="text-bark-200 hover:text-sunset-500 transition-all duration-fast">
</nav>
```

### Page Background:
```tsx
<div className="min-h-screen bg-dawn-100">
```

### Card Pattern:
```tsx
<div className="card-elevated p-6 hover-lift">
```

### Button Pattern:
```tsx
<button className="btn-primary">
  <Icon className="w-5 h-5" />
  Action Text
</button>
```

### Stats/Metrics Pattern:
```tsx
<div className="grid grid-cols-4 gap-4">
  <div className="card p-4">
    <div className="text-h2 text-gradient-sunset">{value}</div>
    <div className="text-caption text-bark-200">{label}</div>
  </div>
</div>
```

---

## Whimsy Injector Guidelines

### Micro-interactions:
- Icons should bounce on hover
- Cards should lift slightly on hover
- Buttons should have ripple effects
- Success states should use shine animation
- Loading spinners use sunset-500 color

### Delightful Details:
- Empty states with encouraging emoji
- Completion badges with golden glow
- Smooth page transitions
- Gradient backgrounds on special cards
- Warm shadows throughout

### Typography Fun:
- Important headings use gradient text
- Use emoji tastefully in empty states
- Quotes get special golden treatment
- Numbers in stats get gradient colors

---

## Consistency Checklist

For each page ensure:
- [ ] Background is `bg-dawn-100`
- [ ] Navigation uses Daybreak branding
- [ ] All buttons use design system classes
- [ ] All cards use `.card` or `.card-elevated`
- [ ] Typography uses semantic classes
- [ ] Shadows are `shadow-warm-*`
- [ ] Borders are `border-border-*`
- [ ] Loading states use sunset-500
- [ ] Hover states include micro-animations
- [ ] Focus states use sunset-400 rings

---

## Next Steps

Execute implementation in order, updating todos as completed.

