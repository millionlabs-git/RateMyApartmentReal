import { type Building } from "@shared/schema";
import { storage } from "../storage";

// Haversine formula to calculate distance between two points on Earth
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Return distance in meters
}

// Normalize address for comparison
function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/\bstreet\b/g, "st")
    .replace(/\bavenue\b/g, "ave")
    .replace(/\bboulevard\b/g, "blvd")
    .replace(/\broad\b/g, "rd")
    .replace(/\bdrive\b/g, "dr")
    .replace(/\bplace\b/g, "pl")
    .replace(/\bcourt\b/g, "ct")
    .replace(/\beast\b/g, "e")
    .replace(/\bwest\b/g, "w")
    .replace(/\bnorth\b/g, "n")
    .replace(/\bsouth\b/g, "s")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Calculate similarity between two strings (simple Jaccard-like)
function addressSimilarity(addr1: string, addr2: string): number {
  const words1 = normalizeAddress(addr1).split(" ");
  const words2 = normalizeAddress(addr2).split(" ");
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = words1.filter((w) => set2.has(w));
  const unionSize = new Set([...words1, ...words2]).size;

  return intersection.length / unionSize;
}

// Levenshtein distance for string similarity
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// String similarity as a percentage (0-100)
function stringSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100;

  const distance = levenshteinDistance(str1, str2);
  return Math.round((1 - distance / maxLen) * 100);
}

// Calculate overall similarity score between two buildings (0-100)
export function calculateSimilarityScore(
  building1: Building,
  building2: Building
): number {
  let distanceScore = 0;

  // Distance score if both have coordinates
  if (
    building1.geocodeLat !== null &&
    building1.geocodeLng !== null &&
    building2.geocodeLat !== null &&
    building2.geocodeLng !== null
  ) {
    const distanceMeters = haversineDistance(
      building1.geocodeLat,
      building1.geocodeLng,
      building2.geocodeLat,
      building2.geocodeLng
    );
    // Distance score: 100 at 0m, 0 at 50m+
    distanceScore = Math.max(0, 100 - (distanceMeters / 50) * 100);
  }

  // Address similarity using Levenshtein
  const normalizedAddr1 = normalizeAddress(building1.address);
  const normalizedAddr2 = normalizeAddress(building2.address);
  const addressScore = stringSimilarity(normalizedAddr1, normalizedAddr2);

  // Name similarity
  const normalizedName1 = (building1.name || "").toLowerCase().trim();
  const normalizedName2 = (building2.name || "").toLowerCase().trim();
  const nameScore = stringSimilarity(normalizedName1, normalizedName2);

  // Weighted combination: distance 50%, address 30%, name 20%
  const finalScore = Math.round(
    distanceScore * 0.5 + addressScore * 0.3 + nameScore * 0.2
  );

  return Math.min(100, Math.max(0, finalScore));
}

const PROXIMITY_THRESHOLD_METERS = 50;
const ADDRESS_SIMILARITY_THRESHOLD = 0.7;

export interface PotentialDuplicate {
  building: Building;
  reason: "proximity" | "address" | "both";
  distance?: number;
  similarity?: number;
}

export interface ExactMatch {
  building: Building;
  isExact: true;
}

// Normalize building name for comparison
function normalizeName(name: string | null): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Check for exact match (normalized address AND building name identical)
export async function findExactMatch(
  address: string,
  name: string
): Promise<ExactMatch | null> {
  const allBuildings = await storage.getAllApprovedBuildings();
  const normalizedInputAddress = normalizeAddress(address);
  const normalizedInputName = normalizeName(name);

  for (const building of allBuildings) {
    const normalizedBuildingAddress = normalizeAddress(building.address);
    const normalizedBuildingName = normalizeName(building.name);

    if (
      normalizedInputAddress === normalizedBuildingAddress &&
      normalizedInputName === normalizedBuildingName
    ) {
      return {
        building,
        isExact: true,
      };
    }
  }

  return null;
}

export interface AddressMatch {
  building: Building;
  isAddressOnly: true;
}

// Check for address-only match (same address, different name)
export async function findAddressMatch(
  address: string
): Promise<AddressMatch | null> {
  const allBuildings = await storage.getAllApprovedBuildings();
  const normalizedInputAddress = normalizeAddress(address);

  for (const building of allBuildings) {
    const normalizedBuildingAddress = normalizeAddress(building.address);

    if (normalizedInputAddress === normalizedBuildingAddress) {
      return {
        building,
        isAddressOnly: true,
      };
    }
  }

  return null;
}

