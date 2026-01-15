# RateMyApartment - QA Testing Checklist

## Test Credentials

### Regular User (role: user)
```
Email: testuser@example.com
Password: TestUser123!
Role: user
Status: active
```

### Admin User (role: admin)
```
Email: admin@ratemyapartment.com
Password: AdminPass123!
Role: admin
Status: active
```

### Suspended User (for negative testing)
```
Email: suspended@example.com
Password: Suspended123!
Role: user
Status: suspended
```

> **Setup Note:** These test accounts must be created in the database before running tests. Use the signup flow or direct database insertion with bcrypt-hashed passwords.

---

## Test Environment Setup

### Prerequisites
1. Application running on `http://localhost:5000`
2. PostgreSQL database connected
3. Test accounts created (see credentials above)
4. At least 5 approved buildings in database
5. At least 3 pending buildings for admin tests
6. At least 3 pending reviews for admin tests

---

## 1. AUTHENTICATION FLOWS

### 1.1 User Registration (Sign Up)

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/signup` | Signup form displayed | URL: `/signup` |
| 2 | Leave all fields empty, click Submit | Validation errors shown for all required fields | Button: `[type="submit"]` |
| 3 | Enter invalid email format (e.g., "notanemail") | "Invalid email" error displayed | Input: `[name="email"]` |
| 4 | Enter valid email, password < 8 chars | "Password must be at least 8 characters" error | Input: `[name="password"]` |
| 5 | Enter valid email, valid password, mismatched confirm password | "Passwords do not match" error | Input: `[name="confirmPassword"]` |
| 6 | Enter valid data but don't check terms checkbox | "You must accept the terms" error | Checkbox: `[name="acceptTerms"]` |
| 7 | Enter valid email: `newuser@test.com`, password: `ValidPass123!`, matching confirm, check terms | Form submits successfully | All fields |
| 8 | Verify redirect to homepage | User logged in, homepage displayed | URL: `/` |
| 9 | Verify user menu shows email | User avatar/menu visible with email | Element: User dropdown |
| 10 | Try to signup with same email again | "Email already registered" error | POST `/api/auth/signup` |

### 1.2 User Login

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/login` | Login form displayed | URL: `/login` |
| 2 | Leave fields empty, click Submit | Validation errors shown | Button: `[type="submit"]` |
| 3 | Enter wrong email | "Invalid credentials" error | Input: `[name="email"]` |
| 4 | Enter correct email, wrong password | "Invalid credentials" error | Input: `[name="password"]` |
| 5 | Enter suspended user credentials | "Account suspended" or login blocked | Credentials: `suspended@example.com` |
| 6 | Enter valid credentials: `testuser@example.com` / `TestUser123!` | Login successful | All fields |
| 7 | Verify redirect to homepage | Homepage displayed, user logged in | URL: `/` |
| 8 | Verify session persists on page refresh | User remains logged in | Refresh page |
| 9 | Navigate to protected route `/settings` | Settings page accessible | URL: `/settings` |

### 1.3 Logout

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login as `testuser@example.com` | User logged in | - |
| 2 | Click user menu/avatar | Dropdown menu opens | Element: User avatar |
| 3 | Click "Sign Out" | Logout initiated | Button: Sign Out |
| 4 | Verify redirect to homepage | Homepage displayed | URL: `/` |
| 5 | Verify user menu no longer shows email | Login/Signup buttons visible | Element: Auth buttons |
| 6 | Navigate to `/settings` | Redirect to `/login` | URL: `/settings` |

### 1.4 Password Reset Flow

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/login` | Login page displayed | URL: `/login` |
| 2 | Click "Forgot Password" link | Forgot password form/modal displayed | Link: Forgot Password |
| 3 | Leave email empty, submit | "Email required" error | Input: `[name="email"]` |
| 4 | Enter non-existent email | Generic success message (security) | Input: Any email |
| 5 | Enter valid email: `testuser@example.com` | "Reset link sent" message | POST `/api/auth/forgot-password` |
| 6 | Check email (or database for token) | Reset email received with token link | Email/DB |
| 7 | Navigate to `/reset-password/invalid-token` | "Invalid or expired token" error | URL with bad token |
| 8 | Navigate to `/reset-password/{valid-token}` | Reset password form displayed | URL with valid token |
| 9 | Enter password < 8 chars | "Password must be at least 8 characters" error | Input: `[name="password"]` |
| 10 | Enter mismatched passwords | "Passwords do not match" error | Input: `[name="confirmPassword"]` |
| 11 | Enter valid new password: `NewPassword123!` | Password reset successful | Button: Submit |
| 12 | Verify auto-login or redirect to login | User can login with new password | Login flow |
| 13 | Try to use same token again | "Token already used" or "Invalid token" error | URL with used token |

---

## 2. BUILDING SEARCH & DISCOVERY

### 2.1 Homepage Search

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/` | Homepage with search bar displayed | URL: `/` |
| 2 | Verify hero section with video | Hero video playing | Element: Hero video |
| 3 | Verify "How It Works" section | Section visible with steps | Element: How it works |
| 4 | Enter search term in search bar: "Manhattan" | Autocomplete or search triggers | Input: Search bar |
| 5 | Press Enter or click Search | Redirect to `/search?q=Manhattan` | URL: `/search` |
| 6 | Verify search results displayed | Building cards with results | Element: Building cards |

