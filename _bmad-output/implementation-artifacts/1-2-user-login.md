# Story 1.2: User Login

Status: review

## Story

As a **registered user**,
I want **to login with my email and password**,
so that **I can access my account and submit reviews**.

## Acceptance Criteria

1. **Given** I am on the login page **When** I enter valid email and password **Then** I am authenticated and redirected to the homepage **And** a secure httpOnly session cookie is set

2. **Given** I enter incorrect credentials **When** I submit the form **Then** I see an error "Invalid email or password" **And** I remain on the login page

3. **Given** I am logged in **When** I visit any page **Then** the navbar shows my account menu instead of Login/Signup

## Tasks / Subtasks

- [x] Task 1: Configure Passport.js with Local Strategy (AC: 1, 2)
  - [x] Create server/auth/passport.ts
  - [x] Configure LocalStrategy with email/password
  - [x] Implement user serialization/deserialization
  - [x] Verify password with bcrypt.compare

- [x] Task 2: Configure session store (AC: 1)
  - [x] Create server/auth/session.ts
  - [x] Install and configure connect-pg-simple
  - [x] Create sessions table in PostgreSQL
  - [x] Configure express-session with PostgreSQL store
  - [x] Set httpOnly, secure, sameSite cookie options

- [x] Task 3: Create login API endpoint (AC: 1, 2)
  - [x] Create POST /api/auth/login route
  - [x] Use passport.authenticate('local')
  - [x] Return user data on success
  - [x] Return 401 with error message on failure

- [x] Task 4: Create logout API endpoint
  - [x] Create POST /api/auth/logout route
  - [x] Destroy session
  - [x] Clear cookie

- [x] Task 5: Create current user endpoint (AC: 3)
  - [x] Create GET /api/auth/me route
  - [x] Return current user if authenticated
  - [x] Return 401 if not authenticated

- [x] Task 6: Create login page and form (AC: 1, 2)
  - [x] Create client/src/pages/login.tsx
  - [x] Create client/src/components/auth/login-form.tsx
  - [x] Add email input
  - [x] Add password input
  - [x] Add "Forgot Password?" link
  - [x] Add "Create Account" link
  - [x] Implement form submission with TanStack Query
  - [x] Handle errors with toast notifications

- [x] Task 7: Create auth hook and update navbar (AC: 3)
  - [x] Create client/src/hooks/use-auth.ts
  - [x] Query /api/auth/me on app load
  - [x] Export user, isLoading, isAuthenticated
  - [x] Update Header component to show account menu when logged in

- [x] Task 8: Add routes to App.tsx
  - [x] Add /login route
  - [x] Redirect authenticated users away from login

## Dev Notes

### Architecture Patterns
- Passport.js with LocalStrategy
- express-session with connect-pg-simple
- httpOnly cookies (NFR9)
- TanStack Query for auth state management

### Components to Create/Modify
- `server/auth/passport.ts` - Passport configuration
- `server/auth/session.ts` - Session store setup
- `server/auth/routes.ts` - Add login/logout/me routes
- `client/src/pages/login.tsx` - New page
- `client/src/components/auth/login-form.tsx` - New component
- `client/src/hooks/use-auth.ts` - New hook
- `client/src/components/layout/header.tsx` - Modify for auth state

### Project Structure Notes

- Auth components in `client/src/components/auth/`
- Server auth in `server/auth/`
- Follow existing TanStack Query patterns

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- [Source: _bmad-output/planning-artifacts/prd.md#FR33]
- [Source: design_guidelines.md#Login/Signup]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

None

### Completion Notes List

- Added POST /api/auth/login endpoint using passport.authenticate('local')
- Created login page and form with TanStack Query mutation
- Reused passport/session config from Story 1-1
- Added /login route with guest-only access
- All 21 tests passing

### File List

**New Files:**
- client/src/pages/login.tsx
- client/src/components/auth/login-form.tsx

**Modified Files:**
- server/auth/routes.ts (added login endpoint, getSafeUser helper)
- client/src/App.tsx (added /login route)
