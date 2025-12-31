# Story 2.4: Address Geocoding & Duplicate Detection

Status: ready-for-dev

## Story

As a **user adding a building**,
I want **the system to validate my address and warn me of duplicates**,
so that **I don't create duplicate building entries**.

## Acceptance Criteria

1. **Given** I enter an address in the Add Building form **When** I blur the address field or submit **Then** the address is validated via Google Geocoding API **And** geocode_lat and geocode_lng are stored

2. **Given** a similar building already exists (based on normalized address or proximity) **When** I submit the form **Then** I see a warning: "A similar building may already exist: [Building Name]. View existing building?" **And** I can choose to view the existing building or continue adding

3. **Given** the Google Geocoding API returns no results **When** I submit the form **Then** I see an error "We couldn't validate this address. Please check and try again."

## Tasks / Subtasks

- [ ] Task 1: Create geocoding service (AC: 1, 3)
  - [ ] Create server/services/geocoding.ts
  - [ ] Configure Google Maps Geocoding API client
  - [ ] Create geocodeAddress(address, city, zip) function
  - [ ] Return { lat, lng, formattedAddress } or null
  - [ ] Handle API errors gracefully

- [ ] Task 2: Create duplicate detection service (AC: 2)
  - [ ] Create server/services/duplicate-detection.ts
  - [ ] findPotentialDuplicates(lat, lng, name) function
  - [ ] Search within 50 meters using Haversine formula
  - [ ] Also check normalized address similarity
  - [ ] Return array of potential duplicates

- [ ] Task 3: Update add building endpoint (AC: 1, 2, 3)
  - [ ] Geocode address before saving
  - [ ] If geocoding fails, return error
  - [ ] Check for duplicates before saving
  - [ ] If duplicates found, return warning with duplicate info
  - [ ] Store geocode_lat and geocode_lng on success

- [ ] Task 4: Create geocoding validation on blur (AC: 1)
  - [ ] Add onBlur handler to address field
  - [ ] Call validation endpoint
  - [ ] Show loading indicator during validation
  - [ ] Show success checkmark if valid
  - [ ] Show error if invalid

- [ ] Task 5: Create duplicate warning UI (AC: 2)
  - [ ] Create client/src/components/buildings/duplicate-warning.tsx
  - [ ] Display warning banner/dialog
  - [ ] Show existing building name and link
  - [ ] "View Existing" button
  - [ ] "Add Anyway" button to proceed

- [ ] Task 6: Create address validation endpoint (AC: 1)
  - [ ] Create POST /api/buildings/validate-address route
  - [ ] Accept address, city, zip
  - [ ] Return geocode result and potential duplicates
  - [ ] Used for real-time validation

- [ ] Task 7: Add environment variable check
  - [ ] Check for GOOGLE_MAPS_API_KEY
  - [ ] Log warning if missing
  - [ ] Allow building creation without geocoding in dev

## Dev Notes

### Architecture Patterns
- Google Maps Geocoding API integration
- Proximity search using Haversine formula
- Address normalization for comparison
- Environment variable: GOOGLE_MAPS_API_KEY

### Haversine Formula
Used to calculate distance between two points on Earth:
```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // meters
}
```

### Components to Create/Modify
- `server/services/geocoding.ts` - New
- `server/services/duplicate-detection.ts` - New
- `server/routes.ts` - Update POST /api/buildings, add validation endpoint
- `client/src/components/buildings/building-form.tsx` - Add validation
- `client/src/components/buildings/duplicate-warning.tsx` - New

### Project Structure Notes

- Services in `server/services/`
- Geocoding called server-side (API key security)
- Real-time validation optional, can be on submit only

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR30, FR31]
- [Source: _bmad-output/planning-artifacts/architecture.md#External Integrations]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
