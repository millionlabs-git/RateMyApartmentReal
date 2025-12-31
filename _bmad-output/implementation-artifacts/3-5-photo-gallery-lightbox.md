# Story 3.5: Photo Gallery & Lightbox

Status: ready-for-dev

## Story

As a **user**,
I want **to view photos uploaded with reviews**,
so that **I can see visual evidence of building conditions**.

## Acceptance Criteria

1. **Given** I am viewing a review with photos **When** I see the review card **Then** photos are displayed in a horizontal thumbnail row

2. **Given** I click on a photo thumbnail **When** the lightbox opens **Then** I see the full-size image with navigation arrows for multiple photos

3. **Given** I am in the lightbox **When** I click outside the image or press Escape **Then** the lightbox closes

## Tasks / Subtasks

- [ ] Task 1: Create photo thumbnail row component (AC: 1)
  - [ ] Create client/src/components/reviews/photo-thumbnails.tsx
  - [ ] Horizontal flex row
  - [ ] Max 5 thumbnails visible
  - [ ] Square aspect ratio
  - [ ] object-cover for cropping
  - [ ] Rounded corners
  - [ ] Click handler for each thumbnail

- [ ] Task 2: Create photo lightbox component (AC: 2, 3)
  - [ ] Create client/src/components/reviews/photo-lightbox.tsx
  - [ ] Use Dialog component from shadcn/ui
  - [ ] Full-screen overlay with backdrop blur
  - [ ] Centered large image
  - [ ] Close button (X) in corner

- [ ] Task 3: Add navigation arrows (AC: 2)
  - [ ] Left/right arrow buttons
  - [ ] Navigate between photos in the review
  - [ ] Hide arrows if only one photo
  - [ ] Keyboard navigation (left/right arrows)

- [ ] Task 4: Implement close behaviors (AC: 3)
  - [ ] Click outside image to close
  - [ ] Escape key to close
  - [ ] Close button click

- [ ] Task 5: Create photo gallery wrapper (AC: 1, 2)
  - [ ] Create client/src/components/reviews/photo-gallery.tsx
  - [ ] Manages lightbox state
  - [ ] Tracks current photo index
  - [ ] Combines thumbnails + lightbox

- [ ] Task 6: Integrate into review card (AC: 1)
  - [ ] Add PhotoGallery to review-card.tsx
  - [ ] Only render if photos exist
  - [ ] Position below review text

- [ ] Task 7: Handle image loading
  - [ ] Loading placeholder/skeleton
  - [ ] Error state for failed images
  - [ ] Lazy loading for thumbnails

## Dev Notes

### Architecture Patterns
- Dialog component for modal lightbox
- State management for current photo index
- Keyboard event handlers
- Image URLs from Replit Object Storage

### Components to Create/Modify
- `client/src/components/reviews/photo-thumbnails.tsx` - New
- `client/src/components/reviews/photo-lightbox.tsx` - New
- `client/src/components/reviews/photo-gallery.tsx` - New
- `client/src/components/reviews/review-card.tsx` - Integrate

### Design Guidelines
- Grid layout: grid-cols-5 for thumbnails
- Images: aspect-ratio-square with object-cover
- Rounded corners: rounded-lg
- Lightbox: Full-screen modal with navigation arrows

### Project Structure Notes

- Use shadcn/ui Dialog for lightbox
- Keyboard accessibility (arrow keys, escape)
- Images loaded from Replit Object Storage URLs

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR18]
- [Source: design_guidelines.md#Photo Galleries]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
