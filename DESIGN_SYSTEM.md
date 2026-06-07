# Smart Captcha - Design System & Brand Guidelines

This document serves as the single source of truth for the design preferences, aesthetics, and UI/UX paradigms used across the Smart Captcha website. Refer to this when maintaining or expanding the project to ensure brand consistency.

## 1. Typography
- **Primary Font**: `Space Grotesk` (Google Fonts)
- **Weights Used**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra Bold)
- **Characteristics**: Technical, modern, crisp, highly legible for digital platforms.

## 2. Color Palette
The website uses a deep, premium dark mode aesthetic accented with vibrant, high-contrast neons to feel cinematic and high-end.

### Core Variables (`:root` in CSS)
- **Ink (Background Base)**: `#050b0d` (Very deep, near-black cyan)
- **Deep (Surface Base)**: `#091a22` (Slightly lighter dark cyan for elevation)
- **Panel (Glassmorphism Panels)**: `rgba(13, 27, 31, 0.65)`
- **Muted (Secondary Text)**: `#8e9fa5`
- **Line (Borders & Dividers)**: `rgba(0, 245, 212, 0.12)`

### Accents
- **Teal Bright (Primary Action / Hover)**: `#00f5d4` (Neon cyan, highly visible against darks)
- **Teal (Secondary Brand)**: `#00b4a6`
- **Teal Glow (Shadows & Halos)**: `rgba(0, 245, 212, 0.15)`
- **Gold (Highlights / Pricing / Featured)**: `#ffbe0b`
- **Wine (Warm Accent / Funerals)**: `#8f1d2b`

## 3. UI Aesthetics & Effects

### Backgrounds & Gradients
The site does not use flat black backgrounds. Instead, it uses dynamic layered backgrounds to create depth:
1. **Base Gradient**: `linear-gradient(135deg, #050b0d 0%, #091a22 50%, #04080a 100%)`
2. **Radial Highlights**: Soft, large radial gradients (`circle at 12% 6%`) in Teal and Gold to simulate ambient stage lighting.
3. **Grid Overlay**: A subtle `52px` by `52px` technical grid pattern on the body background, fading out towards the bottom via a `mask-image`.

### Glassmorphism
Panels, cards, and navigation bars use a "glass" effect:
- **Background**: Semi-transparent dark panels (`rgba(13, 27, 31, 0.65)`).
- **Backdrop Filter**: `blur(12px)` to distort elements beneath them.
- **Borders**: Thin, low-opacity borders (`1px solid var(--line)`).

### Shadows
- Cards and Modals use deep, soft drop shadows: `0 20px 48px rgba(0, 0, 0, 0.4)`
- Hover states on interactive elements add a colored halo glow: `0 16px 40px rgba(0, 245, 212, 0.15)`

## 4. Components & Layouts

### Buttons
- Buttons are pill-shaped (`border-radius: 99px`) or slightly rounded (`border-radius: 8px` for tabs).
- Primary actions use the `Teal Bright` color.
- Hover states include `transform: translateY(-2px)` and scaling to make them feel responsive and alive.

### Cards (Packages)
- Structured with an eyebrow category, a title, a large price, a bulleted list, and a prominent Call-to-Action button at the bottom.
- Hovering over a card lifts it slightly and illuminates its border with the `Teal` accent.

### Image Gallery
- Uses a **Masonry Layout** via CSS Columns (`column-count: 3`), ensuring images of varying heights fit perfectly without harsh cropping (like Pinterest).
- Images have subtle rounded corners (`border-radius: 16px`) and zoom slightly `scale(1.05)` on hover.
- **Lightbox Modal**: Images and videos open in a full-screen blurred overlay (`backdrop-filter: blur(8px)`) with a dark, cinematic background.

## 5. Micro-Interactions (Motion)
- **Transitions**: Almost all interactive elements (buttons, cards, images, lightboxes) use CSS transitions.
- Standard easing: `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)` (snappy start, smooth finish).
- Scrolling: The page uses smooth scrolling behavior natively (`scroll-behavior: smooth`).

---
*Created dynamically for Smart Captcha Studios to ensure all future UI updates match the premium, cinematic aesthetic established in the 2025 redesign.*
