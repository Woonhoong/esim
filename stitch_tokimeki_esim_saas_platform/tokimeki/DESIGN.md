---
name: Tokimeki
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#4a4455'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#6f46b9'
  on-secondary: '#ffffff'
  secondary-container: '#b188ff'
  on-secondary-container: '#44118d'
  tertiary: '#4e4e58'
  on-tertiary: '#ffffff'
  tertiary-container: '#666670'
  on-tertiary-container: '#e7e5f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ebdcff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#260059'
  on-secondary-fixed-variant: '#572ba0'
  tertiary-fixed: '#e3e1ed'
  tertiary-fixed-dim: '#c7c5d1'
  on-tertiary-fixed: '#1a1b23'
  on-tertiary-fixed-variant: '#46464f'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system is built on a foundation of **Apple-level Minimalism** blended with **Glassmorphism**. The personality is "Futuristic Hospitality"—it feels like a high-end concierge service for the digital age. 

The aesthetic prioritizes high-quality whitespace and a rhythmic hierarchy to evoke a sense of speed and reliability. By utilizing semi-transparent surfaces and soft, blurred backgrounds, the UI achieves a sense of depth without clutter, positioning the brand as a sophisticated yet approachable leader in the travel-tech sector.

## Colors

The palette is anchored by a vibrant **Primary Purple**, used sparingly for high-intent actions. **Deep Indigo** provides the necessary weight for professional grounding and contrast in typography. 

Backgrounds utilize **Soft Lavender** and pure **White** to maintain a clean, airy feel. Gradients should be subtle: use the purple-to-blue transition for active states or hero graphics, and the lavender-to-white transition for large card surfaces to guide the eye downward through the content.

## Typography

The typography strategy leverages **Space Grotesk** for headings to inject a technical, futuristic edge. These are paired with generous letter spacing in smaller labels to ensure a premium, spacious feel. 

**Inter** serves as the workhorse for body copy and UI elements, providing the neutral, utilitarian clarity required for a SaaS product. Maintain a clear vertical rhythm by using the defined line heights, ensuring that informational density never compromises the "Apple-level" minimalism.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop (12 columns) and a fluid model for mobile. A strict 4px/8px baseline grid ensures alignment across all components. 

Whitespace is treated as a functional element rather than "empty" space. Sections should be separated by large vertical gaps (`xl`) to allow the user's eyes to rest, while internal component spacing remains tight and structured. Content is centered in a maximum 1200px container to maintain readability on wide displays.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Ambient Shadows**. Instead of heavy blacks, shadows use a low-opacity Deep Indigo tint to feel integrated with the brand palette.

1.  **Level 0 (Base):** Soft Lavender background.
2.  **Level 1 (Cards):** White surfaces with a 1px thin border (`#E2E8F0`) and a subtle 4px blur shadow.
3.  **Level 2 (Overlays/Modals):** Background blur (20px) with 70% opacity white fill, creating a frosted glass effect that allows background colors to bleed through softly.

## Shapes

The design system utilizes a **Rounded** shape language to maintain its approachable personality. Main containers and cards use a base radius of 16px (`rounded-lg`), while smaller UI elements like buttons and input fields use 8px (`rounded-md`). 

For distinct brand elements or data badges, use the pill-shape (full radius) to provide a visual break from the structured grid of cards.

## Components

- **Buttons:** Primary buttons use the `gradient_accent` with white text. Secondary buttons use a white glass background with a thin purple border. Hover states should include a subtle lift (Y-axis shift).
- **Cards:** Use 16px+ corner radius. Apply a 1px border in a lighter shade of the background to define the edge against the lavender canvas.
- **Inputs:** Clean, white backgrounds with 8px corners. On focus, the border shifts to Primary Purple with a soft outer glow.
- **Chips/Badges:** Pill-shaped with Soft Lavender backgrounds and Deep Indigo text for status indicators (e.g., "Active," "Roaming").
- **eSIM Progress Tracker:** A custom component using a thin, gradient-filled line to represent the activation journey, emphasizing the "Fast" brand pillar.
- **Glass Headers:** Sticky navigation bars should use the 20px background blur to maintain context while scrolling.