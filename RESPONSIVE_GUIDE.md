# Responsive Design Guide - Hatha Yoga Page

## 📱 Breakpoint Strategy

The page uses a **mobile-first approach** with comprehensive breakpoints from **360px to 1920px**.

---

## 🎯 Benefits Section - Responsive Behavior

### 1920px+ (Ultra-wide Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  BENEFITS                                               │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Benefit 01       │  │ Benefit 02       │             │
│  │ Large card       │  │ Large card       │             │
│  └──────────────────┘  └──────────────────┘             │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Benefit 03       │  │ Benefit 04       │             │
│  │ Large card       │  │ Large card       │             │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```
- **Grid:** 2 columns
- **Card Size:** Large (1.6rem padding)
- **Gap:** 1.8rem
- **Font:** 1rem

### 1024px (Tablet Landscape)
```
┌──────────────────────────────────────────┐
│  BENEFITS                                │
├──────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────┐  │
│  │ Benefit 01       │  │ Benefit 02   │  │
│  │ Medium card      │  │ Medium card  │  │
│  └──────────────────┘  └──────────────┘  │
│  ┌──────────────────┐  ┌──────────────┐  │
│  │ Benefit 03       │  │ Benefit 04   │  │
│  │ Medium card      │  │ Medium card  │  │
│  └──────────────────┘  └──────────────┘  │
└──────────────────────────────────────────┘
```
- **Grid:** 2 columns
- **Card Size:** Medium (1.2rem padding)
- **Gap:** 1rem
- **Font:** 0.95rem

### 768px (Tablet Portrait)
```
┌──────────────────────────────────────┐
│  BENEFITS                            │
├──────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │ 01  Benefit Text                 │ │
│  │     Horizontal layout            │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ 02  Benefit Text                 │ │
│  │     Horizontal layout            │ │
│  └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```
- **Grid:** 1 column
- **Layout:** Horizontal (number + text)
- **Card Size:** Full width
- **Gap:** 0.9rem
- **Font:** 0.9rem

### 540px (Mobile)
```
┌──────────────────────────┐
│  BENEFITS                │
├──────────────────────────┤
│  ┌────────────────────┐  │
│  │ 01  Benefit Text   │  │
│  │     Compact        │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 02  Benefit Text   │  │
│  │     Compact        │  │
│  └────────────────────┘  │
└──────────────────────────┘
```
- **Grid:** 1 column
- **Card Size:** Compact (0.85rem padding)
- **Gap:** 0.7rem
- **Font:** 0.85rem

### 360px (Extra Small Mobile)
```
┌──────────────────┐
│  BENEFITS        │
├──────────────────┤
│  ┌──────────────┐ │
│  │ 01 Benefit   │ │
│  │    Text      │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │ 02 Benefit   │ │
│  │    Text      │ │
│  └──────────────┘ │
└──────────────────┘
```
- **Grid:** 1 column
- **Card Size:** Ultra-compact (0.75rem padding)
- **Gap:** 0.5rem
- **Font:** 0.8rem

---

## 📚 Curriculum (Syllabus) Section - Responsive Behavior

### 1920px+ (Ultra-wide Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  CURRICULUM                                             │
├─────────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 01   │  │ 02   │  │ 03   │  │ 04   │                │
│  │ Item │  │ Item │  │ Item │  │ Item │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 05   │  │ 06   │  │ 07   │  │ 08   │                │
│  │ Item │  │ Item │  │ Item │  │ Item │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
└─────────────────────────────────────────────────────────┘
```
- **Grid:** 4 columns (auto-fit)
- **Min Width:** 280px per card
- **Gap:** 1.8rem
- **Number Size:** 2.2rem

### 1200px (Large Tablet)
```
┌──────────────────────────────────────────┐
│  CURRICULUM                              │
├──────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐     │
│  │ 01  Item     │  │ 02  Item     │     │
│  │     Text     │  │     Text     │     │
│  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ 03  Item     │  │ 04  Item     │     │
│  │     Text     │  │     Text     │     │
│  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────┘
```
- **Grid:** 2 columns
- **Gap:** 1.2rem
- **Number Size:** 1.8rem

### 768px (Tablet)
```
┌──────────────────────────────────────┐
│  CURRICULUM                          │
├──────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │ 01  Item Text                    │ │
│  │     Description                  │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ 02  Item Text                    │ │
│  │     Description                  │ │
│  └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```
- **Grid:** 1 column
- **Gap:** 0.9rem
- **Number Size:** 1.4rem

### 540px (Mobile)
```
┌──────────────────────────┐
│  CURRICULUM              │
├──────────────────────────┤
│  ┌────────────────────┐  │
│  │ 01  Item Text      │  │
│  │     Description    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 02  Item Text      │  │
│  │     Description    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```
- **Grid:** 1 column
- **Gap:** 0.7rem
- **Number Size:** 1.2rem
- **Font:** 0.85rem

### 360px (Extra Small Mobile)
```
┌──────────────────┐
│  CURRICULUM      │
├──────────────────┤
│  ┌──────────────┐ │
│  │ 01 Item Text │ │
│  │    Desc      │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │ 02 Item Text │ │
│  │    Desc      │ │
│  └──────────────┘ │
└──────────────────┘
```
- **Grid:** 1 column
- **Gap:** 0.5rem
- **Number Size:** 1rem
- **Font:** 0.8rem

