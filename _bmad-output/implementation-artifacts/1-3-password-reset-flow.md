# Story 1.3: Password Reset Flow

Status: ready-for-dev

## Story

As a **user who forgot their password**,
I want **to reset my password via email**,
so that **I can regain access to my account**.

## Acceptance Criteria

1. **Given** I click "Forgot Password?" on the login page **When** the modal appears and I enter my registered email **Then** a password reset email is sent via Postmark with a secure token (24-hour expiry)

2. **Given** I click the reset link in the email **When** the link is valid and not expired **Then** I see a form to enter a new password with confirmation

3. **Given** I submit a new password **When** the password meets strength requirements **Then** my password is updated, I am logged in, and redirected to homepage

4. **Given** I click an expired or invalid reset link **When** the page loads **Then** I see "This reset link has expired. Please request a new one."

## Tasks / Subtasks

- [ ] Task 1: Create password reset tokens table (AC: 1)
  - [ ] Add password_reset_tokens table to schema
  - [ ] Fields: id, user_id, token (unique), expires_at, used_at, created_at
  - [ ] Run migration

- [ ] Task 2: Create request reset endpoint (AC: 1)
  - [ ] Create POST /api/auth/forgot-password route
  - [ ] Generate secure random token (crypto.randomBytes)
  - [ ] Calculate expiry (24 hours from now)
  - [ ] Store token in database
  - [ ] Send reset email via Postmark
  - [ ] Always return success (prevent email enumeration)

- [ ] Task 3: Create password reset email template (AC: 1)
  - [ ] Create reset email in server/services/email.ts
  - [ ] Include reset link with token
  - [ ] Include expiry information
  - [ ] Professional formatting

- [ ] Task 4: Create validate token endpoint (AC: 2, 4)
  - [ ] Create GET /api/auth/reset-password/:token route
  - [ ] Check token exists and not used
  - [ ] Check token not expired
  - [ ] Return valid/invalid status

- [ ] Task 5: Create reset password endpoint (AC: 3)
  - [ ] Create POST /api/auth/reset-password route
  - [ ] Validate token again
  - [ ] Validate new password strength
  - [ ] Hash new password with bcrypt
  - [ ] Update user password
  - [ ] Mark token as used
  - [ ] Create session (log user in)
  - [ ] Return success

- [ ] Task 6: Create forgot password modal (AC: 1)
  - [ ] Create client/src/components/auth/forgot-password-modal.tsx
  - [ ] Email input form
  - [ ] Submit button with loading state
  - [ ] Success message after submission
  - [ ] Use Dialog component from shadcn/ui

- [ ] Task 7: Create reset password page (AC: 2, 3, 4)
  - [ ] Create client/src/pages/reset-password.tsx
  - [ ] Extract token from URL params
  - [ ] Validate token on page load
  - [ ] Show error if invalid/expired
  - [ ] Show password reset form if valid
  - [ ] Password + confirm password inputs
  - [ ] Password strength indicator
  - [ ] Submit and redirect on success

- [ ] Task 8: Add route and integrate modal
  - [ ] Add /reset-password/:token route to App.tsx
  - [ ] Add modal trigger to login form

## Dev Notes

### Architecture Patterns
- Secure token generation with crypto.randomBytes
- Time-limited tokens (24 hours)
- Token single-use enforcement
- No email enumeration (always return success on request)

### Components to Create/Modify
- `shared/schema.ts` - Add password_reset_tokens table
- `server/auth/routes.ts` - Add reset endpoints
- `server/services/email.ts` - Add reset email template
- `client/src/components/auth/forgot-password-modal.tsx` - New
- `client/src/pages/reset-password.tsx` - New
- `client/src/components/auth/login-form.tsx` - Add modal trigger

### Project Structure Notes

- Tokens table follows existing schema patterns
- Email service extends existing Postmark integration
- Use shadcn/ui Dialog for modal

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR35]
- [Source: _bmad-output/planning-artifacts/architecture.md#External Integrations]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
