---
title: "NYC Apartment Review Platform - Product Requirements Document"
version: "1.0"
date: "2025-12-30"
author: "Million Labs"
status: "Draft"
source: "NYC_Apartment_Review_Platform_PRD.docx"
---

# Product Requirements Document
## NYC Apartment Review Platform

*"Honest, anonymous reviews from real NYC renters."*

---

## 1. Executive Summary

The NYC Apartment Review Platform is a web application designed to empower New York City renters with honest, anonymous insights about residential buildings across the five boroughs. The platform addresses a critical gap in the rental market where prospective tenants often lack reliable information about building conditions, landlord responsiveness, and neighborhood-specific concerns before signing a lease.

**Key Objectives:**
- Provide a trusted community platform for sharing rental experiences
- Enable granular building insights including floor-level data and category-specific ratings
- Maintain data quality through moderation and duplicate detection systems
- Protect reviewer privacy through anonymous posting capabilities

---

## 2. Product Overview

### 2.1 Problem Statement

NYC renters face significant information asymmetry when searching for apartments. While listing sites provide photos and pricing, they rarely offer insight into actual living conditions, landlord behavior, building management quality, or issues like pest infestations, noise levels, and maintenance responsiveness. Existing review platforms often lack NYC-specific focus, floor-level granularity, or robust anonymity protections that encourage honest feedback.

### 2.2 Solution

A dedicated NYC apartment review platform featuring:
- Anonymous reviews with multi-dimensional rating categories (noise, cleanliness, maintenance, safety, pests)
- Floor-level insights via interactive charts
- Photo uploads
- Community-driven building database with intelligent duplicate detection
- Admin moderation workflows

### 2.3 Target Users

| User Type | Description |
|-----------|-------------|
| **Apartment Seekers** | Prospective renters researching buildings before signing a lease |
| **Current Renters** | NYC residents sharing their rental experiences through reviews |
| **Administrators** | Platform operators managing content moderation and data quality |

---

## 3. User Personas

### 3.1 Apartment Hunter (Primary)
- **Name:** Sarah, 28
- **Role:** Marketing Manager relocating to NYC
- **Goals:** Find a safe, well-maintained apartment in Brooklyn with responsive management
- **Pain Points:** Limited time for apartment visits; needs reliable information before committing; worried about hidden issues

### 3.2 Current Renter (Contributor)
- **Name:** Marcus, 34
- **Role:** Long-term NYC renter with experiences in multiple buildings
- **Goals:** Share honest feedback to help others; warn about problematic landlords
- **Pain Points:** Fears retaliation from landlord; wants anonymity protection

### 3.3 Platform Administrator
- **Name:** Admin Team
- **Goals:** Maintain platform integrity; prevent spam and fake reviews; manage duplicate buildings
- **Pain Points:** High volume of submissions requiring efficient moderation tools

---

## 4. Functional Requirements

### FR1: Home Page
Full-screen NYC background image or video (hero section)

### FR2: Hero Search Bar
Centered hero search bar with building name/address autocomplete

### FR3: Mission Statement
Mission statement display: "Honest, anonymous reviews from real NYC renters."

### FR4: Navigation Bar
Fixed navigation bar at top with links to Search, Login/Signup, Add Building

### FR5: How It Works Section
"How It Works" section with 3-step visual guide (Search → Read Reviews → Contribute)

### FR6: Responsive Design
Responsive design for mobile and desktop

### FR7: Building Search
Search input field with real-time filtering by building name

### FR8: Building Cards
Building cards displaying: building name, address, overall rating (stars), review count

### FR9: Building Navigation
Click-through from search results to Building Detail page

### FR10: Search Pagination
Pagination or infinite scroll for large result sets

### FR11: Empty State
Empty state messaging when no results found

### FR12: Building Detail - Info Panel
Left Panel displaying: Building name, street address, landlord name (if available)

