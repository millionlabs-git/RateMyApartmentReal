# Story 4.4: Review Submission & Confirmation

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to submit my review and receive confirmation**,
so that **I know my review was received and is pending approval**.

## Acceptance Criteria

1. **Given** I have completed the review form with all required fields **When** I click "Submit Review" **Then** the review is created with status "pending" **And** photos are associated with the review **And** I see a success modal: "Thank you! Your review is pending approval."

2. **Given** the modal is displayed **When** I click "View Building" or dismiss the modal **Then** I am redirected to the building detail page

3. **Given** there is a server error during submission **When** the API returns an error **Then** I see an error toast "Something went wrong. Please try again." **And** my form data is preserved

## Tasks / Subtasks

- [ ] Task 1: Create review submission endpoint (AC: 1, 3)
  - [ ] Create POST /api/reviews route
  - [ ] Require authentication
  - [ ] Validate with Zod schema
  - [ ] Validate building_id exists and is approved
  - [ ] Create review with status "pending"
  - [ ] Associate photo URLs with review
  - [ ] Return created review

- [ ] Task 2: Create photo association logic (AC: 1)
  - [ ] Accept array of photo URLs in request
  - [ ] Create review_photos records
  - [ ] Link to created review
  - [ ] Move temp photos to final path (optional)

- [ ] Task 3: Create submission mutation (AC: 1, 3)
  - [ ] Use TanStack Query useMutation
  - [ ] POST to /api/reviews
  - [ ] Handle loading state (isPending)
  - [ ] Handle success
  - [ ] Handle error
  - [ ] Invalidate building queries on success

- [ ] Task 4: Create success modal (AC: 1, 2)
  - [ ] Create client/src/components/reviews/submission-success-modal.tsx
  - [ ] Use Dialog component
  - [ ] Message: "Thank you! Your review is pending approval."
  - [ ] Subtext explaining moderation process
  - [ ] "View Building" button
  - [ ] Close button

- [ ] Task 5: Implement submit button (AC: 1, 3)
  - [ ] "Submit Review" button
  - [ ] Loading state: "Submitting..."
  - [ ] Disabled during submission
  - [ ] Trigger form validation first

- [ ] Task 6: Handle success flow (AC: 1, 2)
  - [ ] Show success modal on successful submission
  - [ ] On modal close: redirect to building page
  - [ ] Clear form state

- [ ] Task 7: Handle error flow (AC: 3)
  - [ ] Show error toast on API error
  - [ ] Preserve form data
  - [ ] Allow retry
  - [ ] Log error for debugging

- [ ] Task 8: Add rate limiting consideration
  - [ ] One review per user per building (optional)
  - [ ] Or rate limit submissions (per NFR11)

## Dev Notes

### Architecture Patterns
- TanStack Query mutation pattern
- Optimistic invalidation
- Modal for success confirmation
- Toast for error notification
- Form data preservation on error

### API Request Body
```json
{
  "building_id": 123,
  "overall_rating": 4,
  "floor_number": 5,
  "noise_rating": 3,
  "cleanliness_rating": 4,
  "maintenance_rating": 4,
  "safety_rating": 5,
  "pest_rating": 4,
  "review_text": "Great building overall...",
  "is_anonymous": true,
  "photo_urls": ["url1", "url2"]
}
```

### Components to Create/Modify
- `server/routes.ts` - Add POST /api/reviews
- `client/src/components/reviews/review-form.tsx` - Add submission
- `client/src/components/reviews/submission-success-modal.tsx` - New

### Project Structure Notes

- Review created with "pending" status
- Photos linked via review_photos table
- Invalidate building queries to refresh review count

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR26]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: design_guidelines.md#Modals]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
