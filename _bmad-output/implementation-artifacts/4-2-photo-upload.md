# Story 4.2: Photo Upload

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to upload photos with my review**,
so that **I can provide visual evidence of building conditions**.

## Acceptance Criteria

1. **Given** I am on the review form **When** I view the photo upload section **Then** I see a drag-drop zone with "Upload photos (optional, max 5)"

2. **Given** I select or drop image files **When** the files are valid (JPEG, PNG, WebP, max 5MB each) **Then** I see thumbnail previews of the uploaded images **And** I can remove individual photos before submission

3. **Given** I try to upload more than 5 photos **When** I add the 6th photo **Then** I see an error "Maximum 5 photos allowed"

4. **Given** I try to upload an invalid file (wrong type or > 5MB) **When** the upload is rejected **Then** I see an error explaining the file requirements

## Tasks / Subtasks

- [ ] Task 1: Create Replit Object Storage service (AC: 2)
  - [ ] Create server/services/storage.ts
  - [ ] Initialize Replit Object Storage client
  - [ ] Create uploadFile(buffer, filename, contentType) function
  - [ ] Create deleteFile(key) function
  - [ ] Return public URL after upload

- [ ] Task 2: Create photo upload endpoint (AC: 2, 3, 4)
  - [ ] Create POST /api/upload/image route
  - [ ] Use multer for file handling
  - [ ] Validate file type (JPEG, PNG, WebP)
  - [ ] Validate file size (max 5MB)
  - [ ] Upload to Replit Object Storage
  - [ ] Path: reviews/{tempId}/{uuid}.{ext}
  - [ ] Return { url, key }

- [ ] Task 3: Create drag-drop upload zone (AC: 1)
  - [ ] Create client/src/components/reviews/photo-upload.tsx
  - [ ] Drag-drop zone with dashed border
  - [ ] Click to browse files
  - [ ] "Upload photos (optional, max 5)" label
  - [ ] Accepted file types indicator

- [ ] Task 4: Create photo preview grid (AC: 2)
  - [ ] Display uploaded photos as thumbnails
  - [ ] Grid layout (5 columns max)
  - [ ] Remove button (X) on each thumbnail
  - [ ] Loading state during upload

- [ ] Task 5: Implement file validation (AC: 3, 4)
  - [ ] Check file count (max 5)
  - [ ] Check file type (JPEG, PNG, WebP)
  - [ ] Check file size (max 5MB)
  - [ ] Display specific error messages

- [ ] Task 6: Handle remove photo (AC: 2)
  - [ ] Remove button on each thumbnail
  - [ ] Remove from preview list
  - [ ] Optionally delete from storage (or cleanup later)

- [ ] Task 7: Integrate into review form (AC: 1)
  - [ ] Add PhotoUpload component to review-form.tsx
  - [ ] Pass uploaded photo URLs to form state
  - [ ] Position after text area

## Dev Notes

### Architecture Patterns
- Replit Object Storage for file storage
- multer for multipart form handling
- Client-side validation + server-side validation
- Temporary upload path, move on review save

### File Storage Path
- Pattern: `reviews/{reviewId}/{uuid}.{ext}`
- Initial upload: `reviews/temp/{uuid}.{ext}`
- Move to final path on review creation

### Components to Create/Modify
- `server/services/storage.ts` - New
- `server/routes.ts` - Add upload endpoint
- `client/src/components/reviews/photo-upload.tsx` - New
- `client/src/components/reviews/review-form.tsx` - Integrate

### File Limits
- Max 5 files per review
- Max 5MB per file
- Allowed types: JPEG, PNG, WebP

### Project Structure Notes

- Storage service in `server/services/`
- Use environment variable for storage config
- Handle cleanup of orphaned uploads

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR23]
- [Source: _bmad-output/planning-artifacts/architecture.md#External Integrations]
- [Source: design_guidelines.md#Write Review / Add Building Forms]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
