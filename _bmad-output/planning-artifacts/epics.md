---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: '2025-12-31'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "design_guidelines.md"
  - "docs/project-overview.md"
  - "docs/architecture.md"
  - "docs/data-models.md"
  - "docs/component-inventory.md"
project_name: "RateMyApartment"
---

# RateMyApartment - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for RateMyApartment, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Home Page & Navigation**
- FR1: Full-screen NYC background image or video (hero section)
- FR2: Centered hero search bar with building name/address autocomplete
- FR3: Mission statement display: "Honest, anonymous reviews from real NYC renters."
- FR4: Fixed navigation bar at top with links to Search, Login/Signup, Add Building
- FR5: "How It Works" section with 3-step visual guide (Search → Read Reviews → Contribute)
- FR6: Responsive design for mobile and desktop

**Building Search**
- FR7: Search input field with real-time filtering by building name
- FR8: Building cards displaying: building name, address, overall rating (stars), review count
- FR9: Click-through from search results to Building Detail page
- FR10: Pagination or infinite scroll for large result sets
- FR11: Empty state messaging when no results found

**Building Detail Page**
- FR12: Left Panel displaying: Building name, street address, landlord name (if available)
- FR13: Right Panel displaying: Overall star rating, total review count, prominent "Write a Review" CTA button
- FR14: Visual rating bars/indicators for: Noise, Cleanliness, Maintenance, Safety, Pests
- FR15: Aggregate scores calculated from all approved reviews
- FR16: Interactive charts showing floor-level rating distributions with ability to filter/highlight specific floors
- FR17: Review cards displaying: star rating, floor number, review text, uploaded photos with sorting options
- FR18: Photo lightbox/gallery for viewing uploaded images

**Review Submission**
- FR19: Overall rating (1-5 star selector) - Required
- FR20: Floor number selector (dropdown or input) - Required
- FR21: Category ratings (Noise, Cleanliness, Maintenance, Safety, Pests) - 1-5 scale each
- FR22: Text review field (minimum 50 characters recommended) - Required
- FR23: Photo upload (multiple images, max 5, max 5MB each) - Optional
- FR24: Anonymous posting toggle (default: ON)
- FR25: Form validation with inline error messaging
- FR26: Submit triggers review creation, success modal, redirect to Building Detail page

**Add Building**
- FR27: Building name, Street address, City (pre-filled NYC), ZIP code - Required
- FR28: Landlord/Management company name, Neighborhood, Building type - Optional
- FR29: ZIP code validated against NYC ZIP codes
- FR30: Real-time address validation via Google Geocoding API
- FR31: Warning displayed if similar building exists with link to existing entry
- FR32: Submit creates pending building entry for admin approval

**Authentication**
- FR33: Email/Password login form with "Forgot Password?" and "Create Account" links
- FR34: Signup form with password strength indicator, confirm password, Terms of Service checkbox
- FR35: Password reset flow via Postmark API with secure time-limited token

**User Account Settings**
- FR36: Change email address with verification email to new address
- FR37: Change password (requires current password confirmation)
- FR38: View list of user's submitted reviews
- FR39: Delete account option with confirmation modal
- FR40: Notification preferences (email opt-in/out)

**Admin: User Management**
- FR41: Paginated list of all user accounts with search by email address
- FR42: View user details (email, signup date, review count, status), edit user information
- FR43: Send password reset email, suspend/activate user accounts, delete user accounts

**Admin: Dashboard & Moderation**
- FR44: Dashboard metrics (Total users, buildings, reviews, pending approvals, engagement)
- FR45: Review moderation (list pending reviews, approve/deny with optional notification)
- FR46: Building moderation (list pending buildings, approve/deny, edit before approval)
- FR47: Bulk actions for efficient moderation

**Admin: Duplicate Detection**
- FR48: System flags potential duplicates based on address normalization
- FR49: Similarity scoring using geocoded coordinates, queue for admin review
- FR50: Side-by-side comparison, select primary record, merge action transfers reviews
- FR51: Confirmation modal before merge, audit log of all operations

### Non-Functional Requirements

**Performance**
- NFR1: Page load time < 3 seconds
- NFR2: Search results < 500ms

**Scalability**
- NFR3: Architecture should support 100,000+ buildings and 1M+ reviews

