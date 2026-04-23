# Visual Reference - Hatha Yoga Page Enhancements

## 🎨 Design System Overview

### Color Palette
```
Primary Saffron:     #F15505  (var(--clr-saffron))
Parchment:           #fdf6e8  (var(--clr-parchment))
Mahogany:            #3d1d00  (var(--clr-mahogany))
Brown:               #7a5c2e  (var(--clr-brown))
Brown Light:         #b8956a  (var(--clr-brown-lt))
Ink:                 #2e1a06  (var(--clr-ink))
Rust:                #f15505  (var(--clr-rust))
```

### Typography
```
Display Font:        Cinzel (serif)
Body Font:           Cormorant Garamond (serif)
Script Font:         Dancing Script (cursive)
Fell Font:           IM Fell English (serif)
```

---

## 📐 Component Specifications

### Benefits Card
```
┌─────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ ← Top border (3px, gradient)
│                                 │
│  01                             │ ← Number (1.8rem, saffron)
│  Benefit Text Description       │ ← Text (0.9-1rem)
│                                 │
└─────────────────────────────────┘
  ↑                               ↑
  └─ Border (1.5px, saffron)      └─ Rounded corners (8px)

Padding:     1.2rem 1.4rem
Background:  Gradient (white to cream)
Hover:       Lift up 4px, shadow increases
Animation:   0.3s ease
```

### Curriculum Card
```
┌─────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ ← Top border (4px, animates)
│                                 │
│  01                             │ ← Number (2.2rem, saffron)
│  Curriculum Item Text           │ ← Text (0.95-1.05rem)
│  Description                    │
│                                 │
│                    ╱╱╱╱╱╱╱╱╱╱╱ │ ← Corner accent (radial gradient)
└─────────────────────────────────┘
  ↑                               ↑
  └─ Border (2px, saffron)        └─ Rounded corners (10px)

Padding:     1.6rem 1.8rem
Background:  Gradient (white to cream)
Hover:       Lift up 6px, top border scales in, shadow increases
Animation:   0.35s cubic-bezier(0.34, 1.56, 0.64, 1)
Grid:        auto-fit, minmax(280px, 1fr)
```

### Ashram Image Frame
```
┌─────────────────────────────────┐
│ ┌───────────────────────────────┤ ← Outer border (3px)
│ │                               │
│ │                               │
│ │      Image Content            │ ← Inner border (2px)
│ │      (4:5 aspect ratio)       │
│ │                               │
│ │                               │
│ └───────────────────────────────┤
└─────────────────────────────────┘

Outer Border:  3px solid (saffron, 0.3 opacity)
Inner Border:  2px solid (saffron, 0.3 opacity)
Radius:        12px outer, 16px inner
Shadow:        0 20px 60px rgba(92, 45, 0, 0.2)
Hover:         Image zooms 1.04x, filter transitions
Animation:     0.6s ease
```

---

## 🎯 Hover Effects

### Benefits Card Hover
```
BEFORE:
┌─────────────────────────────────┐
│                                 │
│  01                             │
│  Benefit Text                   │
│                                 │
└─────────────────────────────────┘

AFTER (on hover):
    ┌─────────────────────────────────┐
    │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ ← Top border fades in
    │                                 │
    │  01                             │
    │  Benefit Text                   │
    │                                 │
    └─────────────────────────────────┘
    ↑ Card lifts up 4px
    ↑ Shadow increases
    ↑ Background brightens
```

### Curriculum Card Hover
```
BEFORE:
┌─────────────────────────────────┐
│                                 │
│  01                             │
│  Curriculum Item                │
│                                 │
│                    ╱╱╱╱╱╱╱╱╱╱╱ │
└─────────────────────────────────┘

AFTER (on hover):
    ┌─────────────────────────────────┐
    │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ ← Top border scales in
    │                                 │
    │  01                             │
    │  Curriculum Item                │
    │                                 │
    │                    ╱╱╱╱╱╱╱╱╱╱╱ │ ← Corner glows
    └─────────────────────────────────┘
    ↑ Card lifts up 6px
    ↑ Shadow increases
    ↑ Background brightens
```

