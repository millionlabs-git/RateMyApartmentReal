# Story 1.1: User Registration

Status: ready-for-dev

## Story

As a **prospective user**,
I want **to create an account with my email and password**,
so that **I can save my reviews and access personalized features**.

## Acceptance Criteria

1. **Given** I am on the signup page **When** I enter a valid email, password (with strength indicator), confirm password, and accept Terms of Service **Then** my account is created with role "user" and status "active" **And** I am automatically logged in and redirected to the homepage **And** a welcome email is sent via Postmark

2. **Given** I enter a password **When** the password is less than 8 characters or lacks complexity **Then** the strength indicator shows "weak" and I see inline validation errors

3. **Given** I try to register with an existing email **When** I submit the form **Then** I see an error "An account with this email already exists"

## Tasks / Subtasks

- [ ] Task 1: Extend users table schema (AC: 1)
  - [ ] Add email column (unique, not null)
  - [ ] Add password_hash column (not null)
  - [ ] Add role column (enum: user, admin, default: user)
  - [ ] Add status column (enum: active, suspended, default: active)
  - [ ] Add created_at column (timestamp, default: now)
  - [ ] Run database migration

- [ ] Task 2: Create signup API endpoint (AC: 1, 2, 3)
  - [ ] Create POST /api/auth/signup route
  - [ ] Implement Zod validation schema for signup
  - [ ] Hash password with bcrypt (12 rounds)
  - [ ] Check for existing email before creating
  - [ ] Create user record in database
  - [ ] Create session after successful signup
  - [ ] Return user data (without password_hash)

- [ ] Task 3: Create signup page and form (AC: 1, 2, 3)
  - [ ] Create client/src/pages/signup.tsx
  - [ ] Create client/src/components/auth/signup-form.tsx
  - [ ] Add email input with validation
  - [ ] Add password input with strength indicator component
  - [ ] Add confirm password input with match validation
  - [ ] Add Terms of Service checkbox
  - [ ] Implement form submission with TanStack Query mutation
  - [ ] Add loading state and error handling

- [ ] Task 4: Implement password strength indicator (AC: 2)
  - [ ] Create client/src/components/auth/password-strength.tsx
  - [ ] Check minimum 8 characters
  - [ ] Check for uppercase, lowercase, number, special char
  - [ ] Display visual strength meter (weak/medium/strong)

- [ ] Task 5: Configure Postmark welcome email (AC: 1)
  - [ ] Create server/services/email.ts
  - [ ] Configure Postmark client with API key
  - [ ] Create welcome email template
  - [ ] Send welcome email on successful signup

- [ ] Task 6: Add route to App.tsx
  - [ ] Add /signup route
  - [ ] Redirect authenticated users away from signup

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



### Debug Log References

### Completion Notes List

### File List
