# Manifestly Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from wellness and spiritual apps like Calm, Co-Star, and Headspace, combined with the mystical aesthetic of tarot/astrology apps. This experience-focused product requires emotional resonance through visual design to maximize engagement and conversion.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 280 65% 85% (Soft Lavender) - main backgrounds, cards
- Secondary: 250 60% 75% (Cosmic Blue) - accents, borders
- Accent: 320 70% 80% (Pink Glow) - CTAs, highlights
- Text: 270 15% 25% (Deep Purple-Gray)
- Surface: 0 0% 98% (Off-white)

**Dark Mode:**
- Primary: 280 40% 15% (Deep Purple-Black)
- Secondary: 250 35% 20% (Midnight Blue)
- Accent: 320 55% 60% (Vibrant Pink)
- Text: 280 10% 95% (Light Lavender)
- Surface: 270 20% 12% (Rich Dark Purple)

**Gradient Overlays:**
- Energy Card: from-purple-400/20 via-blue-500/20 to-pink-400/20
- Hero: from-lavender-100 to-cosmic-200
- Share Images: radial gradient from accent to primary

### B. Typography

**Font Families:**
- Display/Headers: "Playfair Display", serif (Google Fonts)
- Affirmations/Cards: "Dancing Script", cursive (for mystical touch)
- Body/UI: "Inter", sans-serif (for readability)

**Scale:**
- Hero Headline: text-5xl md:text-6xl font-serif
- Card Messages: text-2xl md:text-3xl font-cursive leading-relaxed
- Body: text-base md:text-lg
- Buttons: text-sm md:text-base font-medium
- Streak Badge: text-xs font-bold

### C. Layout System

**Spacing Units:** Consistent use of Tailwind units 4, 6, 8, 12, 16, 20, 24
- Card padding: p-8 md:p-12
- Section spacing: py-16 md:py-24
- Component gaps: gap-6 or gap-8
- Input/button height: h-12 md:h-14

**Containers:**
- Mobile-first: max-w-md (single column focus)
- Desktop: max-w-2xl for chat area
- Full sections: max-w-6xl for landing hero

### D. Component Library

**Energy Card:**
- Floating card design with backdrop-blur-xl and shadow-2xl
- Animated entrance: fade-in with gentle scale (0.95 → 1)
- Soft rounded corners: rounded-3xl
- Gradient border: border-2 with gradient background clip

**Chat Interface:**
- Bubble-style messages (user vs. AI differentiation)
- User: right-aligned, primary color background
- AI: left-aligned, gradient background with glow effect
- Input: Floating bottom bar with soft shadow, sticky positioning

**CTA Buttons:**
- Primary ($9.99 subscription): Full gradient with glow, text-white
- Secondary ($1.99 unlock): Outline with blur background if on gradient
- Share: Icon + text combination, accent color
- Height: h-12, rounded-full, px-8

**Payment Modal:**
- Centered overlay with backdrop-blur-md
- Card design with rounded-2xl
- Clear pricing display with benefit bullets
- Secure badge/trust indicators

**Streak Counter:**
- Floating badge: top-right corner, rounded-full
- Fire emoji + number
- Subtle pulse animation when updated
- Background: accent with slight transparency

**Share Image Generator:**
- 1080x1080px canvas
- Quote centered with Dancing Script font
- Gradient background (matching Energy Card)
- Watermark: "✨ Manifestly" bottom-right, opacity-60

### E. Animations

**Strategic Use Only:**
- Energy Card entrance: 800ms ease-out fade + scale
- Streak badge pulse: 2s interval when incremented
- Button hover: subtle lift (translateY(-2px)) + glow intensify
- Modal appearance: backdrop fade + card slide-up
- No scroll-triggered animations (maintain performance)

## Mobile-First Specifics

**Touch Targets:**
- Minimum 44px height for all interactive elements
- Generous padding around buttons (p-4)

**Progressive Enhancement:**
- Base: single column, full-width cards
- md: max-width containers, side-by-side CTAs
- lg: wider layouts for desktop (but still centered focus)

**PWA Features:**
- App-like header: sticky, minimal, with streak badge
- Bottom navigation bar (if multiple screens added later)
- Splash screen: gradient with logo/icon

## Images

**Hero Section:**
- Option 1: Abstract mystical illustration (cosmic energy, stars, gentle light rays)
- Option 2: Serene gradient with subtle particle effects
- Placement: Full-width background behind text, with overlay opacity-30
- Style: Dreamy, ethereal, not photographic

**Share Image Templates:**
- User-generated quote cards use gradient backgrounds only (no photos)
- Watermark logo: small, bottom-right corner

## Visual Hierarchy

1. **Landing Page:** Large "What are you feeling today?" prompt → Text input (prominent) → Submit CTA
2. **Energy Card:** AI message (largest text) → CTA buttons (clear secondary action)
3. **Payment Modal:** Price (hero element) → Benefits list → Purchase button (high contrast)
4. **Profile:** Streak badge (top) → Stats grid → Premium upgrade prompt

## Accessibility
- Dark mode as default (spiritual/mystical vibe)
- Light mode toggle available
- Input fields clearly labeled with aria-labels
- Focus states visible with glow rings (ring-accent)
- Text contrast ratio 4.5:1 minimum

## Brand Voice Through Design
- Soft, welcoming curves (rounded-3xl, rounded-full)
- Dreamy gradients suggest divine connection
- Serif typography adds gravitas and timelessness
- Generous spacing creates calm, meditative feel
- Glow effects enhance mystical atmosphere without overwhelming