### Ashram Image Hover
```
BEFORE:
┌─────────────────────────────────┐
│                                 │
│      Image (sepia filter)       │
│      saturate: 0.85             │
│      sepia: 0.12                │
│                                 │
└─────────────────────────────────┘

AFTER (on hover):
┌─────────────────────────────────┐
│                                 │
│      Image (zoomed 1.04x)       │
│      saturate: 1.0              │
│      sepia: 0                   │
│      (color restored)           │
│                                 │
└─────────────────────────────────┘
```

---

## 📱 Responsive Grid Layouts

### Benefits Section

#### 1920px (Ultra-wide)
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Benefit 01       │  │ Benefit 02       │             │
│  └──────────────────┘  └──────────────────┘             │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Benefit 03       │  │ Benefit 04       │             │
│  └──────────────────┘  └──────────────────┘             │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Benefit 05       │  │ Benefit 06       │             │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
Grid: 2 columns | Gap: 1.8rem | Card Padding: 1.6rem
```

#### 768px (Tablet)
```
┌──────────────────────────────────┐
│  ┌──────────────────────────────┐ │
│  │ 01  Benefit Text             │ │
│  │     Description              │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ 02  Benefit Text             │ │
│  │     Description              │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ 03  Benefit Text             │ │
│  │     Description              │ │
│  └──────────────────────────────┘ │
└──────────────────────────────────┘
Grid: 1 column | Gap: 0.9rem | Card Padding: 1.1rem
```

#### 360px (Mobile)
```
┌──────────────────┐
│  ┌──────────────┐ │
│  │ 01 Benefit   │ │
│  │    Text      │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │ 02 Benefit   │ │
│  │    Text      │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │ 03 Benefit   │ │
│  │    Text      │ │
│  └──────────────┘ │
└──────────────────┘
Grid: 1 column | Gap: 0.5rem | Card Padding: 0.75rem
```

### Curriculum Section

#### 1920px (Ultra-wide)
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 01   │  │ 02   │  │ 03   │  │ 04   │                │
│  │ Item │  │ Item │  │ Item │  │ Item │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 05   │  │ 06   │  │ 07   │  │ 08   │                │
│  │ Item │  │ Item │  │ Item │  │ Item │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
└─────────────────────────────────────────────────────────┘
Grid: 4 columns | Gap: 1.8rem | Card Padding: 1.8rem
```

#### 1024px (Tablet)
```
┌──────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐     │
│  │ 01  Item     │  │ 02  Item     │     │
│  │     Text     │  │     Text     │     │
│  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ 03  Item     │  │ 04  Item     │     │
│  │     Text     │  │     Text     │     │
│  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────┘
Grid: 2 columns | Gap: 1.2rem | Card Padding: 1.4rem
```

#### 540px (Mobile)
```
┌──────────────────────────┐
│  ┌────────────────────┐  │
│  │ 01  Item Text      │  │
│  │     Description    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 02  Item Text      │  │
│  │     Description    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 03  Item Text      │  │
│  │     Description    │  │
│  └────────────────────┘  │
└──────────────────────────┘
Grid: 1 column | Gap: 0.7rem | Card Padding: 1rem
```

---

## 🎬 Animation Timings

### Benefits Card
```
Timeline (0.3s):
0ms    ├─ Start
       │
100ms  ├─ Top border opacity: 0 → 1
       │
150ms  ├─ Card transform: translateY(0) → translateY(-4px)
       │
300ms  └─ End (all properties settled)

Easing: ease (default)
```

### Curriculum Card
```
Timeline (0.35s):
0ms    ├─ Start
       │
100ms  ├─ Top border scaleX: 0 → 1
       │
175ms  ├─ Card transform: translateY(0) → translateY(-6px)
       │
350ms  └─ End (all properties settled)

Easing: cubic-bezier(0.34, 1.56, 0.64, 1) [bounce effect]
```

### Ashram Image
```
Timeline (0.6s):
0ms    ├─ Start
       │
300ms  ├─ Image scale: 1 → 1.04
       │
300ms  ├─ Filter saturate: 0.85 → 1
       │
300ms  ├─ Filter sepia: 0.12 → 0
       │
600ms  └─ End (all properties settled)

Easing: ease
```

---

## 📊 Spacing System

