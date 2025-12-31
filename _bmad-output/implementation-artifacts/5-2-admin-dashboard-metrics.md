# Story 5.2: Admin Dashboard & Metrics

Status: ready-for-dev

## Story

As an **administrator**,
I want **to see platform metrics at a glance**,
so that **I can monitor platform health and growth**.

## Acceptance Criteria

1. **Given** I am on the admin dashboard (/admin) **When** the page loads **Then** I see metric cards showing:
   - Total users (with new signups this week)
   - Total buildings (with pending count)
   - Total reviews (with pending count)
   - Engagement: reviews per day average

2. **Given** I view the dashboard **When** I see pending counts > 0 **Then** the pending counts are highlighted as badges

## Tasks / Subtasks

- [ ] Task 1: Create metrics API endpoint (AC: 1, 2)
  - [ ] Create GET /api/admin/metrics route
  - [ ] Require admin role
  - [ ] Query total users count
  - [ ] Query new users this week
  - [ ] Query total buildings count
  - [ ] Query pending buildings count
  - [ ] Query total reviews count
  - [ ] Query pending reviews count
  - [ ] Calculate reviews per day average

- [ ] Task 2: Create metric card component (AC: 1, 2)
  - [ ] Create client/src/components/admin/metric-card.tsx
  - [ ] Large number display (serif font)
  - [ ] Label below number
  - [ ] Secondary metric (e.g., "+12 this week")
  - [ ] Badge for pending counts

- [ ] Task 3: Create admin dashboard page (AC: 1)
  - [ ] Create client/src/pages/admin/dashboard.tsx
  - [ ] Use admin layout
  - [ ] Grid of metric cards (4 columns desktop)
  - [ ] Responsive (2 columns tablet, 1 mobile)

- [ ] Task 4: Create dashboard hook
  - [ ] Create useAdminMetrics hook
  - [ ] Fetch from /api/admin/metrics
  - [ ] Handle loading and error states
  - [ ] Auto-refresh option (optional)

- [ ] Task 5: Style pending badges (AC: 2)
  - [ ] Badge component for pending counts
  - [ ] Yellow/amber background
  - [ ] Positioned next to label
  - [ ] Only show if count > 0

- [ ] Task 6: Add quick links section
  - [ ] Links to moderation queues
  - [ ] Link to user management
  - [ ] Highlight if pending items exist

## Dev Notes

### Architecture Patterns
- Aggregate queries for metrics
- Badge component for notifications
- TanStack Query for data fetching
- Responsive grid layout

### Metrics Calculations
```sql
-- Total users
SELECT COUNT(*) FROM users;

-- New users this week
SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days';

-- Pending buildings
SELECT COUNT(*) FROM buildings WHERE status = 'pending';

-- Reviews per day (last 30 days)
SELECT COUNT(*) / 30.0 FROM reviews WHERE created_at > NOW() - INTERVAL '30 days';
```

### Components to Create/Modify
- `server/routes.ts` - Add GET /api/admin/metrics
- `client/src/pages/admin/dashboard.tsx` - New
- `client/src/components/admin/metric-card.tsx` - New

### Design Guidelines
- Metrics cards: White background, p-6, large serif number
- Grid: grid-cols-4 desktop
- Badges: Small pills with pending counts

### Project Structure Notes

- Admin pages in `client/src/pages/admin/`
- Use existing Card component
- Badge component from shadcn/ui

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR44]
- [Source: design_guidelines.md#Admin Dashboard]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