### 2.2 Search Page Functionality

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/search` | Search page displayed | URL: `/search` |
| 2 | Enter empty search, submit | All approved buildings shown or "Enter search term" | Input: Search |
| 3 | Enter "123 Fake Street" (non-existent) | "No buildings found" message | Input: Search |
| 4 | Enter valid address partial: "Broadway" | Buildings with Broadway in address | GET `/api/buildings?q=Broadway` |
| 5 | Verify each result shows: name, address, rating, review count | All fields displayed on cards | Element: Building card |
| 6 | Verify only APPROVED buildings appear | No pending/denied buildings | Status check |
| 7 | Scroll to bottom of results | Pagination or load more appears | Element: Pagination |
| 8 | Click page 2 or "Load More" | Next set of results displayed | Pagination control |
| 9 | Click on a building card | Navigate to `/building/{id}` | Building card link |

### 2.3 Building Detail Page

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/building/{valid-id}` | Building detail page displayed | URL: `/building/:id` |
| 2 | Verify building name displayed | Name matches database | Element: Building name |
| 3 | Verify address, neighborhood, ZIP displayed | All location info shown | Element: Address info |
| 4 | Verify overall rating displayed | Star rating with numeric value | Element: Rating |
| 5 | Verify review count displayed | "X reviews" text | Element: Review count |
| 6 | Verify category ratings section | Noise, Cleanliness, Maintenance, Safety, Pests | Element: Category ratings |
| 7 | Verify floor insights chart | Chart/visualization displayed | Element: Floor chart |
| 8 | Verify reviews section | List of reviews displayed | Element: Reviews list |
| 9 | Test sort dropdown: "Newest" | Reviews sorted by date descending | Dropdown: Sort |
| 10 | Test sort dropdown: "Highest Rated" | Reviews sorted by rating descending | Dropdown: Sort |
| 11 | Test sort dropdown: "Lowest Rated" | Reviews sorted by rating ascending | Dropdown: Sort |
| 12 | Verify review pagination (if >10 reviews) | Pagination controls visible | Element: Pagination |
| 13 | Verify "Write a Review" CTA button | Button visible | Button: Write a Review |
| 14 | Click "Write a Review" (not logged in) | Redirect to `/login` | Button click |
| 15 | Navigate to `/building/invalid-uuid` | 404 page or "Building not found" error | URL with bad ID |

---

## 3. REVIEW SUBMISSION FLOWS

