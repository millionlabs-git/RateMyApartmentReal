# Story 4.1: Review Form - Ratings & Text

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to rate a building with overall and category scores**,
so that **I can share my specific experiences with the community**.

## Acceptance Criteria

1. **Given** I am logged in and on the review form for a building **When** I view the form **Then** I see inputs for:
   - Overall rating (1-5 stars, required)
   - Floor number (dropdown/input, required)
   - Category ratings: Noise, Cleanliness, Maintenance, Safety, Pests (1-5 each)
   - Text review field (required, minimum 50 characters recommended)

2. **Given** I select a star rating **When** I click on a star **Then** that star and all stars before it are filled (amber color) **And** the rating value is stored

3. **Given** I enter fewer than 50 characters in the review text **When** I see the character count **Then** I see a warning "We recommend at least 50 characters for a helpful review"

## Tasks / Subtasks

- [ ] Task 1: Create add review page (AC: 1)
  - [ ] Create client/src/pages/add-review.tsx
  - [ ] Add route /building/:id/review to App.tsx
  - [ ] Require authentication (redirect to login)
  - [ ] Fetch building info for context
  - [ ] Display building name at top

- [ ] Task 2: Create star rating input component (AC: 2)
  - [ ] Create client/src/components/reviews/rating-input.tsx
  - [ ] Interactive 1-5 star selector
  - [ ] Click fills stars up to clicked position
  - [ ] Hover preview effect
  - [ ] Amber color (#D97706) for filled stars
  - [ ] Gray outline for empty stars
  - [ ] 32px star size per design

- [ ] Task 3: Create floor number input (AC: 1)
  - [ ] Dropdown or number input
  - [ ] Range: 1-100 (or configurable)
  - [ ] Required field
  - [ ] Label: "Which floor did you live on?"

- [ ] Task 4: Create category ratings section (AC: 1, 2)
  - [ ] Create client/src/components/reviews/category-rating-input.tsx
  - [ ] 5 category rows: Noise, Cleanliness, Maintenance, Safety, Pests
  - [ ] Each with its own star rating input
  - [ ] Optional (but recommended)
  - [ ] Tooltips explaining each category

- [ ] Task 5: Create review text area (AC: 1, 3)
  - [ ] Textarea with character count
  - [ ] Minimum 1 character (required)
  - [ ] Recommended 50+ characters
  - [ ] Warning below 50 characters
  - [ ] Warning message styling

- [ ] Task 6: Create review form component (AC: 1)
  - [ ] Create client/src/components/reviews/review-form.tsx
  - [ ] Combine all input components
  - [ ] Form state management with React Hook Form
  - [ ] Zod validation schema
  - [ ] Overall layout and styling

- [ ] Task 7: Category tooltips (AC: 1)
  - [ ] Noise: "Sound levels from neighbors, street, building systems"
  - [ ] Cleanliness: "Common area maintenance, hallways, lobby"
  - [ ] Maintenance: "Response time and quality of repairs"
  - [ ] Safety: "Building security, lighting, entry systems"
  - [ ] Pests: "Presence of roaches, mice, bedbugs"

## Dev Notes

### Architecture Patterns
- React Hook Form for form state
- Zod for validation
- Controlled components for star ratings
- Character count display

### Components to Create/Modify
- `client/src/pages/add-review.tsx` - New
- `client/src/components/reviews/rating-input.tsx` - New
- `client/src/components/reviews/category-rating-input.tsx` - New
- `client/src/components/reviews/review-form.tsx` - New
- `client/src/App.tsx` - Add route

### Design Guidelines
- Star selectors: Interactive amber stars, 32px size
- Single-column centered layout, max-width 600px
- Form sections with visual progress feel
- DM Sans for labels, 0.875rem

### Project Structure Notes

- Review components in `client/src/components/reviews/`
- Follow existing form patterns
- Use Textarea component from shadcn/ui

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR19, FR20, FR21, FR22]
- [Source: design_guidelines.md#Rating Components]
- [Source: design_guidelines.md#Write Review / Add Building Forms]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