**Availability**
- NFR4: 99.5% uptime target

**Accessibility**
- NFR5: WCAG 2.1 AA compliance

**Compatibility**
- NFR6: Full functionality on iOS and Android browsers
- NFR7: Chrome, Firefox, Safari, Edge (latest 2 versions)

**Security**
- NFR8: Password hashing using bcrypt or Argon2
- NFR9: Secure session management with httpOnly cookies
- NFR10: HTTPS enforcement across all endpoints
- NFR11: Rate limiting on authentication and submission endpoints
- NFR12: Input sanitization to prevent XSS and SQL injection
- NFR13: API key storage in environment variables

### Additional Requirements (from Architecture & Existing Codebase)

**Brownfield Context - Existing Implementation:**
- Homepage with video background (day/night modes) - IMPLEMENTED
- Glassmorphic hero search bar - IMPLEMENTED
- Responsive navigation with mobile menu - IMPLEMENTED
- Dark/light theme toggle - IMPLEMENTED
- "How It Works" section - IMPLEMENTED
- Footer with navigation links - IMPLEMENTED
- 50+ shadcn/ui components available - IMPLEMENTED
- Database schema for users - IMPLEMENTED
- Storage interface abstraction - IMPLEMENTED

**Architecture Decisions (from architecture.md):**
- Cookie-based sessions with PostgreSQL store (connect-pg-simple)
- Offset-based pagination (?page=&limit=)
- Simple error format: { "message": "..." }
- PostgreSQL ILIKE for search (no extra infrastructure)
- Google Maps Geocoding API for address validation
- Postmark for email delivery
- Replit Object Storage for photo uploads
- 5MB max file size, JPEG/PNG/WebP only
- File naming: reviews/{reviewId}/{uuid}.{ext}

**Implementation Patterns (from architecture.md):**
- Component organization by feature: components/{feature}/
- File naming: kebab-case.tsx
- API response format: { data: [...], pagination?: {...} }
- TanStack Query for all data fetching
- Loading/error states with early returns
- Form submission with isPending state

**Database Schema Extensions Required:**
- Extend users table (add email, role, status, created_at)
- Add buildings table with geocode fields
- Add reviews table with multi-dimensional ratings
- Add review_photos table for image references
- Add duplicate_queue table for moderation