### 3.1 Add New Building

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/add-building` (not logged in) | Redirect to `/login` | URL: `/add-building` |
| 2 | Login as `testuser@example.com` | Login successful | - |
| 3 | Navigate to `/add-building` | Add building form displayed | URL: `/add-building` |
| 4 | Leave all fields empty, submit | Validation errors for required fields | Button: Submit |
| 5 | Enter building name only | "Address required" error | Input: `[name="name"]` |
| 6 | Enter name + address, invalid ZIP (e.g., "00000") | "Invalid NYC ZIP code" error | Input: `[name="zip"]` |
| 7 | Enter name + address + valid ZIP outside NYC range | "Must be valid NYC ZIP" error | ZIP validation |
| 8 | Fill valid data: Name="Test Building", Address="100 Test St", ZIP="10001" | Form validation passes | All required fields |
| 9 | Submit form | POST `/api/buildings` called | Button: Submit |
| 10 | Verify success message | "Building submitted for review" message | Element: Success |
| 11 | Verify building status is "pending" | Not visible in public search yet | DB check |

### 3.2 Duplicate Building Detection

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login as `testuser@example.com` | Login successful | - |
| 2 | Navigate to `/add-building` | Form displayed | URL: `/add-building` |
| 3 | Enter exact same name + address as existing approved building | Duplicate warning dialog appears | POST `/api/buildings/validate-address` |
| 4 | Click "Cancel" on duplicate dialog | Return to form | Button: Cancel |
| 5 | Click "Force Submit" on duplicate dialog | Building submitted to duplicate queue | Button: Force Submit |
| 6 | Verify success message | "Submitted for review" | Element: Success |
| 7 | Enter same address but different name | Address match warning appears | Validation response |
| 8 | Verify duplicate queue entry created (admin check) | Entry in duplicate_queue table | DB check |

### 3.3 Write Review

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/building/{id}/review` (not logged in) | Redirect to `/login` | URL: `/building/:id/review` |
| 2 | Login as `testuser@example.com` | Login successful | - |
| 3 | Navigate to `/building/{id}/review` | Review form displayed | URL: `/building/:id/review` |
| 4 | Verify building name shown on form | Correct building displayed | Element: Building name |
| 5 | Leave all fields empty, submit | Validation errors shown | Button: Submit |
| 6 | Select overall rating: 0 stars | "Rating required" error | Input: Star rating |
| 7 | Select overall rating: 4 stars | Rating selected | Input: Star rating |
| 8 | Leave floor number empty | "Floor required" error | Input: `[name="floorNumber"]` |
| 9 | Enter floor number: 0 | "Floor must be 1-200" error | Input: `[name="floorNumber"]` |
| 10 | Enter floor number: 201 | "Floor must be 1-200" error | Input: `[name="floorNumber"]` |
| 11 | Enter floor number: 5 | Valid input | Input: `[name="floorNumber"]` |
| 12 | Leave review text empty | "Review text required" error | Textarea: `[name="reviewText"]` |
| 13 | Enter review text: "Great apartment, loved living here!" | Valid input | Textarea: `[name="reviewText"]` |
| 14 | Verify anonymous checkbox is checked by default | Checkbox checked | Checkbox: `[name="isAnonymous"]` |
| 15 | Optionally fill category ratings (Noise: 4, Cleanliness: 5, etc.) | Ratings saved | Category inputs |
| 16 | Submit form | POST `/api/buildings/:id/reviews` | Button: Submit |
| 17 | Verify success message | "Review submitted pending moderation" | Element: Success |
| 18 | Verify review status is "pending" | Not visible publicly yet | DB check |

---

## 4. USER ACCOUNT MANAGEMENT

### 4.1 Settings Page Access

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/settings` (not logged in) | Redirect to `/login` | URL: `/settings` |
| 2 | Login as `testuser@example.com` | Login successful | - |
| 3 | Navigate to `/settings` | Settings page displayed | URL: `/settings` |
| 4 | Verify Email section visible | Current email shown | Element: Email section |
| 5 | Verify Password section visible | Change password form | Element: Password section |
| 6 | Verify My Reviews section visible | User's reviews listed | Element: My Reviews |
| 7 | Verify Notifications section visible | Toggle for email notifications | Element: Notifications |
| 8 | Verify Danger Zone section visible | Delete account button | Element: Danger Zone |

### 4.2 Change Email

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login and navigate to `/settings` | Settings displayed | - |
| 2 | Click "Change Email" or edit icon | Email change form displayed | Button: Change Email |
| 3 | Enter same email as current | "Must be different from current" error | Input: New email |
| 4 | Enter invalid email format | "Invalid email" error | Input: New email |
| 5 | Enter email already in use | "Email already registered" error | POST `/api/user/change-email` |
| 6 | Enter valid new email: `newemail@test.com` | "Verification email sent" message | Input: New email |
| 7 | Check email (or DB for token) | Verification email received | Email/DB |
| 8 | Navigate to `/verify-email/invalid-token` | "Invalid token" error | URL with bad token |
| 9 | Navigate to `/verify-email/{valid-token}` | Email updated successfully | URL with valid token |
| 10 | Verify new email shown in settings | Email changed to `newemail@test.com` | Element: Current email |
| 11 | Verify old email no longer works for login | "Invalid credentials" error | Login with old email |

### 4.3 Change Password

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login and navigate to `/settings` | Settings displayed | - |
| 2 | Locate Password section | Change password form visible | Element: Password section |
| 3 | Enter wrong current password | "Current password incorrect" error | Input: Current password |
| 4 | Enter correct current password: `TestUser123!` | Validation passes | Input: Current password |
| 5 | Enter new password < 8 chars | "Minimum 8 characters" error | Input: New password |
| 6 | Enter valid new password, mismatched confirm | "Passwords don't match" error | Input: Confirm password |
| 7 | Enter valid new password: `NewPassword456!` and matching confirm | Password changed successfully | POST `/api/user/change-password` |
| 8 | Logout and login with old password | "Invalid credentials" error | Login flow |
| 9 | Login with new password: `NewPassword456!` | Login successful | Login flow |

### 4.4 View My Reviews

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login and navigate to `/settings` | Settings displayed | - |
| 2 | Locate "My Reviews" section | Reviews list displayed | Element: My Reviews |
| 3 | Verify user's submitted reviews shown | Reviews with building name, rating, date | GET `/api/user/reviews` |
| 4 | Verify review status shown (pending/approved/denied) | Status badge on each review | Element: Status badge |
| 5 | Click on a review's building name | Navigate to building detail page | Link: Building name |
| 6 | If >10 reviews, verify pagination | Pagination controls visible | Element: Pagination |
| 7 | User with no reviews | "No reviews yet" message | Empty state |

### 4.5 Toggle Email Notifications

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login and navigate to `/settings` | Settings displayed | - |
| 2 | Locate Notifications section | Toggle visible | Element: Notifications |
| 3 | Verify current state (default: enabled) | Toggle is ON | Checkbox/Toggle |
| 4 | Click toggle to disable | Toggle turns OFF | PATCH `/api/user/preferences` |
| 5 | Verify success message or state change | "Preferences updated" | Element: Success |
| 6 | Refresh page | Toggle remains OFF | State persistence |
| 7 | Click toggle to enable | Toggle turns ON | PATCH `/api/user/preferences` |

### 4.6 Delete Account

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login as a test user (not main test user) | Login successful | Use disposable account |
| 2 | Navigate to `/settings` | Settings displayed | URL: `/settings` |
| 3 | Locate "Danger Zone" section | Delete account button visible | Element: Danger Zone |
| 4 | Click "Delete Account" | Confirmation modal appears | Button: Delete Account |
| 5 | Click "Cancel" on modal | Modal closes, no action | Button: Cancel |
| 6 | Click "Delete Account" again | Modal appears | Button: Delete Account |
| 7 | Click "Confirm" or "Yes, Delete" | Account deletion initiated | DELETE `/api/user/account` |
| 8 | Verify redirect to homepage | Homepage displayed | URL: `/` |
| 9 | Verify logged out | Login buttons visible | Element: Auth buttons |
| 10 | Try to login with deleted account | "Invalid credentials" error | Login flow |
| 11 | Verify user's reviews deleted | Reviews no longer exist | DB check |

---

## 5. ADMIN FLOWS

### 5.1 Admin Access Control

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/admin` (not logged in) | Redirect to `/login` | URL: `/admin` |
| 2 | Login as regular user: `testuser@example.com` | Login successful | - |
| 3 | Navigate to `/admin` | Redirect to `/forbidden` or 403 error | URL: `/admin` |
| 4 | Logout | Logged out | - |
| 5 | Login as admin: `admin@ratemyapartment.com` | Login successful | Admin credentials |
| 6 | Navigate to `/admin` | Admin dashboard displayed | URL: `/admin` |
| 7 | Verify all admin nav links accessible | Users, Reviews, Buildings, Duplicates | Admin nav |

