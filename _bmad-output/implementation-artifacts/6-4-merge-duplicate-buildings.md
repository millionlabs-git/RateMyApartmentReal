# Story 6.4: Merge Duplicate Buildings

Status: ready-for-dev

## Story

As an **administrator**,
I want **to merge two duplicate buildings into one**,
so that **all reviews are consolidated under a single building**.

## Acceptance Criteria

1. **Given** I am viewing a duplicate pair comparison **When** I click "Merge Buildings" **Then** I am prompted to select the primary (master) building to keep

2. **Given** I select Building A as the master **When** I confirm the merge **Then**:
   - All reviews from Building B are transferred to Building A
   - Building B is archived or deleted
   - The duplicate queue entry is marked "merged"
   - An audit log entry is created with: merge date, admin user, buildings involved

3. **Given** I click "Merge" **When** the confirmation modal appears **Then** I see a warning: "This will transfer X reviews from [Building B] to [Building A]. This action cannot be undone."

## Tasks / Subtasks

- [ ] Task 1: Create audit_log table (AC: 2)
  - [ ] Add audit_log table to shared/schema.ts
  - [ ] Fields: id, action_type, user_id, details (JSON), created_at
  - [ ] Run migration

- [ ] Task 2: Create merge endpoint (AC: 2)
  - [ ] Create POST /api/admin/duplicates/:id/merge route
  - [ ] Require admin role
  - [ ] Accept: { master_id: number }
  - [ ] Validate both buildings exist
  - [ ] Perform merge in transaction

- [ ] Task 3: Implement merge logic (AC: 2)
  - [ ] Start database transaction
  - [ ] Update reviews to point to master building
  - [ ] Delete or archive secondary building
  - [ ] Update duplicate queue status to "merged"
  - [ ] Create audit log entry
  - [ ] Commit transaction

- [ ] Task 4: Create merge modal (AC: 1, 3)
  - [ ] Create client/src/components/admin/merge-buildings-modal.tsx
  - [ ] Radio buttons to select master building
  - [ ] Show review counts for each
  - [ ] Warning message about irreversibility
  - [ ] Cancel and Merge buttons

- [ ] Task 5: Create master selection UI (AC: 1)
  - [ ] Two options: Building A or Building B
  - [ ] Show building names clearly
  - [ ] Highlight selected option
  - [ ] Default to building with more reviews

- [ ] Task 6: Create confirmation warning (AC: 3)
  - [ ] Dynamic message with review count
  - [ ] "This will transfer X reviews..."
  - [ ] Red/warning styling
  - [ ] Require explicit confirmation

- [ ] Task 7: Implement merge button (AC: 1)
  - [ ] "Merge Buildings" button in comparison view
  - [ ] Opens merge modal
  - [ ] Loading state during merge
  - [ ] Success message and redirect

- [ ] Task 8: Handle merge success
  - [ ] Show success toast
  - [ ] Redirect to duplicates list
  - [ ] Refresh list to remove merged pair

- [ ] Task 9: Create audit log entry (AC: 2)
  - [ ] Log: action_type = "building_merge"
  - [ ] Log: user_id = current admin
  - [ ] Log: details = { master_id, secondary_id, reviews_transferred }
  - [ ] Include timestamp

## Dev Notes

### Architecture Patterns
- Transactional merge operation
- Master/secondary building selection
- Audit logging for compliance
- Confirmation for destructive action

### Merge Transaction
```sql
BEGIN;
-- Transfer reviews to master
UPDATE reviews SET building_id = :master_id WHERE building_id = :secondary_id;

-- Delete or archive secondary building
DELETE FROM buildings WHERE id = :secondary_id;
-- Or: UPDATE buildings SET status = 'archived' WHERE id = :secondary_id;

-- Update duplicate queue
UPDATE duplicate_queue SET status = 'merged' WHERE id = :queue_id;

-- Create audit log
INSERT INTO audit_log (action_type, user_id, details, created_at)
VALUES ('building_merge', :admin_id, :details, NOW());

COMMIT;
```

### Components to Create/Modify
- `shared/schema.ts` - Add audit_log table
- `server/routes.ts` - Add merge endpoint
- `client/src/components/admin/merge-buildings-modal.tsx` - New
- `client/src/pages/admin/duplicate-compare.tsx` - Add merge button

### Database Schema
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Project Structure Notes

- Merge is destructive - requires confirmation
- Transaction ensures data integrity
- Audit log for accountability
- Handle edge cases (building with 0 reviews)

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR50, FR51]
- [Source: design_guidelines.md#Modals]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