export async function findPotentialDuplicates(
  lat: number | null,
  lng: number | null,
  address: string,
  name: string
): Promise<PotentialDuplicate[]> {
  const allBuildings = await storage.getAllApprovedBuildings();
  const duplicates: PotentialDuplicate[] = [];

  for (const building of allBuildings) {
    let isProximityMatch = false;
    let isAddressMatch = false;
    let distance: number | undefined;
    let similarity: number | undefined;

    // Check proximity if we have coordinates
    if (lat !== null && lng !== null && building.geocodeLat && building.geocodeLng) {
      distance = haversineDistance(lat, lng, building.geocodeLat, building.geocodeLng);
      if (distance <= PROXIMITY_THRESHOLD_METERS) {
        isProximityMatch = true;
      }
    }

    // Check address similarity
    similarity = addressSimilarity(address, building.address);
    if (similarity >= ADDRESS_SIMILARITY_THRESHOLD) {
      isAddressMatch = true;
    }

    if (isProximityMatch || isAddressMatch) {
      duplicates.push({
        building,
        reason: isProximityMatch && isAddressMatch ? "both" : isProximityMatch ? "proximity" : "address",
        distance: isProximityMatch ? distance : undefined,
        similarity: isAddressMatch ? similarity : undefined,
      });
    }
  }

  return duplicates;
}

// Minimum similarity score to create a duplicate queue entry
const MIN_QUEUE_SCORE = 50;

// Threshold for name-only duplicate detection (0-100 scale)
const NAME_SIMILARITY_THRESHOLD = 80;
// Threshold for address-only duplicate detection (0-100 scale)
const ADDRESS_SIMILARITY_THRESHOLD_SCORE = 80;

// Find duplicates for a building and create queue entries
export async function detectAndQueueDuplicates(buildingId: string): Promise<number> {
  const building = await storage.getBuilding(buildingId);
  if (!building) return 0;

  const hasGeocode = building.geocodeLat !== null && building.geocodeLng !== null;

  const allBuildings = await storage.getAllApprovedBuildings();
  let entriesCreated = 0;

  const normalizedBuildingName = (building.name || "").toLowerCase().trim();
  const normalizedBuildingAddr = normalizeAddress(building.address);

  for (const otherBuilding of allBuildings) {
    // Skip self
    if (otherBuilding.id === buildingId) continue;

    const otherHasGeocode = otherBuilding.geocodeLat !== null && otherBuilding.geocodeLng !== null;

    // Check name similarity (catches same-name buildings regardless of location)
    const normalizedOtherName = (otherBuilding.name || "").toLowerCase().trim();
    const nameScore = stringSimilarity(normalizedBuildingName, normalizedOtherName);

    // Check address similarity (catches same-address buildings regardless of geocode)
    const normalizedOtherAddr = normalizeAddress(otherBuilding.address);
    const addrScore = stringSimilarity(normalizedBuildingAddr, normalizedOtherAddr);

    // Skip name similarity when both names are empty (avoids false positives)
    const nameMatch = normalizedBuildingName && normalizedOtherName && nameScore >= NAME_SIMILARITY_THRESHOLD;

    // Path 1: High name or address similarity alone warrants a queue entry
    if (nameMatch || addrScore >= ADDRESS_SIMILARITY_THRESHOLD_SCORE) {
      const score = Math.max(nameScore, addrScore);
      const created = await storage.createDuplicateQueueEntry(
        buildingId,
        otherBuilding.id,
        score
      );
      if (created) entriesCreated++;
      continue;
    }

    // Path 2: Proximity-based detection (original logic, requires geocode)
    if (hasGeocode && otherHasGeocode) {
      const distance = haversineDistance(
        building.geocodeLat!,
        building.geocodeLng!,
        otherBuilding.geocodeLat!,
        otherBuilding.geocodeLng!
      );

      if (distance > 100) continue;

      const score = calculateSimilarityScore(building, otherBuilding);
      if (score >= MIN_QUEUE_SCORE) {
        const created = await storage.createDuplicateQueueEntry(
          buildingId,
          otherBuilding.id,
          score
        );
        if (created) entriesCreated++;
      }
    }
  }

  return entriesCreated;
}