### 5.2 Admin Dashboard

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Login as admin, navigate to `/admin` | Dashboard displayed | URL: `/admin` |
| 2 | Verify total users count displayed | Numeric count shown | GET `/api/admin/stats` |
| 3 | Verify total buildings count displayed | Numeric count shown | Element: Stats |
| 4 | Verify total reviews count displayed | Numeric count shown | Element: Stats |
| 5 | Verify pending buildings count displayed | Numeric count shown | Element: Stats |
| 6 | Verify pending reviews count displayed | Numeric count shown | Element: Stats |
| 7 | Click on pending buildings stat | Navigate to `/admin/buildings` with pending filter | Link: Pending buildings |
| 8 | Click on pending reviews stat | Navigate to `/admin/reviews` | Link: Pending reviews |

### 5.3 Manage Users

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/admin/users` | Users list displayed | URL: `/admin/users` |
| 2 | Verify user table shows: email, role, status, created date | All columns visible | Element: User table |
| 3 | Enter search term in search box | Users filtered by email | Input: Search |
| 4 | Search for non-existent user | "No users found" | Search results |
| 5 | Clear search | All users displayed | Clear search |
| 6 | Find an active user | User with status="active" | Element: User row |
| 7 | Click "Suspend" button on active user | Confirmation prompt | Button: Suspend |
| 8 | Confirm suspension | Status changes to "suspended" | PATCH `/api/admin/users/:id/status` |
| 9 | Verify status badge updated | "Suspended" badge shown | Element: Status badge |
| 10 | Click "Unsuspend" button on suspended user | Status changes to "active" | Button: Unsuspend |
| 11 | Verify status badge updated | "Active" badge shown | Element: Status badge |
| 12 | Verify pagination (if >20 users) | Pagination controls | Element: Pagination |

### 5.4 Moderate Reviews

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/admin/reviews` | Pending reviews list displayed | URL: `/admin/reviews` |
| 2 | Verify only pending reviews shown | All reviews have status="pending" | GET `/api/admin/reviews/pending` |
| 3 | Verify each review shows: building, user (if not anon), rating, floor, text | All fields visible | Element: Review card |
| 4 | Verify category ratings shown if provided | Noise, Cleanliness, etc. | Element: Category ratings |
| 5 | Click "Approve" on a review | Review approved | PATCH `/api/admin/reviews/:id/status` |
| 6 | Verify review removed from pending list | Review no longer displayed | List update |
| 7 | Verify review visible on building page | Review appears publicly | Building detail page |
| 8 | Click "Deny" on a review | Review denied | PATCH `/api/admin/reviews/:id/status` |
| 9 | Verify review removed from pending list | Review no longer displayed | List update |
| 10 | Verify denied review NOT visible publicly | Review hidden | Building detail page |
| 11 | Select multiple reviews (checkboxes) | Checkboxes checked | Checkbox: Select |
| 12 | Click "Bulk Approve" | All selected reviews approved | POST `/api/admin/reviews/bulk-action` |
| 13 | Select multiple reviews, click "Bulk Deny" | All selected reviews denied | POST `/api/admin/reviews/bulk-action` |
| 14 | Verify pagination (if >20 pending reviews) | Pagination controls | Element: Pagination |