### Padding Scale
```
Ultra-compact:  0.75rem  (360px)
Compact:        0.9rem   (420px)
Small:          1rem     (540px)
Medium:         1.2rem   (768px)
Large:          1.4rem   (1024px)
Extra-large:    1.6rem   (1200px)
Ultra-large:    1.8rem   (1920px)
```

### Gap Scale
```
Ultra-compact:  0.5rem   (360px)
Compact:        0.6rem   (420px)
Small:          0.7rem   (540px)
Medium:         0.9rem   (768px)
Large:          1.2rem   (1024px)
Extra-large:    1.5rem   (1200px)
Ultra-large:    1.8rem   (1920px)
```

---

## 🎨 Gradient Definitions

### Card Background
```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.85) 0%,
  rgba(255, 248, 240, 0.7) 100%
);
```

### Top Border
```css
background: linear-gradient(
  90deg,
  var(--clr-saffron),
  transparent
);
```

### Corner Accent
```css
background: radial-gradient(
  circle at 100% 0%,
  rgba(241, 85, 5, 0.08) 0%,
  transparent 70%
);
```

### Section Background
```css
background: linear-gradient(
  160deg,
  #fffbf4 0%,
  #fffcf5 100%
);
```

---

## 🔍 Font Size Scaling

### Using clamp()
```css
/* Scales from 0.9rem at 360px to 1rem at 1920px */
font-size: clamp(0.9rem, 1.4vw, 1rem);

/* Scales from 0.95rem at 360px to 1.05rem at 1920px */
font-size: clamp(0.95rem, 1.5vw, 1.05rem);

/* Scales from 1.4rem at 360px to 2.4rem at 1920px */
font-size: clamp(1.4rem, 3.5vw, 2.4rem);
```

### Fixed Sizes with Media Queries
```css
/* Desktop */
font-size: 1.8rem;

/* Tablet */
@media (max-width: 768px) {
  font-size: 1.4rem;
}

/* Mobile */
@media (max-width: 540px) {
  font-size: 1.2rem;
}
```

---

## 🎯 Shadow Effects

### Card Shadow
```css
box-shadow: 0 8px 24px rgba(224, 123, 0, 0.12);
```

### Hover Shadow
```css
box-shadow: 0 12px 36px rgba(224, 123, 0, 0.15);
```

### Image Shadow
```css
box-shadow: 0 20px 60px rgba(92, 45, 0, 0.2);
```

---

## 📐 Border Radius

### Cards
```css
border-radius: 8px;   /* Benefits cards */
border-radius: 10px;  /* Curriculum cards */
border-radius: 12px;  /* Ashram image */
```

### Corner Accents
```css
border-radius: 0 0 0 60px;  /* Bottom-left rounded */
border-radius: 50%;         /* Circular gradients */
```

---

## ✨ Filter Effects

### Ashram Image
```css
/* Default state */
filter: saturate(0.85) sepia(0.12);

/* Hover state */
filter: saturate(1) sepia(0);
```

### Transition
```css
transition: transform 0.6s ease, filter 0.6s ease;
```

---

## 🎪 Complete Component Example

### Benefits Card HTML
```html
<li class="benefitItem">
  <span class="benefitNum">01</span>
  <span>Benefit text description goes here</span>
</li>
```

### Benefits Card CSS
```css
.benefitItem {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.2rem 1.4rem;
  border: 1.5px solid rgba(224, 123, 0, 0.2);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 248, 240, 0.6) 100%);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.benefitItem::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--clr-saffron), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefitItem:hover {
  border-color: var(--clr-saffron);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 230, 0.9) 100%);
  box-shadow: 0 8px 24px rgba(224, 123, 0, 0.12);
  transform: translateY(-4px);
}

.benefitItem:hover::before {
  opacity: 1;
}

.benefitNum {
  font-family: var(--ff-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--clr-saffron);
  line-height: 1;
  letter-spacing: 0.05em;
}
```

---

## 🎉 Summary

This visual reference provides:
- ✅ Component specifications
- ✅ Hover effect diagrams
- ✅ Responsive grid layouts
- ✅ Animation timings
- ✅ Spacing system
- ✅ Color definitions
- ✅ Font scaling
- ✅ Shadow effects
- ✅ Complete examples

Use this as a reference when customizing or extending the design! 🎨