**Design System (from design_guidelines.md):**
- Typography: Instrument Serif (headlines) + DM Sans (body)
- Colors: Ink (#1C1917), Ink Light (#57534E), Stone (#A8A29E), Cream (#FDFAF6), Amber (#B45309)
- Cards: White background, 1px border (#E7E5E4), rounded-xl (16px), p-6
- Forms: White inputs, border (#E7E5E4), rounded-lg, p-3
- Rating stars: Amber (#D97706) filled, gray outlines

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-FR6 | N/A | Home Page (Already Implemented) |
| FR7 | Epic 2 | Search input with real-time filtering |
| FR8 | Epic 2 | Building cards display |
| FR9 | Epic 2 | Click-through to building detail |
| FR10 | Epic 2 | Pagination for results |
| FR11 | Epic 2 | Empty state messaging |
| FR12 | Epic 3 | Building info panel |
| FR13 | Epic 3 | Rating panel with CTA |
| FR14 | Epic 3 | Category rating bars |
| FR15 | Epic 3 | Aggregate score calculations |
| FR16 | Epic 3 | Floor insights charts |
| FR17 | Epic 3 | Review list with sorting |
| FR18 | Epic 3 | Photo gallery lightbox |
| FR19 | Epic 4 | Overall rating selector |
| FR20 | Epic 4 | Floor number selector |
| FR21 | Epic 4 | Category ratings input |
| FR22 | Epic 4 | Text review field |
| FR23 | Epic 4 | Photo upload |
| FR24 | Epic 4 | Anonymous toggle |
| FR25 | Epic 4 | Form validation |
| FR26 | Epic 4 | Submission flow |
| FR27 | Epic 2 | Add building required fields |
| FR28 | Epic 2 | Add building optional fields |
| FR29 | Epic 2 | NYC ZIP validation |
| FR30 | Epic 2 | Geocoding API integration |
| FR31 | Epic 2 | Duplicate warning |
| FR32 | Epic 2 | Pending building status |
| FR33 | Epic 1 | Login form |
| FR34 | Epic 1 | Signup form |
| FR35 | Epic 1 | Password reset flow |
| FR36 | Epic 1 | Change email |
| FR37 | Epic 1 | Change password |
| FR38 | Epic 1 | View submitted reviews |
| FR39 | Epic 1 | Delete account |
| FR40 | Epic 1 | Notification preferences |
| FR41 | Epic 5 | User list with search |
| FR42 | Epic 5 | User details view/edit |
| FR43 | Epic 5 | User actions (suspend/delete) |
| FR44 | Epic 5 | Dashboard metrics |
| FR45 | Epic 5 | Review moderation |
| FR46 | Epic 5 | Building moderation |
| FR47 | Epic 5 | Bulk actions |
| FR48 | Epic 6 | Duplicate detection |
| FR49 | Epic 6 | Similarity scoring queue |
| FR50 | Epic 6 | Merge interface |
| FR51 | Epic 6 | Merge confirmation & audit |

## Epic List

### Epic 1: User Authentication & Account Management
Users can register, login, reset passwords, and manage their accounts.
**FRs covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40

### Epic 2: Building Database & Search
Users can search for NYC buildings, view search results, and add new buildings.
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR27, FR28, FR29, FR30, FR31, FR32

### Epic 3: Building Details & Review Display
Users can view comprehensive building details with ratings, floor insights, and reviews.
**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17, FR18

### Epic 4: Review Submission System
Authenticated users can submit detailed reviews with ratings, text, and photos.
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26

### Epic 5: Admin Dashboard & Content Moderation
Administrators can manage users and moderate buildings/reviews.
**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46, FR47

### Epic 6: Duplicate Building Detection & Merge
Administrators can identify and merge duplicate building entries.
**FRs covered:** FR48, FR49, FR50, FR51

---

## Epic 1: User Authentication & Account Management

Users can register, login, reset passwords, and manage their accounts.

### Story 1.1: User Registration

As a **prospective user**,
I want **to create an account with my email and password**,
So that **I can save my reviews and access personalized features**.

**Acceptance Criteria:**

**Given** I am on the signup page
**When** I enter a valid email, password (with strength indicator), confirm password, and accept Terms of Service
**Then** my account is created with role "user" and status "active"
**And** I am automatically logged in and redirected to the homepage
**And** a welcome email is sent via Postmark

**Given** I enter a password
**When** the password is less than 8 characters or lacks complexity
**Then** the strength indicator shows "weak" and I see inline validation errors

**Given** I try to register with an existing email
**When** I submit the form
**Then** I see an error "An account with this email already exists"

**Technical Notes:**
- Extends users table: adds email, password_hash, role, status, created_at
- Uses bcrypt for password hashing
- Creates session with PostgreSQL store (connect-pg-simple)

---

### Story 1.2: User Login

As a **registered user**,
I want **to login with my email and password**,
So that **I can access my account and submit reviews**.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter valid email and password
**Then** I am authenticated and redirected to the homepage
**And** a secure httpOnly session cookie is set

**Given** I enter incorrect credentials
**When** I submit the form
**Then** I see an error "Invalid email or password"
**And** I remain on the login page

**Given** I am logged in
**When** I visit any page
**Then** the navbar shows my account menu instead of Login/Signup

---

### Story 1.3: Password Reset Flow

As a **user who forgot their password**,
I want **to reset my password via email**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

**Given** I click "Forgot Password?" on the login page
**When** the modal appears and I enter my registered email
**Then** a password reset email is sent via Postmark with a secure token (24-hour expiry)

**Given** I click the reset link in the email
**When** the link is valid and not expired
**Then** I see a form to enter a new password with confirmation

**Given** I submit a new password
**When** the password meets strength requirements
**Then** my password is updated, I am logged in, and redirected to homepage

**Given** I click an expired or invalid reset link
**When** the page loads
**Then** I see "This reset link has expired. Please request a new one."

---

### Story 1.4: User Settings - Profile Management

As an **authenticated user**,
I want **to change my email and password**,
So that **I can keep my account secure and up to date**.

**Acceptance Criteria:**

**Given** I am on the Account Settings page
**When** I enter a new email address
**Then** a verification email is sent to the new address
**And** my email is updated only after clicking the verification link

**Given** I want to change my password
**When** I enter my current password and a new password (with confirmation)
**Then** my password is updated and I see a success message

**Given** I enter an incorrect current password
**When** I submit the password change form
**Then** I see "Current password is incorrect"

---

### Story 1.5: View My Reviews

As an **authenticated user**,
I want **to see a list of all reviews I've submitted**,
So that **I can track my contributions to the platform**.

**Acceptance Criteria:**

**Given** I am on the Account Settings page
**When** I view the "My Reviews" section
**Then** I see a list of my submitted reviews with building name, rating, date, and status (pending/approved/denied)

**Given** I have no submitted reviews
**When** I view the "My Reviews" section
**Then** I see "You haven't submitted any reviews yet" with a CTA to browse buildings

---

### Story 1.6: Account Deletion & Notification Preferences

As an **authenticated user**,
I want **to delete my account and manage email notifications**,
So that **I have control over my data and communications**.

**Acceptance Criteria:**

**Given** I am on the Account Settings page
**When** I click "Delete Account"
**Then** a confirmation modal appears warning that this action is irreversible

**Given** I confirm account deletion
**When** I click "Yes, delete my account"
**Then** my account and associated data are deleted, I am logged out, and redirected to homepage

**Given** I am on Account Settings
**When** I toggle notification preferences
**Then** I can opt in/out of email notifications (review approved, review denied)

---

## Epic 2: Building Database & Search

Users can search for NYC buildings, view search results, and add new buildings.

### Story 2.1: Building Database Schema & Search API

As a **user**,
I want **to search for NYC buildings by name or address**,
So that **I can find buildings I'm interested in reviewing or researching**.

**Acceptance Criteria:**

**Given** I enter a search term in the search bar (homepage or search page)
**When** I submit the search
**Then** I see matching buildings filtered by name or address using PostgreSQL ILIKE
**And** results are returned in < 500ms

**Given** there are many results
**When** I view the search results
**Then** results are paginated (20 per page) with page navigation

**Given** no buildings match my search
**When** I view the results
**Then** I see an empty state: "No buildings found. Try a different search or add a new building."

**Technical Notes:**
- Creates `buildings` table with: id, name, address, city, zip, landlord, neighborhood, building_type, geocode_lat, geocode_lng, status, created_at
- API endpoint: GET /api/buildings?search=&page=&limit=
- Index on address for performance

---

### Story 2.2: Building Search Results Page

As a **user**,
I want **to see search results as visual building cards**,
So that **I can quickly scan and compare buildings**.

**Acceptance Criteria:**

**Given** I am on the search results page
**When** buildings are displayed
**Then** each building card shows: name, address, overall rating (stars), review count

**Given** I click on a building card
**When** the card is clicked
**Then** I am navigated to the Building Detail page

**Given** I am on the homepage
**When** I submit a search in the hero search bar
**Then** I am redirected to the search page with results

**Technical Notes:**
- Creates `client/src/pages/search.tsx`
- Creates `client/src/components/buildings/building-card.tsx`
- Connects existing hero search to this page

---

### Story 2.3: Add Building Form

As an **authenticated user**,
I want **to add a new building to the platform**,
So that **I can review a building that doesn't exist yet**.

**Acceptance Criteria:**

**Given** I am logged in and on the "Add Building" page
**When** I fill in required fields (name, address, ZIP) and optional fields (landlord, neighborhood, building type)
**Then** I can submit the form

**Given** I enter a ZIP code
**When** the ZIP is not a valid NYC ZIP (10001-10499, 10451-10475, 11201-11256, 11004-11697, 10301-10314)
**Then** I see an error "Please enter a valid NYC ZIP code"

**Given** I submit a valid building
**When** the form is processed
**Then** the building is created with status "pending" for admin approval
**And** I see a success modal: "Building submitted! Write the first review?"

---

### Story 2.4: Address Geocoding & Duplicate Detection

As a **user adding a building**,
I want **the system to validate my address and warn me of duplicates**,
So that **I don't create duplicate building entries**.

**Acceptance Criteria:**

**Given** I enter an address in the Add Building form
**When** I blur the address field or submit
**Then** the address is validated via Google Geocoding API
**And** geocode_lat and geocode_lng are stored

**Given** a similar building already exists (based on normalized address or proximity)
**When** I submit the form
**Then** I see a warning: "A similar building may already exist: [Building Name]. View existing building?"
**And** I can choose to view the existing building or continue adding

**Given** the Google Geocoding API returns no results
**When** I submit the form
**Then** I see an error "We couldn't validate this address. Please check and try again."

**Technical Notes:**
- Server-side integration with Google Maps Geocoding API
- Environment variable: GOOGLE_MAPS_API_KEY
- Duplicate detection using geocode proximity (e.g., within 50 meters)

---

## Epic 3: Building Details & Review Display

Users can view comprehensive building details with ratings, floor insights, and reviews.

### Story 3.1: Building Detail Page Layout

As a **user**,
I want **to view a building's complete information on a dedicated page**,
So that **I can understand the building before deciding to review or rent**.

**Acceptance Criteria:**

**Given** I navigate to a building detail page (/building/:id)
**When** the page loads
**Then** I see a two-column layout with:
- Left panel: Building name, street address, landlord name (if available)
- Right panel: Overall star rating, total review count, prominent "Write a Review" CTA button

**Given** I am not logged in
**When** I click "Write a Review"
**Then** I am redirected to the login page with a return URL

**Given** I am logged in
**When** I click "Write a Review"
**Then** I am navigated to the review submission form for this building

**Technical Notes:**
- Creates `client/src/pages/building.tsx`
- API endpoint: GET /api/buildings/:id
- Uses existing Card, Button components from shadcn/ui

---

### Story 3.2: Category Ratings Display

As a **user**,
I want **to see detailed category ratings for a building**,
So that **I can understand specific aspects like noise, cleanliness, and safety**.

**Acceptance Criteria:**

**Given** I am on a building detail page
**When** the page loads
**Then** I see visual rating bars for 5 categories: Noise, Cleanliness, Maintenance, Safety, Pests
**And** each bar shows the aggregate score (1-5) calculated from all approved reviews

**Given** a building has no approved reviews
**When** I view the category ratings
**Then** I see "No ratings yet" with empty/gray rating bars

**Given** a building has approved reviews
**When** I view the category ratings
**Then** scores are calculated as averages of all approved reviews, rounded to 1 decimal

**Technical Notes:**
- Creates `client/src/components/reviews/rating-display.tsx`
- Aggregate calculations done server-side for performance
- Uses Amber (#D97706) for filled bars per design guidelines

---

### Story 3.3: Reviews Schema & Review List

As a **user**,
I want **to read all reviews for a building**,
So that **I can learn from other renters' experiences**.

**Acceptance Criteria:**

**Given** I am on a building detail page
**When** I scroll to the reviews section
**Then** I see review cards showing: star rating, floor number, review text, photos (if any), date posted

**Given** there are multiple reviews
**When** I view the review list
**Then** I can sort by: Newest, Highest Rated, Lowest Rated

**Given** a building has no reviews
**When** I view the reviews section
**Then** I see "No reviews yet. Be the first to share your experience!"

**Technical Notes:**
- Creates `reviews` table: id, building_id, user_id, overall_rating, floor_number, noise_rating, cleanliness_rating, maintenance_rating, safety_rating, pest_rating, review_text, is_anonymous, status, created_at
- Creates `review_photos` table: id, review_id, image_url, created_at
- Creates `client/src/components/reviews/review-card.tsx`
- API endpoint: GET /api/buildings/:id/reviews?sort=

---

### Story 3.4: Floor Insights Chart

As a **user**,
I want **to see floor-level rating distributions**,
So that **I can understand if certain floors have better or worse experiences**.

**Acceptance Criteria:**

**Given** I am on a building detail page with reviews
**When** I view the Floor Insights section
**Then** I see a vertical bar chart showing average ratings by floor

**Given** I hover over or click a floor bar
**When** I interact with the chart
**Then** I see the floor number and average rating highlighted

**Given** a building has reviews from only a few floors
**When** I view the chart
**Then** only floors with reviews are displayed (no empty floors)

**Technical Notes:**
- Creates `client/src/components/buildings/floor-insights.tsx`
- Uses CSS-based bar chart per design guidelines (Amber bars with varying opacity)
- Floor data aggregated server-side

---

### Story 3.5: Photo Gallery & Lightbox

As a **user**,
I want **to view photos uploaded with reviews**,
So that **I can see visual evidence of building conditions**.

**Acceptance Criteria:**

**Given** I am viewing a review with photos
**When** I see the review card
**Then** photos are displayed in a horizontal thumbnail row

**Given** I click on a photo thumbnail
**When** the lightbox opens
**Then** I see the full-size image with navigation arrows for multiple photos

**Given** I am in the lightbox
**When** I click outside the image or press Escape
**Then** the lightbox closes

**Technical Notes:**
- Creates `client/src/components/reviews/photo-gallery.tsx`
- Uses Dialog component from shadcn/ui for lightbox
- Images loaded from Replit Object Storage URLs

---

## Epic 4: Review Submission System

Authenticated users can submit detailed reviews with ratings, text, and photos.

### Story 4.1: Review Form - Ratings & Text

As an **authenticated user**,
I want **to rate a building with overall and category scores**,
So that **I can share my specific experiences with the community**.

**Acceptance Criteria:**

**Given** I am logged in and on the review form for a building
**When** I view the form
**Then** I see inputs for:
- Overall rating (1-5 stars, required)
- Floor number (dropdown/input, required)
- Category ratings: Noise, Cleanliness, Maintenance, Safety, Pests (1-5 each)
- Text review field (required, minimum 50 characters recommended)

**Given** I select a star rating
**When** I click on a star
**Then** that star and all stars before it are filled (amber color)
**And** the rating value is stored

**Given** I enter fewer than 50 characters in the review text
**When** I see the character count
**Then** I see a warning "We recommend at least 50 characters for a helpful review"

**Technical Notes:**
- Creates `client/src/pages/add-review.tsx`
- Creates `client/src/components/reviews/rating-input.tsx`
- Route: /building/:id/review

---

### Story 4.2: Photo Upload

As an **authenticated user**,
I want **to upload photos with my review**,
So that **I can provide visual evidence of building conditions**.

**Acceptance Criteria:**

**Given** I am on the review form
**When** I view the photo upload section
**Then** I see a drag-drop zone with "Upload photos (optional, max 5)"

**Given** I select or drop image files
**When** the files are valid (JPEG, PNG, WebP, max 5MB each)
**Then** I see thumbnail previews of the uploaded images
**And** I can remove individual photos before submission

**Given** I try to upload more than 5 photos
**When** I add the 6th photo
**Then** I see an error "Maximum 5 photos allowed"

**Given** I try to upload an invalid file (wrong type or > 5MB)
**When** the upload is rejected
**Then** I see an error explaining the file requirements

**Technical Notes:**
- Creates `client/src/components/reviews/photo-upload.tsx`
- Uploads to Replit Object Storage
- Path: reviews/{reviewId}/{uuid}.{ext}
- Creates `server/services/storage.ts` for Object Storage integration

---

### Story 4.3: Anonymous Toggle & Form Validation

As an **authenticated user**,
I want **to choose whether my review is anonymous**,
So that **I can protect my identity if I'm concerned about retaliation**.

**Acceptance Criteria:**

**Given** I am on the review form
**When** I view the anonymous toggle
**Then** it is ON by default with label "Post anonymously"

**Given** I toggle anonymous OFF
**When** I submit the review
**Then** my username is displayed with the review

**Given** I leave anonymous ON (default)
**When** I submit the review
**Then** the review shows "Anonymous" instead of my username

**Given** I submit the form with missing required fields
**When** validation runs
**Then** I see inline error messages for each missing field
**And** the form does not submit

**Technical Notes:**
- Uses Zod for form validation
- Anonymous state stored in reviews.is_anonymous field

---

### Story 4.4: Review Submission & Confirmation

As an **authenticated user**,
I want **to submit my review and receive confirmation**,
So that **I know my review was received and is pending approval**.

**Acceptance Criteria:**

**Given** I have completed the review form with all required fields
**When** I click "Submit Review"
**Then** the review is created with status "pending"
**And** photos are associated with the review
**And** I see a success modal: "Thank you! Your review is pending approval."

**Given** the modal is displayed
**When** I click "View Building" or dismiss the modal
**Then** I am redirected to the building detail page

**Given** there is a server error during submission
**When** the API returns an error
**Then** I see an error toast "Something went wrong. Please try again."
**And** my form data is preserved

**Technical Notes:**
- API endpoint: POST /api/reviews
- Uses TanStack Query mutation pattern
- Invalidates building queries on success

---

## Epic 5: Admin Dashboard & Content Moderation

Administrators can manage users and moderate buildings/reviews.

### Story 5.1: Admin Role & Protected Routes

As an **administrator**,
I want **secure access to admin functionality**,
So that **only authorized users can moderate content**.

**Acceptance Criteria:**

**Given** I am logged in with role "admin"
**When** I navigate to /admin/*
**Then** I can access admin pages

**Given** I am logged in with role "user" (not admin)
**When** I try to access /admin/*
**Then** I am redirected to a 403 Forbidden page

**Given** I am not logged in
**When** I try to access /admin/*
**Then** I am redirected to the login page

**Given** I am an admin
**When** I view the navbar
**Then** I see an "Admin" link in my account menu

**Technical Notes:**
- Creates `server/middleware/auth.ts` with requireAdmin middleware
- Creates `client/src/components/auth/auth-guard.tsx`
- Admin routes under /api/admin/* protected server-side

---

### Story 5.2: Admin Dashboard & Metrics

As an **administrator**,
I want **to see platform metrics at a glance**,
So that **I can monitor platform health and growth**.

**Acceptance Criteria:**

**Given** I am on the admin dashboard (/admin)
**When** the page loads
**Then** I see metric cards showing:
- Total users (with new signups this week)
- Total buildings (with pending count)
- Total reviews (with pending count)
- Engagement: reviews per day average

**Given** I view the dashboard
**When** I see pending counts > 0
**Then** the pending counts are highlighted as badges

**Technical Notes:**
- Creates `client/src/pages/admin/dashboard.tsx`
- API endpoint: GET /api/admin/metrics
- Uses Card components with large serif numbers per design guidelines

---

### Story 5.3: User Management

As an **administrator**,
I want **to view and manage user accounts**,
So that **I can handle user issues and enforce platform rules**.

**Acceptance Criteria:**

**Given** I am on the User Management page (/admin/users)
**When** the page loads
**Then** I see a paginated table of users with: email, signup date, review count, status

**Given** I enter a search term
**When** I search by email
**Then** the table filters to matching users

**Given** I click on a user row
**When** the user details panel opens
**Then** I can: view full details, send password reset email, suspend/activate account, delete account

**Given** I suspend a user
**When** I confirm the action
**Then** the user's status changes to "suspended" and they cannot log in

**Technical Notes:**
- Creates `client/src/pages/admin/users.tsx`
- Creates `client/src/components/admin/user-management.tsx`
- API endpoints: GET /api/admin/users, PATCH /api/admin/users/:id, DELETE /api/admin/users/:id

---

### Story 5.4: Review Moderation Queue

As an **administrator**,
I want **to review and approve/deny pending reviews**,
So that **only quality content appears on the platform**.

**Acceptance Criteria:**

**Given** I am on the Moderation page (/admin/moderation)
**When** I view the Reviews tab
**Then** I see a list of pending reviews with: building name, rating, review text preview, submitted date

**Given** I click on a pending review
**When** the full review is displayed
**Then** I see the complete review text, all ratings, photos, and user info (if not anonymous)

**Given** I click "Approve"
**When** the action is confirmed
**Then** the review status changes to "approved" and it appears on the building page

**Given** I click "Deny"
**When** I optionally enter a reason
**Then** the review status changes to "denied" and optionally the user is notified via email

**Technical Notes:**
- Creates `client/src/components/admin/moderation-queue.tsx`
- API endpoints: GET /api/admin/reviews/pending, PATCH /api/admin/reviews/:id

---

### Story 5.5: Building Moderation Queue

As an **administrator**,
I want **to review and approve/deny pending buildings**,
So that **only valid buildings appear in search results**.

**Acceptance Criteria:**

**Given** I am on the Moderation page
**When** I view the Buildings tab
**Then** I see a list of pending buildings with: name, address, submitted date

**Given** I click on a pending building
**When** the building details are displayed
**Then** I can view all fields and edit them before approval

**Given** I click "Approve"
**When** the action is confirmed
**Then** the building status changes to "approved" and it appears in search results

**Given** I click "Deny"
**When** I confirm the action
**Then** the building is removed from the queue

**Technical Notes:**
- API endpoints: GET /api/admin/buildings/pending, PATCH /api/admin/buildings/:id

---

### Story 5.6: Bulk Moderation Actions

As an **administrator**,
I want **to approve or deny multiple items at once**,
So that **I can efficiently process large moderation queues**.

**Acceptance Criteria:**

**Given** I am viewing a moderation queue (reviews or buildings)
**When** I select multiple items using checkboxes
**Then** bulk action buttons appear: "Approve Selected", "Deny Selected"

**Given** I click "Approve Selected" with 5 items selected
**When** I confirm the action
**Then** all 5 items are approved and removed from the queue

**Given** I use "Select All" on a page
**When** I click the select all checkbox
**Then** all visible items on the current page are selected

**Technical Notes:**
- API endpoints: POST /api/admin/reviews/bulk, POST /api/admin/buildings/bulk
- Accepts array of IDs with action (approve/deny)

---

## Epic 6: Duplicate Building Detection & Merge

Administrators can identify and merge duplicate building entries.

### Story 6.1: Duplicate Detection System

As the **system**,
I want **to automatically detect potential duplicate buildings**,
So that **administrators can review and merge them**.

**Acceptance Criteria:**

**Given** a new building is submitted
**When** the building is saved with geocode coordinates
**Then** the system checks for existing buildings within 50 meters
**And** if a potential duplicate is found, an entry is created in the duplicate_queue

**Given** a duplicate pair is detected
**When** the entry is created
**Then** it includes: building_id_1, building_id_2, similarity_score, status "pending"

**Given** similarity scoring
**When** calculating the score
**Then** the score is based on: geocode proximity + normalized address matching

**Technical Notes:**
- Creates `duplicate_queue` table: id, building_id_1, building_id_2, similarity_score, status, created_at
- Creates `server/services/duplicate-detection.ts`
- Runs on building creation/approval

---

### Story 6.2: Duplicate Queue for Admin Review

As an **administrator**,
I want **to see a queue of potential duplicate buildings**,
So that **I can review and decide whether to merge them**.

**Acceptance Criteria:**

**Given** I am on the Admin Dashboard or Moderation page
**When** there are pending duplicates
**Then** I see a "Duplicates" tab/section with a count badge

**Given** I view the duplicates queue
**When** the list loads
**Then** I see pairs of buildings with: names, addresses, similarity score, detected date

**Given** I click on a duplicate pair
**When** the detail view opens
**Then** I see both buildings side-by-side for comparison

**Technical Notes:**
- API endpoint: GET /api/admin/duplicates
- Creates `client/src/components/admin/duplicate-resolver.tsx`

---

### Story 6.3: Side-by-Side Building Comparison

As an **administrator**,
I want **to compare two potential duplicate buildings side-by-side**,
So that **I can make an informed decision about merging**.

**Acceptance Criteria:**

**Given** I am viewing a duplicate pair
**When** the comparison view loads
**Then** I see both buildings with all fields displayed:
- Name, Address, City, ZIP
- Landlord, Neighborhood, Building Type
- Number of reviews, Average rating
- Created date

**Given** the buildings have different field values
**When** I view the comparison
**Then** differences are highlighted visually

**Given** I want to keep both buildings
**When** I click "Dismiss"
**Then** the duplicate queue entry is marked "dismissed" and removed from the queue

**Technical Notes:**
- Uses two-column layout with diff highlighting
- Shows review counts to help decide which is the "master"

---

### Story 6.4: Merge Duplicate Buildings

As an **administrator**,
I want **to merge two duplicate buildings into one**,
So that **all reviews are consolidated under a single building**.

**Acceptance Criteria:**

**Given** I am viewing a duplicate pair comparison
**When** I click "Merge Buildings"
**Then** I am prompted to select the primary (master) building to keep

**Given** I select Building A as the master
**When** I confirm the merge
**Then**:
- All reviews from Building B are transferred to Building A
- Building B is archived or deleted
- The duplicate queue entry is marked "merged"
- An audit log entry is created with: merge date, admin user, buildings involved

**Given** I click "Merge"
**When** the confirmation modal appears
**Then** I see a warning: "This will transfer X reviews from [Building B] to [Building A]. This action cannot be undone."

**Technical Notes:**
- API endpoint: POST /api/admin/duplicates/:id/merge
- Transaction to ensure atomic review transfer
- Audit log for compliance