### 5.5 Moderate Buildings

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/admin/buildings` | Buildings list displayed | URL: `/admin/buildings` |
| 2 | Click "Pending" tab | Only pending buildings shown | Tab: Pending |
| 3 | Verify each building shows: name, address, ZIP, neighborhood, landlord | All fields visible | Element: Building row |
| 4 | Click "Approve" on a pending building | Building approved | PATCH `/api/admin/buildings/:id/status` |
| 5 | Verify building moved to "Approved" tab | Building in approved list | Tab: Approved |
| 6 | Verify building searchable publicly | Building appears in public search | Public search |
| 7 | Click "Deny" on a pending building | Building denied | PATCH `/api/admin/buildings/:id/status` |
| 8 | Verify building moved to "Denied" tab | Building in denied list | Tab: Denied |
| 9 | Verify denied building NOT searchable | Building not in public search | Public search |
| 10 | Click "Edit" on a building | Edit form displayed | Button: Edit |
| 11 | Modify building name | Field updated | Input: Name |
| 12 | Save changes | Building updated | PUT `/api/admin/buildings/:id` |
| 13 | Verify changes persisted | Updated name displayed | Element: Building name |
| 14 | Use search box to filter buildings | Results filtered | Input: Search |
| 15 | Select multiple buildings, bulk approve | All selected approved | POST `/api/admin/buildings/bulk-action` |
| 16 | Select multiple buildings, bulk deny | All selected denied | POST `/api/admin/buildings/bulk-action` |

### 5.6 Duplicate Management

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/admin/duplicates` | Duplicates queue displayed | URL: `/admin/duplicates` |
| 2 | Verify pending duplicates shown | Pairs with status="pending" | GET `/api/admin/duplicates` |
| 3 | Verify each pair shows: Building 1, Building 2, similarity score | All info visible | Element: Duplicate row |
| 4 | Click on a duplicate pair | Navigate to compare view | Link: Compare |
| 5 | On `/admin/duplicates/:id`, verify side-by-side comparison | Both buildings displayed | URL: `/admin/duplicates/:id` |
| 6 | Verify building details shown: name, address, reviews | All details visible | Element: Comparison |
| 7 | Click "Dismiss" on duplicates queue | Pair dismissed | PATCH `/api/admin/duplicates/:id/dismiss` |
| 8 | Verify status changed to "dismissed" | Pair removed from queue | List update |
| 9 | Verify both buildings remain | Neither building deleted | DB check |
| 10 | On compare view, select master building | Master selected | Radio: Master |
| 11 | Click "Merge" | Merge initiated | POST `/api/admin/duplicates/:id/merge` |
| 12 | Verify secondary building merged into master | Reviews moved to master | DB check |
| 13 | Verify duplicate status = "merged" | Status updated | DB check |
| 14 | Verify merged building reviews accessible | Reviews on master building | Building detail |

---

## 6. NAVIGATION & UI FLOWS

### 6.1 Header Navigation

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | On homepage, verify logo visible | Logo displayed | Element: Logo |
| 2 | Click logo | Navigate to homepage | Logo link |
| 3 | Verify search bar in header | Search input visible | Element: Header search |
| 4 | Enter search in header, submit | Navigate to search results | Input: Header search |
| 5 | When logged out, verify Login/Signup buttons | Auth buttons visible | Element: Auth buttons |
| 6 | When logged in, verify user menu | User avatar/dropdown visible | Element: User menu |
| 7 | Click user menu | Dropdown opens | User menu click |
| 8 | Verify "Settings" link in dropdown | Settings option visible | Link: Settings |
| 9 | Verify "Sign Out" link in dropdown | Sign out option visible | Link: Sign Out |
| 10 | Admin user: Verify "Admin" link in dropdown | Admin option visible | Link: Admin |

