# Story 5.1: Admin Role & Protected Routes

Status: ready-for-dev

## Story

As an **administrator**,
I want **secure access to admin functionality**,
so that **only authorized users can moderate content**.

## Acceptance Criteria

1. **Given** I am logged in with role "admin" **When** I navigate to /admin/* **Then** I can access admin pages

2. **Given** I am logged in with role "user" (not admin) **When** I try to access /admin/* **Then** I am redirected to a 403 Forbidden page

3. **Given** I am not logged in **When** I try to access /admin/* **Then** I am redirected to the login page

4. **Given** I am an admin **When** I view the navbar **Then** I see an "Admin" link in my account menu

## Tasks / Subtasks

- [ ] Task 1: Create admin middleware (AC: 1, 2, 3)
  - [ ] Create server/middleware/auth.ts
  - [ ] Create requireAuth middleware
  - [ ] Create requireAdmin middleware
  - [ ] Check session for user
  - [ ] Check user role for admin

- [ ] Task 2: Create admin API routes group (AC: 1)
  - [ ] Create /api/admin/* route group
  - [ ] Apply requireAdmin middleware
  - [ ] Return 403 for non-admin users
  - [ ] Return 401 for unauthenticated users

- [ ] Task 3: Create auth guard component (AC: 1, 2, 3)
  - [ ] Create client/src/components/auth/auth-guard.tsx
  - [ ] Check authentication status
  - [ ] Check admin role (if required)
  - [ ] Redirect to login if not authenticated
  - [ ] Show 403 page if not authorized

- [ ] Task 4: Create 403 Forbidden page (AC: 2)
  - [ ] Create client/src/pages/forbidden.tsx
  - [ ] "Access Denied" message
  - [ ] "You don't have permission to view this page"
  - [ ] Link to homepage

- [ ] Task 5: Create admin layout (AC: 1)
  - [ ] Create client/src/components/admin/admin-layout.tsx
  - [ ] Sidebar navigation
  - [ ] Main content area
  - [ ] Admin header

- [ ] Task 6: Create admin routes (AC: 1)
  - [ ] Add /admin route to App.tsx
  - [ ] Add /admin/dashboard route
  - [ ] Add /admin/users route
  - [ ] Add /admin/moderation route
  - [ ] Wrap with AuthGuard

- [ ] Task 7: Add admin link to navbar (AC: 4)
  - [ ] Check if user has admin role
  - [ ] Add "Admin" link in user dropdown
  - [ ] Link to /admin/dashboard

- [ ] Task 8: Create admin seed user (development)
  - [ ] Add migration or seed for admin user
  - [ ] Email: admin@ratemyapartment.com
  - [ ] Role: admin

## Dev Notes

### Architecture Patterns
- Middleware-based authorization
- Role-based access control (RBAC)
- Client-side route protection
- Server-side API protection

### Middleware Structure
```typescript
// requireAuth - checks if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// requireAdmin - checks if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};
```

### Components to Create/Modify
- `server/middleware/auth.ts` - New
- `server/routes.ts` - Apply middleware
- `client/src/components/auth/auth-guard.tsx` - New
- `client/src/components/admin/admin-layout.tsx` - New
- `client/src/pages/forbidden.tsx` - New
- `client/src/pages/admin/` - Directory for admin pages
- `client/src/components/layout/header.tsx` - Add admin link

### Design Guidelines
- Admin sidebar: Fixed left, 240px wide
- Clear visual distinction for admin area
- Consistent with main site styling

### Project Structure Notes

- Admin components in `client/src/components/admin/`
- Admin pages in `client/src/pages/admin/`
- Middleware in `server/middleware/`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Authorization]
- [Source: design_guidelines.md#Admin Dashboard]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