---

## 🏛️ Ashram Section - Responsive Behavior

### 1920px+ (Ultra-wide Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  ASHRAM                                                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ Text Content         │  │                      │    │
│  │ - Paragraph 1        │  │   Large Image        │    │
│  │ - Paragraph 2        │  │   (4:5 aspect)       │    │
│  │ - Paragraph 3        │  │                      │    │
│  └──────────────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```
- **Grid:** 2 columns
- **Gap:** 6rem
- **Image Aspect:** 4:5
- **Text Width:** 50%

### 1024px (Tablet Landscape)
```
┌──────────────────────────────────────────┐
│  ASHRAM                                  │
├──────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐ │
│  │ Text Content                         │ │
│  │ - Paragraph 1                        │ │
│  │ - Paragraph 2                        │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │   Image (3:4 aspect)                 │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```
- **Grid:** 1 column (stacked)
- **Gap:** 2rem
- **Image Aspect:** 3:4
- **Full Width:** 100%

### 768px (Tablet)
```
┌──────────────────────────────────┐
│  ASHRAM                          │
├──────────────────────────────────┤
│  ┌──────────────────────────────┐ │
│  │ Text Content                 │ │
│  │ - Paragraph 1                │ │
│  │ - Paragraph 2                │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  │   Image                      │ │
│  │                              │ │
│  └──────────────────────────────┘ │
└──────────────────────────────────┘
```
- **Grid:** 1 column
- **Gap:** 1.5rem
- **Image Aspect:** 3:4
- **Padding:** Reduced

### 540px (Mobile)
```
┌──────────────────────────┐
│  ASHRAM                  │
├──────────────────────────┤
│  ┌────────────────────┐  │
│  │ Text Content       │  │
│  │ - Paragraph 1      │  │
│  │ - Paragraph 2      │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   Image            │  │
│  │                    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```
- **Grid:** 1 column
- **Gap:** 1rem
- **Image Aspect:** 3:4
- **Compact Padding:** 0.9rem

### 360px (Extra Small Mobile)
```
┌──────────────────┐
│  ASHRAM          │
├──────────────────┤
│  ┌──────────────┐ │
│  │ Text Content │ │
│  │ - Para 1     │ │
│  │ - Para 2     │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │              │ │
│  │   Image      │ │
│  │              │ │
│  └──────────────┘ │
└──────────────────┘
```
- **Grid:** 1 column
- **Gap:** 0.8rem
- **Image Aspect:** 3:4
- **Ultra-compact:** 0.7rem padding

---

## 🎨 Hover Effects

### Benefits Cards
```
Before Hover:
┌──────────────────┐
│ 01               │
│ Benefit Text     │
└──────────────────┘

After Hover:
┌──────────────────┐  ← Top border animates in
│ 01               │
│ Benefit Text     │
└──────────────────┘  ← Card lifts up (translateY: -4px)
                      ← Shadow increases
```

### Curriculum Cards
```
Before Hover:
┌──────────────────┐
│ 01               │
│ Item Text        │
└──────────────────┘

After Hover:
┌──────────────────┐  ← Top border scales in from left
│ 01               │
│ Item Text        │
└──────────────────┘  ← Card lifts up (translateY: -6px)
                      ← Corner accent glows
```

### Ashram Image
```
Before Hover:
┌──────────────────┐
│                  │
│   Image          │
│   (sepia filter) │
│                  │
└──────────────────┘

After Hover:
┌──────────────────┐
│                  │
│   Image          │
│   (zoomed 1.04x) │
│   (color restored)
│                  │
└──────────────────┘
```

---

## 📊 Font Size Scaling

### Using clamp() for Fluid Typography

```css
/* Benefits Item */
font-size: clamp(0.9rem, 1.4vw, 1rem);
/* Scales from 0.9rem at 360px to 1rem at 1920px */

/* Curriculum Number */
font-size: 2.2rem;
/* Fixed size, responsive via media queries */

/* Section Title */
font-size: clamp(1.4rem, 3.5vw, 2.4rem);
/* Scales smoothly across all breakpoints */
```

---

## 🔄 Transition Effects

All interactive elements use smooth transitions:

```css
/* Benefits & Curriculum Cards */
transition: all 0.3s ease;
transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Ashram Image */
transition: transform 0.6s ease, filter 0.6s ease;

/* Borders & Shadows */
transition: opacity 0.3s ease;
```

---

## ✅ Testing Recommendations

1. **Desktop Testing**
   - Test at 1920px, 1600px, 1400px, 1200px
   - Verify hover effects work smoothly
   - Check spacing and alignment

2. **Tablet Testing**
   - Test at 1024px, 768px
   - Verify grid transitions
   - Check touch interactions

3. **Mobile Testing**
   - Test at 640px, 540px, 420px, 360px
   - Verify no horizontal scrolling
   - Check font readability
   - Test touch targets (min 44px)

4. **Cross-browser Testing**
   - Chrome, Firefox, Safari, Edge
   - iOS Safari, Chrome Mobile
   - Android Chrome, Firefox Mobile

---

## 🚀 Performance Tips

- Use DevTools to check for layout thrashing
- Monitor animation performance (60fps target)
- Test on real devices, not just browser emulation
- Use Lighthouse for performance audits
- Check Core Web Vitals (LCP, FID, CLS)
