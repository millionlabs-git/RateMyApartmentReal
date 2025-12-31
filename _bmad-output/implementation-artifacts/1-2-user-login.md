# Story 1.2: User Login

Status: ready-for-dev

## Story

As a **registered user**,
I want **to login with my email and password**,
so that **I can access my account and submit reviews**.

## Acceptance Criteria

1. **Given** I am on the login page **When** I enter valid email and password **Then** I am authenticated and redirected to the homepage **And** a secure httpOnly session cookie is set

2. **Given** I enter incorrect credentials **When** I submit the form **Then** I see an error "Invalid email or password" **And** I remain on the login page

3. **Given** I am logged in **When** I visit any page **Then** the navbar shows my account menu instead of Login/Signup

## Tasks / Subtasks

- [ ] Task 1: Configure Passport.js with Local Strategy (AC: 1, 2)
  - [ ] Create server/auth/passport.ts
  - [ ] Configure LocalStrategy with email/password
  - [ ] Implement user serialization/deserialization
  - [ ] Verify password with bcrypt.compare

- [ ] Task 2: Configure session store (AC: 1)
  - [ ] Create server/auth/session.ts
  - [ ] Install and configure connect-pg-simple
  - [ ] Create sessions table in PostgreSQL
  - [ ] Configure express-session with PostgreSQL store
  - [ ] Set httpOnly, secure, sameSite cookie options

- [ ] Task 3: Create login API endpoint (AC: 1, 2)
  - [ ] Create POST /api/auth/login route
  - [ ] Use passport.authenticate('local')
  - [ ] Return user data on success
  - [ ] Return 401 with error message on failure

- [ ] Task 4: Create logout API endpoint
  - [ ] Create POST /api/auth/logout route
  - [ ] Destroy session
  - [ ] Clear cookie

- [ ] Task 5: Create current user endpoint (AC: 3)
  - [ ] Create GET /api/auth/me route
  - [ ] Return current user if authenticated
  - [ ] Return 401 if not authenticated

- [ ] Task 6: Create login page and form (AC: 1, 2)
  - [ ] Create client/src/pages/login.tsx
  - [ ] Create client/src/components/auth/login-form.tsx
  - [ ] Add email input
  - [ ] Add password input
  - [ ] Add "Forgot Password?" link
  - [ ] Add "Create Account" link
  - [ ] Implement form submission with TanStack Query
  - [ ] Handle errors with toast notifications

- [ ] Task 7: Create auth hook and update navbar (AC: 3)
  - [ ] Create client/src/hooks/use-auth.ts
  - [ ] Query /api/auth/me on app load
  - [ ] Export user, isLoading, isAuthenticated
  - [ ] Update Header component to show account menu when logged in

- [ ] Task 8: Add routes to App.tsx
  - [ ] Add /login route
  - [ ] Redirect authenticated users away from login

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



### Debug Log References

### Completion Notes List

### File List