### 6.2 Mobile Responsiveness

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Set viewport to mobile (375px width) | Mobile layout displayed | Viewport: 375px |
| 2 | Verify hamburger menu visible | Menu icon displayed | Element: Hamburger |
| 3 | Click hamburger menu | Mobile nav opens | Button: Hamburger |
| 4 | Verify all nav links accessible | Links in mobile menu | Element: Mobile nav |
| 5 | Verify search accessible | Search in mobile view | Element: Mobile search |
| 6 | Navigate through main pages | All pages render properly | All routes |
| 7 | Verify forms usable on mobile | Forms responsive | All forms |
| 8 | Set viewport to tablet (768px) | Tablet layout displayed | Viewport: 768px |
| 9 | Verify layout adapts | Responsive design | Layout check |

### 6.3 Error Pages

| Step | Action | Expected Result | Selector/Endpoint |
|------|--------|-----------------|-------------------|
| 1 | Navigate to `/nonexistent-page` | 404 page displayed | URL: Random |
| 2 | Verify 404 page has navigation home | "Go Home" or similar link | Element: Home link |
| 3 | Navigate to `/forbidden` | 403 page displayed | URL: `/forbidden` |
| 4 | Regular user to `/admin` | Forbidden/403 shown | URL: `/admin` |
| 5 | Verify error pages have consistent styling | Matches app design | Visual check |

---

## 7. API ENDPOINT TESTING

### 7.1 Authentication Endpoints

| Endpoint | Method | Test Case | Expected Status | Body/Params |
|----------|--------|-----------|-----------------|-------------|
| `/api/auth/signup` | POST | Valid signup | 200/201 | `{email, password, confirmPassword, acceptTerms}` |
| `/api/auth/signup` | POST | Duplicate email | 400 | `{email: existing}` |
| `/api/auth/signup` | POST | Invalid email | 400 | `{email: "invalid"}` |
| `/api/auth/signup` | POST | Short password | 400 | `{password: "short"}` |
| `/api/auth/login` | POST | Valid login | 200 | `{email, password}` |
| `/api/auth/login` | POST | Wrong password | 401 | `{email, password: "wrong"}` |
| `/api/auth/login` | POST | Suspended user | 403 | Suspended credentials |
| `/api/auth/me` | GET | Authenticated | 200 | Session cookie |
| `/api/auth/me` | GET | Not authenticated | 401 | No session |
| `/api/auth/logout` | POST | Authenticated | 200 | Session cookie |
| `/api/auth/forgot-password` | POST | Valid email | 200 | `{email}` |
| `/api/auth/forgot-password` | POST | Invalid email | 200 | Security: same response |
| `/api/auth/reset-password/:token` | GET | Valid token | 200 | Token in URL |
| `/api/auth/reset-password/:token` | GET | Invalid token | 400 | Bad token |
| `/api/auth/reset-password` | POST | Valid reset | 200 | `{token, password, confirmPassword}` |

### 7.2 User Endpoints

| Endpoint | Method | Test Case | Expected Status | Body/Params |
|----------|--------|-----------|-----------------|-------------|
| `/api/user/change-email` | POST | Valid new email | 200 | `{newEmail}` |
| `/api/user/change-email` | POST | Same email | 400 | `{newEmail: current}` |
| `/api/user/change-email` | POST | Email in use | 400 | `{newEmail: taken}` |
| `/api/user/change-email` | POST | Not authenticated | 401 | No session |
| `/api/user/verify-email/:token` | GET | Valid token | 200 | Token in URL |
| `/api/user/verify-email/:token` | GET | Invalid token | 400 | Bad token |
| `/api/user/change-password` | POST | Valid change | 200 | `{currentPassword, newPassword, confirmPassword}` |
| `/api/user/change-password` | POST | Wrong current | 400 | `{currentPassword: "wrong"}` |
| `/api/user/reviews` | GET | User has reviews | 200 | Session cookie |
| `/api/user/reviews` | GET | User no reviews | 200 | Empty array |
| `/api/user/preferences` | PATCH | Toggle notifications | 200 | `{emailNotifications: false}` |
| `/api/user/account` | DELETE | Delete account | 200 | Session cookie |

### 7.3 Buildings Endpoints

