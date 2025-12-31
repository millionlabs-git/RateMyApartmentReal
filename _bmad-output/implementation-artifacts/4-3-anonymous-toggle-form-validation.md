# Story 4.3: Anonymous Toggle & Form Validation

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to choose whether my review is anonymous**,
so that **I can protect my identity if I'm concerned about retaliation**.

## Acceptance Criteria

1. **Given** I am on the review form **When** I view the anonymous toggle **Then** it is ON by default with label "Post anonymously"

2. **Given** I toggle anonymous OFF **When** I submit the review **Then** my username is displayed with the review

3. **Given** I leave anonymous ON (default) **When** I submit the review **Then** the review shows "Anonymous" instead of my username

4. **Given** I submit the form with missing required fields **When** validation runs **Then** I see inline error messages for each missing field **And** the form does not submit

## Tasks / Subtasks

- [ ] Task 1: Create anonymous toggle component (AC: 1)
  - [ ] Use Switch component from shadcn/ui
  - [ ] Label: "Post anonymously"
  - [ ] Description text explaining the option
  - [ ] Default: ON (checked)

- [ ] Task 2: Integrate toggle into form (AC: 1, 2, 3)
  - [ ] Add toggle to review-form.tsx
  - [ ] Position near submit button
  - [ ] Store value in form state
  - [ ] Pass to submission

- [ ] Task 3: Create Zod validation schema (AC: 4)
  - [ ] overall_rating: required, 1-5
  - [ ] floor_number: required, positive integer
  - [ ] review_text: required, min 1 character
  - [ ] Category ratings: optional, 1-5 each
  - [ ] is_anonymous: boolean, default true
  - [ ] photos: optional, array of URLs

- [ ] Task 4: Implement form validation (AC: 4)
  - [ ] Integrate Zod schema with React Hook Form
  - [ ] Real-time validation on blur
  - [ ] Validation on submit
  - [ ] Prevent submission if invalid

- [ ] Task 5: Create inline error messages (AC: 4)
  - [ ] Error text below each field
  - [ ] Red color (#DC2626) per design
  - [ ] Error icon optional
  - [ ] Clear error on valid input

- [ ] Task 6: Highlight invalid fields (AC: 4)
  - [ ] Red border on invalid inputs
  - [ ] Scroll to first error on submit
  - [ ] Focus first invalid field

- [ ] Task 7: Add form-level error handling
  - [ ] Display API errors
  - [ ] Handle network errors
  - [ ] Toast for unexpected errors

## Dev Notes

### Architecture Patterns
- Zod for schema validation
- React Hook Form for form management
- Inline validation messages
- is_anonymous stored with review

### Validation Rules
- overall_rating: required, integer 1-5
- floor_number: required, positive integer
- review_text: required, non-empty string
- noise_rating, cleanliness_rating, etc.: optional, integer 1-5
- is_anonymous: boolean, defaults to true

### Components to Create/Modify
- `client/src/components/reviews/review-form.tsx` - Add validation
- `client/src/components/reviews/anonymous-toggle.tsx` - New (or inline)
- `shared/schema.ts` - Review validation schema

### Design Guidelines
- Form error states: Red text (#DC2626) with icon, below input
- Focus states: Border changes to accent color
- Switch component for toggle

### Project Structure Notes

- Use existing Zod + React Hook Form patterns
- Error messages follow design guidelines
- Accessibility: proper ARIA labels

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR24, FR25]
- [Source: design_guidelines.md#Forms]
- [Source: design_guidelines.md#Accessibility]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
