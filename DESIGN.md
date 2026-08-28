---
name: Library Online
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#46483c'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#76786b'
  outline-variant: '#c6c8b8'
  surface-tint: '#56642b'
  primary: '#56642b'
  on-primary: '#ffffff'
  primary-container: '#8a9a5b'
  on-primary-container: '#253000'
  inverse-primary: '#bdce89'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#7a507a'
  on-tertiary: '#ffffff'
  tertiary-container: '#b384b1'
  on-tertiary-container: '#431e44'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9eaa3'
  primary-fixed-dim: '#bdce89'
  on-primary-fixed: '#161f00'
  on-primary-fixed-variant: '#3e4c16'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffd6fa'
  tertiary-fixed-dim: '#eab6e6'
  on-tertiary-fixed: '#300c32'
  on-tertiary-fixed-variant: '#603961'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-lg: 48px
  stack-md: 24px
  stack-sm: 12px
---

## Brand & Style
The design system for Library Online is rooted in **Modern Minimalism**. It aims to evoke a sense of quietude, focus, and intellectual clarity, mimicking the physical experience of a high-end, contemporary library. The target audience includes researchers, casual readers, and students who require an interface that recedes into the background to prioritize content legibility. 

The aesthetic is characterized by expansive whitespace, a restricted "paper-like" color palette, and a focus on structural harmony. By stripping away non-essential decorative elements, the design system ensures that the path to discovery—searching, browsing, and reading—is frictionless and dignified.

## Colors
The palette is intentionally subdued to reduce cognitive load and visual fatigue during long reading sessions.

- **Backgrounds:** The primary surface is `#FAFAFA`, providing a soft, non-glare "off-white" foundation that is easier on the eyes than pure white.
- **Typography:** `#2D2D2D` (Deep Charcoal) provides high contrast for accessibility while maintaining a softer edge than true black.
- **Primary Action:** A soft sage green (`#8A9A5B`) is used for the most important calls to action (e.g., "Borrow," "Read Now").
- **Secondary/Accents:** A muted gold (`#D4AF37`) is used sparingly for highlighting curation, featured collections, or "member-only" status indicators.
- **System States:** Success, Warning, and Error states should be desaturated to match the overall muted aesthetic, ensuring they communicate urgency without breaking the refined atmosphere.

## Typography
Manrope is the sole typeface for this design system, chosen for its modern geometric construction balanced with humanist warmth. 

- **Scale:** High contrast between headlines and body text helps establish a clear information hierarchy.
- **Legibility:** Body text uses a generous 1.6 line-height to facilitate comfortable long-form reading. 
- **Labels:** Use medium or semi-bold weights with slight tracking (letter spacing) for metadata, such as ISBN numbers or author names, to differentiate them from prose.
- **Mobile:** Headlines scale down to prevent awkward line breaks on narrow viewports while maintaining their bold character.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop to maintain a premium, editorial feel, while transitioning to a fluid model for mobile.

- **Horizontal Rhythm:** A 12-column grid is used for desktop (1280px max-width) with wide 32px gutters to prevent content density. 
- **Vertical Rhythm:** Generous vertical padding (stack-lg) is used between major sections to allow the UI to "breathe."
- **Margins:** High-margin layouts (64px on desktop) focus the user's eye toward the center, where the content resides.
- **Mobile Adaption:** On mobile, margins reduce to 20px, and the grid collapses to a single column, maintaining the 1.6 line-height for body text to ensure readability is never compromised.

## Elevation & Depth
Depth is communicated through **Ambient Shadows** and tonal separation rather than heavy borders.

- **The "Paper" Layer:** Most content sits on the base surface (#FAFAFA).
- **The "Floating" Layer:** Cards, modals, and dropdowns use a very soft, diffused shadow. Use a large blur radius (24px - 40px) with low opacity (4-8%) charcoal tinting. Avoid hard edges or high-offset shadows.
- **Tonal Separation:** In leu of shadows for secondary elements, use a slightly darker neutral (e.g., #F2F2F2) to define header areas or sidebar containers.
- **Interactions:** On hover, cards may subtly lift by increasing the shadow blur and decreasing its Y-offset, providing a tactile but gentle response.

## Shapes
The shape language is friendly and modern, utilizing a consistent `16px` (1rem) corner radius for all primary UI elements.

- **Cards & Containers:** Follow the standard `16px` (rounded-lg) radius to soften the interface.
- **Buttons:** Use `rounded-lg` for a cohesive look with cards, or `rounded-xl` (24px) for a more approachable, pill-like feel on smaller buttons.
- **Inputs:** Maintain the `rounded-lg` standard to ensure form fields feel like integrated parts of the overall container system.
- **Selection Indicators:** Use subtle rounded corners even on small elements like checkboxes or focus states to maintain the soft visual theme.

## Components
- **Buttons:** Primary buttons use the Sage Green background with white text. Secondary buttons use a transparent background with a 1px charcoal border or a subtle charcoal text link.
- **Cards:** Book covers should be displayed in cards with `16px` rounded corners. The card itself should have no border, using only the ambient shadow to define its boundary against the background.
- **Inputs:** Text fields should use a slightly darker background than the page (`#F2F2F2`) with no border, using a 2px Sage Green bottom border or outline only upon focus.
- **Chips:** Used for genres or tags. These should have a light grey background and `rounded-xl` (pill) shapes, using `label-sm` typography.
- **Lists:** Search results should be separated by generous whitespace and a very thin, low-opacity horizontal divider (`rgba(0,0,0,0.05)`).
- **Navigation:** The top navigation should be minimal, using `label-md` for links, with a subtle underline or color shift to Sage Green for the active state.