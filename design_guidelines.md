# Design Guidelines: NYC Apartment Review Platform

## Design Approach
**Reference-Based**: Drawing inspiration from Airbnb's approachable, community-driven aesthetic combined with Medium's editorial refinement. The existing homepage establishes a warm, trustworthy foundation for a platform centered on authentic user experiences.

## Core Design Principles
1. **Editorial Warmth**: Instrument Serif headlines create an inviting, human-centered feel
2. **Glassmorphic Depth**: Frosted glass UI elements (established in hero search) signal transparency and honesty
3. **Restrained Elegance**: Minimal animations, maximum clarity

## Typography
- **Headlines**: Instrument Serif (400 weight) — 2rem to 4rem
- **Body/UI**: DM Sans (400 regular, 500 medium, 600 semibold) — 0.875rem to 1.125rem
- **Hierarchy**: Large serif headlines, clean sans-serif content, minimal font size variations

## Layout System
**Tailwind Spacing Units**: Primarily use 4, 8, 12, 16, 20, 24, 32 (p-4, gap-8, mt-12, etc.)
- Container max-width: 1000px for content, 1200px for wide layouts
- Section padding: py-16 to py-24 desktop, py-12 mobile
- Card/component spacing: p-6 to p-8
- Grid gaps: gap-6 to gap-8

## Component Library

### Navigation
- Fixed navbar with scroll-based background transition (as implemented)
- Desktop: full nav links, mobile: hamburger menu
- Consistent 1rem to 1.5rem vertical padding

### Search Interfaces
- **Hero Search**: Glassmorphic treatment (as implemented) — use for homepage only
- **Page Search Bars**: Solid white background, subtle border, 0.75rem padding, rounded-lg (12px)

### Cards (Building/Review Cards)
- White background, 1px border (#E7E5E4), rounded-xl (16px)
- Padding: p-6
- Hover: subtle shadow elevation, no color change
- Star ratings: Amber (#D97706) filled stars, gray outlines

### Forms (Review/Add Building/Auth)
- Input fields: White background, border (#E7E5E4), rounded-lg, p-3
- Labels: DM Sans medium (500), 0.875rem, ink-light color
- Focus states: Border changes to accent (#D97706), subtle shadow
- Submit buttons: Solid ink background (#1C1917), white text, rounded-lg, hover lift effect

### Rating Components
- Star selectors: Interactive amber stars (1-5), 32px size
- Category sliders: Horizontal bars with amber fill, labels on left
- Display ratings: Read-only stars with numeric score (e.g., "4.2 ★")

### Floor Insights Charts
- Simple vertical bar charts using CSS
- Bars: Amber (#D97706) with varying opacity
- Grid background: Subtle gray lines
- Floor labels: Small DM Sans (0.75rem)

### Modals
- Centered overlay with backdrop blur
- White card with rounded-2xl (24px), p-8
- Close button: Top-right, subtle gray
- Actions: Aligned right, primary + secondary button pattern

### Admin Tables
- Clean table layout with alternating row backgrounds (white/#FDFAF6)
- Header row: DM Sans semibold, ink color, border-b
- Cells: p-4 padding, 0.875rem font size
- Action buttons: Small pills (sm size), outlined style

### Photo Galleries
- Grid layout: grid-cols-2 md:grid-cols-3
- Images: aspect-ratio-square with object-cover
- Rounded corners: rounded-lg
- Lightbox: Full-screen modal with navigation arrows

### Empty States
- Centered content with illustration placeholder comment
- Serif headline + body text
- CTA button to primary action
- Gray (#A8A29E) icon or text

## Page-Specific Layouts

### Apartment Search Page
- Top: Search bar (solid white variant) with filters button
- Results: Masonry or 2-column grid of building cards
- Each card: Image placeholder (if available), name, address, rating, review count

### Building Detail Page
- **Two-column layout** (60/40 split on desktop, stacked mobile)
- Left: Building info header, category ratings (horizontal bars), floor chart, reviews list
- Right: Sticky sidebar with overall rating, "Write Review" CTA, quick stats
- Reviews: Chronological list with photos in horizontal scroll

### Write Review / Add Building Forms
- Single-column centered layout, max-width: 600px
- Multi-step feel with visual progress (numbered sections)
- Photo upload: Drag-drop zone with preview thumbnails below
- Anonymous toggle: Prominent switch near submit

### Login/Signup
- Centered card (max-width: 400px), minimal design
- Logo at top, form fields stacked with generous spacing (gap-4)
- Social proof: "Join 5,000+ NYC renters" beneath submit

### Admin Dashboard
- Sidebar navigation (fixed left, 240px wide)
- Main content: Metrics cards in grid-cols-4, tables below
- Metrics cards: White background, p-6, large serif number, label beneath

## Images
- **Homepage Hero**: Background video (NYC skyline/streets) — already implemented
- **Building Cards**: Placeholder for building photos (gray background with building icon)
- **Review Photos**: User-uploaded images in galleries
- **Empty States**: Illustrative icons (search icon, building icon, etc.)

## Accessibility
- Maintain WCAG AA contrast ratios
- Focus indicators: 2px accent color outline with offset
- Form error states: Red text (#DC2626) with icon, below input
- ARIA labels for icons and interactive elements