| Endpoint | Method | Test Case | Expected Status | Body/Params |
|----------|--------|-----------|-----------------|-------------|
| `/api/buildings` | GET | Search with query | 200 | `?q=broadway` |
| `/api/buildings` | GET | Empty query | 200 | All approved |
| `/api/buildings` | GET | Pagination | 200 | `?page=2&limit=10` |
| `/api/buildings/:id` | GET | Valid ID | 200 | UUID |
| `/api/buildings/:id` | GET | Invalid ID | 404 | Bad UUID |
| `/api/buildings/:id/reviews` | GET | Building with reviews | 200 | UUID |
| `/api/buildings/:id/reviews` | GET | Sort newest | 200 | `?sort=newest` |
| `/api/buildings/:id/reviews` | GET | Sort highest | 200 | `?sort=highest` |
| `/api/buildings` | POST | Create building (auth) | 201 | Building data |
| `/api/buildings` | POST | Create building (no auth) | 401 | Building data |
| `/api/buildings` | POST | Invalid ZIP | 400 | `{zip: "00000"}` |
| `/api/buildings/:id/reviews` | POST | Create review (auth) | 201 | Review data |
| `/api/buildings/:id/reviews` | POST | Create review (no auth) | 401 | Review data |
| `/api/buildings/:id/reviews` | POST | Missing rating | 400 | `{overallRating: null}` |
| `/api/buildings/validate-address` | POST | New address | 200 | Address data |
| `/api/buildings/validate-address` | POST | Duplicate address | 200 | `{isDuplicate: true}` |

### 7.4 Admin Endpoints

| Endpoint | Method | Test Case | Expected Status | Body/Params |
|----------|--------|-----------|-----------------|-------------|
| `/api/admin/stats` | GET | Admin user | 200 | Admin session |
| `/api/admin/stats` | GET | Regular user | 403 | User session |
| `/api/admin/stats` | GET | No auth | 401 | No session |
| `/api/admin/users` | GET | List users | 200 | Admin session |
| `/api/admin/users` | GET | Search users | 200 | `?search=test` |
| `/api/admin/users/:id/status` | PATCH | Suspend user | 200 | `{status: "suspended"}` |
| `/api/admin/users/:id/status` | PATCH | Unsuspend user | 200 | `{status: "active"}` |
| `/api/admin/reviews/pending` | GET | List pending | 200 | Admin session |
| `/api/admin/reviews/:id/status` | PATCH | Approve review | 200 | `{status: "approved"}` |
| `/api/admin/reviews/:id/status` | PATCH | Deny review | 200 | `{status: "denied"}` |
| `/api/admin/reviews/bulk-action` | POST | Bulk approve | 200 | `{ids: [], action: "approve"}` |
| `/api/admin/buildings` | GET | List all | 200 | Admin session |
| `/api/admin/buildings` | GET | Filter pending | 200 | `?status=pending` |
| `/api/admin/buildings/:id` | GET | Get building | 200 | UUID |
| `/api/admin/buildings/:id` | PUT | Update building | 200 | Building data |
| `/api/admin/buildings/:id/status` | PATCH | Approve | 200 | `{status: "approved"}` |
| `/api/admin/buildings/bulk-action` | POST | Bulk approve | 200 | `{ids: [], action: "approve"}` |
| `/api/admin/duplicates` | GET | List duplicates | 200 | Admin session |
| `/api/admin/duplicates/:id` | GET | Get duplicate pair | 200 | UUID |
| `/api/admin/duplicates/:id/dismiss` | PATCH | Dismiss | 200 | Admin session |
| `/api/admin/duplicates/:id/merge` | POST | Merge | 200 | `{masterId: uuid}` |

---

## 8. EDGE CASES & NEGATIVE TESTING

### 8.1 Authentication Edge Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Session expiry | Login, wait 24+ hours, access protected route | Redirect to login |
| Concurrent sessions | Login from two browsers, logout from one | Other session unaffected |
| SQL injection in login | Email: `'; DROP TABLE users;--` | Sanitized, no injection |
| XSS in signup | Email: `<script>alert('xss')</script>@test.com` | Sanitized, no XSS |
| Password with special chars | Password: `P@$$w0rd!#$%^&*()` | Accepted and works |
| Unicode in fields | Name: `测试用户` | Handled properly |
| Very long inputs | 10000 char email | Validation error |

### 8.2 Building/Review Edge Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Review with max ratings | All ratings = 5 | Saved correctly |
| Review with min ratings | All ratings = 1 | Saved correctly |
| Review with no category ratings | Only overall rating | NULL values saved |
| Floor number boundary | Floor = 1, Floor = 200 | Both accepted |
| Empty review text after spaces | Text: "   " (spaces only) | Validation error |
| Building name special chars | Name: `O'Brien's Place & Sons` | Handled properly |
| Address with unit/apt | Address: `100 Main St, Apt 5B` | Handled properly |
| Duplicate exact match | Same name + address | Duplicate detected |
| Search with special chars | Query: `(Broadway) & 5th` | Handled properly |