### FR13: Building Detail - Rating Panel
Right Panel displaying: Overall star rating, total review count, prominent "Write a Review" CTA button

### FR14: Category Ratings Display
Visual rating bars/indicators for: Noise, Cleanliness, Maintenance, Safety, Pests

### FR15: Aggregate Scores
Aggregate scores calculated from all approved reviews

### FR16: Floor Insights
Interactive charts showing floor-level rating distributions with ability to filter/highlight specific floors

### FR17: Review List
Review cards displaying: star rating, floor number, review text, uploaded photos with sorting options (newest, highest rated, lowest rated)

### FR18: Photo Gallery
Photo lightbox/gallery for viewing uploaded images

### FR19: Review - Overall Rating
Overall rating (1-5 star selector) - Required

### FR20: Review - Floor Number
Floor number selector (dropdown or input) - Required

### FR21: Review - Category Ratings
Category ratings (Noise, Cleanliness, Maintenance, Safety, Pests) - 1-5 scale each

### FR22: Review - Text Field
Text review field (minimum 50 characters recommended) - Required

### FR23: Review - Photo Upload
Photo upload (multiple images, max 5, max 5MB each) - Optional

### FR24: Review - Anonymous Toggle
Anonymous posting toggle (default: ON)

### FR25: Review - Form Validation
Form validation with inline error messaging

### FR26: Review - Submission Flow
Submit triggers review creation, success modal: "Thank you! Your review is pending approval.", redirect to Building Detail page

### FR27: Add Building - Required Fields
Building name, Street address, City (pre-filled NYC), ZIP code - Required

### FR28: Add Building - Optional Fields
Landlord/Management company name, Neighborhood, Building type - Optional

### FR29: Add Building - ZIP Validation
ZIP code validated against NYC ZIP codes (10001-10499 Manhattan, 10451-10475 Bronx, 11201-11256 Brooklyn, 11004-11697 Queens, 10301-10314 Staten Island)

### FR30: Duplicate Detection
Real-time address validation via Google Geocoding API, system checks for potential duplicates based on normalized address

### FR31: Duplicate Warning
Warning displayed if similar building exists with link to existing entry

### FR32: Building Pending Status
Submit creates pending building entry for admin approval, success modal with option: "Write first review?"

### FR33: Login Form
Email input field, Password input field, Login button, "Forgot Password?" link, "Create Account" link

### FR34: Signup Form
Email input, Password input with strength indicator, Confirm password, Terms of Service checkbox, Create Account button

### FR35: Password Reset Flow
Modal popup for Forgot Password, email input for reset request, password reset email via Postmark API, secure reset link with time-limited token

### FR36: User Settings - Email
Change email address with verification email to new address

### FR37: User Settings - Password
Change password (requires current password confirmation)

### FR38: User Settings - Reviews
View list of user's submitted reviews

### FR39: User Settings - Delete Account
Delete account option with confirmation modal

### FR40: User Settings - Notifications
Notification preferences (email opt-in/out)

### FR41: Admin - User List
Paginated list of all user accounts with search by email address

### FR42: Admin - User Details
View user details (email, signup date, review count, status), edit user information

### FR43: Admin - User Actions
Send password reset email, suspend/activate user accounts, delete user accounts

### FR44: Admin - Dashboard Metrics
Total users, new signups (daily/weekly/monthly), total buildings, pending building approvals, total reviews, pending review approvals, engagement metrics

### FR45: Admin - Review Moderation
List of pending reviews with full content preview, approve (publishes to building page) or deny (removes from queue, optional notify user)

### FR46: Admin - Building Moderation
List of pending building submissions, approve (adds to searchable directory), deny (removes from queue), edit building details before approval

### FR47: Admin - Bulk Actions
Bulk actions for efficient moderation

### FR48: Admin - Duplicate Detection
System flags potential duplicates based on address normalization, similarity scoring using geocoded coordinates

