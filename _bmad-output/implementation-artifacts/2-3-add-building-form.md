# Story 2.3: Add Building Form

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to add a new building to the platform**,
so that **I can review a building that doesn't exist yet**.

## Acceptance Criteria

1. **Given** I am logged in and on the "Add Building" page **When** I fill in required fields (name, address, ZIP) and optional fields (landlord, neighborhood, building type) **Then** I can submit the form

2. **Given** I enter a ZIP code **When** the ZIP is not a valid NYC ZIP (10001-10499, 10451-10475, 11201-11256, 11004-11697, 10301-10314) **Then** I see an error "Please enter a valid NYC ZIP code"

3. **Given** I submit a valid building **When** the form is processed **Then** the building is created with status "pending" for admin approval **And** I see a success modal: "Building submitted! Write the first review?"

## Tasks / Subtasks

- [ ] Task 1: Create add building page (AC: 1, 2, 3)
  - [ ] Create client/src/pages/add-building.tsx
  - [ ] Add route /add-building to App.tsx
  - [ ] Require authentication (redirect to login if not)

- [ ] Task 2: Create building form component (AC: 1, 2)
  - [ ] Create client/src/components/buildings/building-form.tsx
  - [ ] Building name input (required)
  - [ ] Street address input (required)
  - [ ] City input (pre-filled "New York", disabled)
  - [ ] ZIP code input (required)
  - [ ] Landlord/Management company input (optional)
  - [ ] Neighborhood select (optional)
  - [ ] Building type select (optional: apartment, condo, co-op, townhouse)

- [ ] Task 3: Implement NYC ZIP validation (AC: 2)
  - [ ] Create ZIP validation utility
  - [ ] Manhattan: 10001-10499
  - [ ] Bronx: 10451-10475
  - [ ] Brooklyn: 11201-11256
  - [ ] Queens: 11004-11697
  - [ ] Staten Island: 10301-10314
  - [ ] Show inline error for invalid ZIP

- [ ] Task 4: Create add building API endpoint (AC: 3)
  - [ ] Create POST /api/buildings route
  - [ ] Require authentication
  - [ ] Validate with Zod schema
  - [ ] Validate NYC ZIP code server-side
  - [ ] Create building with status: "pending"
  - [ ] Return created building

- [ ] Task 5: Create success modal (AC: 3)
  - [ ] Create success dialog after submission
  - [ ] Message: "Building submitted for review!"
  - [ ] "Write the first review" button → /building/:id/review
  - [ ] "View building" button → /building/:id
  - [ ] "Close" button

- [ ] Task 6: Add navigation link
  - [ ] Add "Add Building" link to navbar
  - [ ] Show only when authenticated

## Dev Notes

### Architecture Patterns
- Protected route requiring authentication
- Form validation with Zod (client and server)
- Building created with pending status
- TanStack Query mutation for submission

### NYC ZIP Code Ranges
- Manhattan: 10001-10282, 10301-10314 (SI uses some 103xx)
- Bronx: 10451-10475
- Brooklyn: 11201-11256
- Queens: 11004-11697
- Staten Island: 10301-10314

### Components to Create/Modify
- `client/src/pages/add-building.tsx` - New
- `client/src/components/buildings/building-form.tsx` - New
- `server/routes.ts` - Add POST /api/buildings
- `client/src/lib/validation.ts` - NYC ZIP validation utility

### Design Guidelines
- Form layout: Single-column, max-width 600px
- Inputs: White background, border, rounded-lg, p-3
- Submit button: Solid ink background, white text

### Project Structure Notes

- Building form uses existing shadcn/ui Form components
- Select components for neighborhood and building type
- Follow existing form patterns

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR27, FR28, FR29, FR32]
- [Source: design_guidelines.md#Forms]
- [Source: design_guidelines.md#Write Review / Add Building Forms]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
