# Story 1.1: User Registration

Status: review

## Story

As a **prospective user**,
I want **to create an account with my email and password**,
so that **I can save my reviews and access personalized features**.

## Acceptance Criteria

1. **Given** I am on the signup page **When** I enter a valid email, password (with strength indicator), confirm password, and accept Terms of Service **Then** my account is created with role "user" and status "active" **And** I am automatically logged in and redirected to the homepage **And** a welcome email is sent via Postmark

2. **Given** I enter a password **When** the password is less than 8 characters or lacks complexity **Then** the strength indicator shows "weak" and I see inline validation errors

3. **Given** I try to register with an existing email **When** I submit the form **Then** I see an error "An account with this email already exists"

## Tasks / Subtasks

- [x] Task 1: Extend users table schema (AC: 1)
  - [x] Add email column (unique, not null)
  - [x] Add password_hash column (not null)
  - [x] Add role column (enum: user, admin, default: user)
  - [x] Add status column (enum: active, suspended, default: active)
  - [x] Add created_at column (timestamp, default: now)
  - [x] Run database migration

- [x] Task 2: Create signup API endpoint (AC: 1, 2, 3)
  - [x] Create POST /api/auth/signup route
  - [x] Implement Zod validation schema for signup
  - [x] Hash password with bcrypt (12 rounds)
  - [x] Check for existing email before creating
  - [x] Create user record in database
  - [x] Create session after successful signup
  - [x] Return user data (without password_hash)

- [x] Task 3: Create signup page and form (AC: 1, 2, 3)
  - [x] Create client/src/pages/signup.tsx
  - [x] Create client/src/components/auth/signup-form.tsx
  - [x] Add email input with validation
  - [x] Add password input with strength indicator component
  - [x] Add confirm password input with match validation
  - [x] Add Terms of Service checkbox
  - [x] Implement form submission with TanStack Query mutation
  - [x] Add loading state and error handling

- [x] Task 4: Implement password strength indicator (AC: 2)
  - [x] Create client/src/components/auth/password-strength.tsx
  - [x] Check minimum 8 characters
  - [x] Check for uppercase, lowercase, number, special char
  - [x] Display visual strength meter (weak/medium/strong)

- [x] Task 5: Configure Postmark welcome email (AC: 1)
  - [x] Create server/services/email.ts
  - [x] Configure Postmark client with API key
  - [x] Create welcome email template
  - [x] Send welcome email on successful signup

- [x] Task 6: Add route to App.tsx
  - [x] Add /signup route
  - [x] Redirect authenticated users away from signup

## Dev Notes

### Architecture Patterns
- Use bcrypt for password hashing (per NFR8)
- Session-based authentication with PostgreSQL store (connect-pg-simple)
- httpOnly cookies for session ID (per NFR9)
- Zod schemas for validation (established pattern)

### Components to Create/Modify
- `client/src/pages/signup.tsx` - New page
- `client/src/components/auth/signup-form.tsx` - New component
- `client/src/components/auth/password-strength.tsx` - New component
- `server/auth/routes.ts` - New auth routes
- `server/services/email.ts` - New email service
- `shared/schema.ts` - Extend users table

### Testing Standards
- Unit tests for password strength logic
- API tests for signup endpoint (valid, invalid email, duplicate)
- Form validation tests

### Project Structure Notes

- Components go in `client/src/components/auth/`
- Pages go in `client/src/pages/`
- Server services go in `server/services/`
- File naming: kebab-case.tsx

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- [Source: _bmad-output/planning-artifacts/prd.md#FR34]
- [Source: design_guidelines.md#Forms]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None

### Completion Notes List

- Implemented full user registration flow following red-green-refactor TDD cycle
- Extended users table schema with email, password_hash, role (enum), status (enum), created_at
- Created POST /api/auth/signup endpoint with Zod validation, bcrypt hashing (12 rounds), session creation
- Built signup page with react-hook-form, TanStack Query mutation, loading/error states
- Created password strength indicator with visual meter (weak/medium/strong) and requirement checklist
- Configured Postmark email service with HTML/text welcome email templates
- Added /signup route with guest-only access (redirects authenticated users)
- All 21 tests passing (schema, auth validation, password strength)
- TypeScript compiles without errors

### File List

**New Files:**
- client/src/pages/signup.tsx
- client/src/components/auth/signup-form.tsx
- client/src/components/auth/password-strength.tsx
- client/src/components/auth/password-strength.test.ts
- client/src/hooks/use-auth.ts
- server/auth/routes.ts
- server/auth/passport.ts
- server/services/email.ts
- server/types.d.ts
- server/__tests__/schema.test.ts
- server/__tests__/auth.test.ts
- vitest.config.ts

**Modified Files:**
- shared/schema.ts (extended users table, added enums, signupSchema)
- server/storage.ts (updated interface for email-based lookup)
- server/routes.ts (added session/passport middleware, auth routes)
- client/src/App.tsx (added /signup route, GuestRoute component)
- package.json (added test scripts, bcrypt, vitest, postmark)