### 8.3 Admin Edge Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Admin suspends self | Admin tries to suspend own account | Prevented or warning |
| Bulk action empty selection | Click bulk approve with nothing selected | Error or disabled |
| Merge with no reviews | Merge two buildings, neither has reviews | Merge succeeds |
| Merge with one-sided reviews | One building has reviews, other doesn't | Reviews preserved on master |
| Approve already approved | Approve an approved building | No error, idempotent |
| Deny already denied | Deny a denied review | No error, idempotent |
| Edit building with active reviews | Change building name | Reviews remain linked |

---

## 9. PERFORMANCE TESTING SCENARIOS

| Scenario | Method | Threshold |
|----------|--------|-----------|
| Homepage load | Measure time to interactive | < 3 seconds |
| Search with 1000+ buildings | Search query response | < 2 seconds |
| Building page with 100+ reviews | Page load time | < 3 seconds |
| Admin users list with 1000+ users | Page load time | < 3 seconds |
| Concurrent login attempts (10) | Parallel requests | All succeed |
| Large review text (5000 chars) | Submit and retrieve | < 2 seconds |

---

## 10. SECURITY TESTING CHECKLIST

| Test | Method | Expected |
|------|--------|----------|
| Password not in API responses | Check all user-related responses | password_hash never exposed |
| Session cookie HttpOnly | Inspect cookies | HttpOnly flag set |
| Session cookie Secure (prod) | Inspect cookies in HTTPS | Secure flag set |
| CSRF protection | Submit form without CSRF token | Request rejected |
| Rate limiting on login | 100 rapid login attempts | Rate limited after threshold |
| Rate limiting on signup | 100 rapid signup attempts | Rate limited after threshold |
| Admin routes protected | Access admin API without admin role | 403 Forbidden |
| Direct object reference | Access other user's settings | 403 or own data only |
| SQL injection | Malicious input in all fields | Parameterized queries prevent |
| XSS prevention | Script tags in user input | Escaped in output |

---

## Test Data Setup Script

```sql
-- Create test users (run after hashing passwords with bcrypt)
-- Password hashes should be generated programmatically

-- Regular test user
INSERT INTO users (id, email, password_hash, role, status, email_notifications, created_at)
VALUES (
  gen_random_uuid(),
  'testuser@example.com',
  '$2b$12$[HASH_FOR_TestUser123!]',
  'user',
  'active',
  true,
  NOW()
);

-- Admin user
INSERT INTO users (id, email, password_hash, role, status, email_notifications, created_at)
VALUES (
  gen_random_uuid(),
  'admin@ratemyapartment.com',
  '$2b$12$[HASH_FOR_AdminPass123!]',
  'admin',
  'active',
  true,
  NOW()
);

-- Suspended user for negative testing
INSERT INTO users (id, email, password_hash, role, status, email_notifications, created_at)
VALUES (
  gen_random_uuid(),
  'suspended@example.com',
  '$2b$12$[HASH_FOR_Suspended123!]',
  'user',
  'suspended',
  true,
  NOW()
);

-- Create pending test buildings
INSERT INTO buildings (id, name, address, city, zip, neighborhood, status, created_at)
VALUES
  (gen_random_uuid(), 'Pending Test Building 1', '100 Pending St', 'New York', '10001', 'Chelsea', 'pending', NOW()),
  (gen_random_uuid(), 'Pending Test Building 2', '200 Pending Ave', 'New York', '10002', 'SoHo', 'pending', NOW()),
  (gen_random_uuid(), 'Pending Test Building 3', '300 Pending Blvd', 'New York', '10003', 'Tribeca', 'pending', NOW());

-- Create pending test reviews (link to existing approved buildings)
-- INSERT INTO reviews (id, building_id, user_id, overall_rating, floor_number, review_text, is_anonymous, status, created_at)
-- VALUES (...);
```

---

## Automated Test Runner Notes

### Environment Variables Required
```
TEST_BASE_URL=http://localhost:5000
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=TestUser123!
TEST_ADMIN_EMAIL=admin@ratemyapartment.com
TEST_ADMIN_PASSWORD=AdminPass123!
TEST_SUSPENDED_EMAIL=suspended@example.com
TEST_SUSPENDED_PASSWORD=Suspended123!
```

### Test Execution Order
1. Setup: Create test users and data
2. Authentication tests (signup, login, logout, reset)
3. Public flows (search, building view)
4. Authenticated user flows (add building, write review, settings)
5. Admin flows (dashboard, moderation, duplicates)
6. Edge cases and negative tests
7. Security tests
8. Cleanup: Remove test data

### Parallel Execution Guidelines
- Authentication tests: Sequential (session-dependent)
- Search tests: Parallel safe
- Admin tests: Sequential (shared state)
- API tests: Parallel safe (use unique data per test)

---

*Generated for RateMyApartment QA Testing*
*Last Updated: January 2026*