### FR49: Admin - Duplicate Queue
Queue of potential duplicate pairs for admin review

### FR50: Admin - Merge Interface
Side-by-side comparison, display all fields, select primary record (master), merge action transfers reviews from duplicate to master

### FR51: Admin - Merge Confirmation
Confirmation modal before executing merge, audit log of all merge operations

---

## 5. Non-Functional Requirements

### NFR1: Performance - Page Load
Page load time < 3 seconds

### NFR2: Performance - Search
Search results < 500ms

### NFR3: Scalability
Architecture should support 100,000+ buildings and 1M+ reviews

### NFR4: Availability
99.5% uptime target

### NFR5: Accessibility
WCAG 2.1 AA compliance

### NFR6: Mobile Support
Full functionality on iOS and Android browsers

### NFR7: Browser Support
Chrome, Firefox, Safari, Edge (latest 2 versions)

### NFR8: Security - Password
Password hashing using bcrypt or Argon2

### NFR9: Security - Sessions
Secure session management with httpOnly cookies

### NFR10: Security - HTTPS
HTTPS enforcement across all endpoints

### NFR11: Security - Rate Limiting
Rate limiting on authentication and submission endpoints

### NFR12: Security - Input Validation
Input sanitization to prevent XSS and SQL injection

### NFR13: Security - API Keys
API key storage in environment variables (never in codebase)

---

## 6. Technical Requirements

### 6.1 Third-Party Integrations

| Service | Purpose | Usage |
|---------|---------|-------|
| **Postmark API** | Transactional email delivery | Password resets, welcome emails, notifications |
| **Google Geocoding API** | Address validation & normalization | Duplicate detection, address standardization |

### 6.2 Data Architecture

**Core Data Entities:**
- **Users:** id, email, password_hash, role (user/admin), created_at, status
- **Buildings:** id, name, address, city, zip, landlord, neighborhood, building_type, geocode_lat, geocode_lng, status (pending/approved), created_at
- **Reviews:** id, building_id, user_id, overall_rating, floor_number, noise_rating, cleanliness_rating, maintenance_rating, safety_rating, pest_rating, review_text, is_anonymous, status (pending/approved/denied), created_at
- **Review Photos:** id, review_id, image_url, created_at
- **Duplicate Queue:** id, building_id_1, building_id_2, similarity_score, status (pending/merged/dismissed), created_at

---

## 7. Success Metrics

| Metric | Target (6 months) | Measurement |
|--------|-------------------|-------------|
| Registered Users | 5,000+ | Database count |
| Buildings Listed | 2,000+ | Approved buildings count |
| Reviews Submitted | 10,000+ | Approved reviews count |
| Review Approval Rate | > 85% | Approved / Total submitted |
| Avg. Reviews per Building | > 3 | Reviews / Buildings |

---

## 8. Out of Scope (v1.0)

The following features are not included in the initial release:
- Social login (Google, Facebook, Apple)
- Native mobile applications (iOS/Android)
- Integration with rental listing platforms (StreetEasy, Zillow)
- Landlord response/reply functionality
- Map-based building search
- Verified tenant badges
- Multi-language support

---

## 9. Appendix

### 9.1 Rating Categories Definitions

| Category | Definition |
|----------|------------|
| **Noise** | Sound levels from neighbors, street traffic, building systems |
| **Cleanliness** | Common area maintenance, hallways, lobby, laundry room |
| **Maintenance** | Response time and quality of repairs, landlord/super responsiveness |
| **Safety** | Building security, lighting, entry systems, neighborhood safety |
| **Pests** | Presence of roaches, mice, bedbugs, or other pests |

### 9.2 Email Templates (Postmark)

- **Welcome Email:** Sent upon successful signup
- **Password Reset:** Contains secure reset link (24-hour expiry)
- **Email Change Verification:** Confirm new email address
- **Review Approved:** Notification when review is published (optional)
- **Review Denied:** Notification with reason (optional)
