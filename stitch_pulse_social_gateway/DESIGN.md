---
name: Resonant Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cfc6ae'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#98907a'
  outline-variant: '#4c4634'
  surface-tint: '#e7c433'
  primary: '#ffeebb'
  on-primary: '#3b2f00'
  primary-container: '#f4d03f'
  on-primary-container: '#6c5900'
  inverse-primary: '#705d00'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#eeeeee'
  on-tertiary: '#2f3131'
  tertiary-container: '#d2d2d2'
  on-tertiary-container: '#595a5b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe174'
  primary-fixed-dim: '#e7c433'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: syne
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: syne
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: syne
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: spaceGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: spaceGrotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: spaceGrotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: spaceGrotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: spaceGrotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: spaceGrotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
spacing:
  grid-columns: '12'
  gutter: 1.5rem
  margin-desktop: 4rem
  margin-mobile: 1.5rem
  space-3xs: 0.25rem
  space-2xs: 0.5rem
  space-xs: 0.75rem
  space-sm: 1rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4rem
  space-2xl: 6rem
---

## Brand & Style

This design system embraces a raw, high-contrast aesthetic that merges brutalist structural elements with editorial sophistication. It is engineered for cultural platforms, artist portfolios, and immersive storytelling applications where the content acts as the primary visual driver.

### Brand Personality
- **Raw:** Unapologetic use of stark monochrome foundations and exposed grid structures.
- **Expressive:** Driven by high-impact typography and deliberate, high-contrast focal points.
- **Authoritative:** Confident, commanding spatial arrangements that demand attention.

### Target Audience
Creators, cultural curators, artists, and audiences who value authenticity, bold artistic vision, and uncompromised digital experiences.

### Emotional Response
Evokes the electrifying energy of a live performance—intense, focused, and deeply resonant. The interface feels immediate, tactile, and culturally relevant.

## Colors

The palette is anchored by deep, moody blacks and stark whites, creating an uncompromising high-contrast canvas. A signature warm gold acts as the singular chromatic accent, drawing the eye to critical interactive states and focal points.

- **Primary Accent (#F4D03F):** Warm gold used exclusively for active states, key CTAs, and focal highlights.
- **Secondary (#212121):** Charcoal surface tone for cards, containers, and structural elevation.
- **Tertiary (#FFFFFF):** Stark white for primary typography and maximum contrast elements.
- **Neutral Base (#121212):** Deep moody black utilized for the core background environment.

## Typography

Typography acts as a primary architectural element. Headlines leverage an avant-garde geometric sans with expressive letterforms, creating an editorial, poster-like quality. Body and label text utilize a precise, technical grotesk to ensure absolute legibility against dense, dark canvases. 

Text tracking is intentionally tightened on large display headers to create dense, impactful text blocks reminiscent of concert flyers and print culture.

## Layout & Spacing

The layout model relies on a strict 12-column asymmetric grid system paired with generous whitespace margins to let heavy typographic elements breathe. 

### Breakpoints & Adaptability
- **Mobile (< 768px):** Single-column stack with tight 1.5rem side margins. Large typography scales down proportionally to maintain readability.
- **Tablet (768px - 1024px):** Fluid 6-column sub-grid structures with 2rem margins.
- **Desktop (> 1024px):** Full 12-column expansive layout with 4rem architectural margins and persistent vertical grid lines that visually anchor the composition.

## Elevation & Depth

Depth is achieved through high-contrast structural layering rather than soft ambient shadows. 

- **Surface Tiers:** Surfaces stack from the deep moody black base (`#121212`) up through charcoal containers (`#212121`) to stark white elements.
- **Outlines & Borders:** Low-opacity white or stark charcoal borders define boundaries explicitly. Avoid blurred drop shadows entirely; instead, use crisp 1px borders and sharp geometric shifts to delineate interactive layers.
- **Focus States:** Elevation changes are signaled by swapping surface fills to the signature warm gold (`#F4D03F`) or applying stark white outlines.

## Shapes

The shape language is strictly **sharp (0px roundedness)** to reinforce the brutalist, editorial poster aesthetic. 

- All containers, cards, input fields, and buttons feature absolute 90-degree corners. 
- The complete absence of border-radius creates an unyielding, architectural precision that contrasts against organic media content.

## Components

### Buttons
- **Primary:** Solid warm gold (`#F4D03F`) fill with stark black typography. Sharp 0px corners, zero shadow, and high-impact font weight.
- **Secondary:** Transparent fill with a 1px stark white border. On hover, the background inverts to solid white with black text.
- **Text:** Underlined stark white text with gold accent hover states.

### Chips & Tags
- Sharp rectangular containers using charcoal (`#212121`) fill and a thin white outline. Active filter chips invert to solid gold with dark text.

### Input Fields
- Solid charcoal backgrounds (`#212121`) with a 1px crisp white border. Focus states feature a 2px solid gold border with zero glow effects. Labels sit strictly outside the input box in uppercase label typography.

### Cards
- Immersive content containers featuring a charcoal surface (`#212121`), 1px white border, and flush edge-to-edge media handling. Hover triggers a stark white border transition.

### Lists & Dividers
- Structured with stark 1px white horizontal rules separating list items. Generous internal padding ensures items feel deliberate and airy despite the stark borders.

### Checkboxes & Radio Buttons
- Custom square (checkbox) and sharp diamond/square (radio) indicators. Unchecked state is a hollow 1px white box; checked state fills solidly with the signature warm gold.