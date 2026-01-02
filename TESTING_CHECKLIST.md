# RateMyApartment - Frontend Testing Checklist

## Test Credentials

**Admin User:**
- Email: `admin@ratemyapartment.com`
- Password: `admin123`

**Regular User:** Create via signup flow

---

## 1. Authentication & Account Management

### 1.1 User Registration
- [ ] Navigate to `/signup`
- [ ] Verify password strength indicator shows as you type
- [ ] Try submitting with mismatched passwords → error shown
- [ ] Try submitting with password < 8 chars → error shown
- [ ] Try submitting without accepting terms → error shown
- [ ] Successfully create account with valid data
- [ ] Verify redirect to home page after signup

### 1.2 User Login
- [ ] Navigate to `/login`
- [ ] Try logging in with wrong password → error shown
- [ ] Try logging in with non-existent email → error shown
- [ ] Successfully login with valid credentials
- [ ] Verify redirect to home page after login
- [ ] Verify user menu/state updates after login

### 1.3 Admin Login
- [ ] Login with admin credentials (admin@ratemyapartment.com / admin123)
- [ ] Verify admin can access `/admin` dashboard
- [ ] Verify non-admin users redirected to `/forbidden` when accessing `/admin`

### 1.4 Password Reset (if email configured)
- [ ] Navigate to forgot password link
- [ ] Request password reset
- [ ] Verify email received (if SMTP configured)

### 1.5 User Settings
- [ ] Navigate to `/settings` (must be logged in)
- [ ] Test changing password
- [ ] Test email notification toggle
- [ ] Test account deletion (creates confirmation)

---

## 2. Building Search & Discovery

### 2.1 Home Page
- [ ] Verify hero section displays
- [ ] Verify search bar is functional
- [ ] Enter search term and submit
- [ ] Verify redirect to `/search?q=<term>`

### 2.2 Search Results
- [ ] Navigate to `/search`
- [ ] Verify buildings list displays
- [ ] Test search filtering
- [ ] Verify building cards show name, address, rating
- [ ] Click on building card → navigates to detail page

### 2.3 Add Building
- [ ] Navigate to `/add-building`
- [ ] Fill in building details
- [ ] Submit form
- [ ] Verify building created (pending status for moderation)

---

## 3. Building Details & Reviews

### 3.1 Building Detail Page
- [ ] Navigate to `/building/<id>`
- [ ] Verify building info displays (name, address, landlord, etc.)
- [ ] Verify rating summary shows
- [ ] Verify category ratings display (noise, cleanliness, etc.)
- [ ] Verify floor insights chart displays (if reviews exist)
- [ ] Verify reviews list displays

### 3.2 Review Submission
- [ ] Click "Write a Review" (must be logged in)
- [ ] Verify redirect to `/building/<id>/review`
- [ ] Fill in overall rating (1-5 stars)
- [ ] Fill in floor number
- [ ] Fill in category ratings (optional)
- [ ] Write review text
- [ ] Toggle anonymous option
- [ ] Submit review
- [ ] Verify success confirmation displays

---

## 4. Admin Dashboard (Login as Admin)

### 4.1 Dashboard Overview
- [ ] Navigate to `/admin`
- [ ] Verify stats cards display (Users, Buildings, Reviews, Pending)
- [ ] Verify "Items Requiring Attention" section shows pending counts

### 4.2 User Management
- [ ] Navigate to `/admin/users`
- [ ] Verify users list displays
- [ ] Test search by email
- [ ] Test suspend user action
- [ ] Test activate user action
- [ ] Verify pagination works

### 4.3 Review Moderation
- [ ] Navigate to `/admin/reviews`
- [ ] Verify pending reviews list displays
- [ ] Test approve single review
- [ ] Test deny single review
- [ ] Test bulk select (checkboxes)
- [ ] Test "Approve All" bulk action
- [ ] Test "Deny All" bulk action
- [ ] Verify "All caught up" message when no pending reviews

### 4.4 Building Moderation
- [ ] Navigate to `/admin/buildings`
- [ ] Verify pending buildings list displays
- [ ] Test approve single building
- [ ] Test deny single building
- [ ] Test bulk select (checkboxes)
- [ ] Test "Approve All" bulk action
- [ ] Test "Deny All" bulk action
- [ ] Verify "All caught up" message when no pending buildings

---

## 5. Duplicate Detection & Merge (Admin)

### 5.1 Duplicates Queue
- [ ] Navigate to `/admin/duplicates`
- [ ] Verify duplicates list displays (or "No duplicates" message)
- [ ] Verify sidebar badge shows count of pending duplicates
- [ ] Verify each pair shows both building names, similarity score
- [ ] Click "Review & Compare" → navigates to comparison page

### 5.2 Side-by-Side Comparison
- [ ] Navigate to `/admin/duplicates/<id>`
- [ ] Verify both buildings displayed side-by-side
- [ ] Verify differing fields highlighted in yellow/amber
- [ ] Verify similarity score badge displays
- [ ] Verify review counts and average ratings shown

### 5.3 Dismiss Duplicate
- [ ] Click "Not Duplicates (Dismiss)" button
- [ ] Verify redirect back to duplicates list
- [ ] Verify pair removed from queue

### 5.4 Merge Buildings
- [ ] Click "Merge Buildings" button
- [ ] Verify modal opens
- [ ] Verify both buildings shown as options
- [ ] Verify building with more reviews is recommended
- [ ] Select master building
- [ ] Verify warning message shows review transfer count
- [ ] Click "Confirm Merge"
- [ ] Verify success toast
- [ ] Verify redirect to duplicates list
- [ ] Verify merged pair removed from queue

---

## 6. UI/UX Checks

### 6.1 Responsive Design
- [ ] Test on mobile viewport (< 768px)
- [ ] Test on tablet viewport (768px - 1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify admin sidebar collapses appropriately

### 6.2 Dark Mode
- [ ] Toggle dark mode (if theme toggle exists)
- [ ] Verify all pages render correctly in dark mode
- [ ] Verify text is readable in both modes

### 6.3 Loading States
- [ ] Verify skeleton loaders appear while data loads
- [ ] Verify buttons show loading state during mutations

### 6.4 Error States
- [ ] Test with network disconnected
- [ ] Verify error messages display appropriately

---

## 7. Edge Cases

### 7.1 Authorization
- [ ] Try accessing `/admin` without login → redirect to `/auth` or `/login`
- [ ] Try accessing `/admin` as regular user → redirect to `/forbidden`
- [ ] Try accessing `/settings` without login → redirect to login
- [ ] Try accessing `/building/<id>/review` without login → redirect to login

### 7.2 Not Found
- [ ] Navigate to invalid URL → 404 page displays
- [ ] Navigate to `/building/invalid-id` → appropriate error

### 7.3 Empty States
- [ ] View building with no reviews → appropriate message
- [ ] Search with no results → appropriate message
- [ ] Admin queues with nothing pending → "All caught up" message

---

## Quick Smoke Test (5 minutes)

1. [ ] Open app → home page loads
2. [ ] Login as admin (admin@ratemyapartment.com / admin123)
3. [ ] Navigate to `/admin` → dashboard loads with stats
4. [ ] Click through each admin nav item → pages load
5. [ ] Logout → redirected appropriately
6. [ ] Search for a building → results display
7. [ ] Click a building → detail page loads
