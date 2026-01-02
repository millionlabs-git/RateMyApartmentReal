// NYC ZIP Code Ranges
// Manhattan: 10001-10282
// Bronx: 10451-10475
// Brooklyn: 11201-11256
// Queens: 11004-11697
// Staten Island: 10301-10314

export function isValidNYCZip(zip: string): boolean {
  const zipNum = parseInt(zip, 10);

  if (isNaN(zipNum) || zip.length !== 5) {
    return false;
  }

  // Manhattan
  if (zipNum >= 10001 && zipNum <= 10282) return true;

  // Staten Island (overlaps with some Manhattan)
  if (zipNum >= 10301 && zipNum <= 10314) return true;

  // Bronx
  if (zipNum >= 10451 && zipNum <= 10475) return true;

  // Brooklyn
  if (zipNum >= 11201 && zipNum <= 11256) return true;

  // Queens
  if (zipNum >= 11004 && zipNum <= 11697) return true;

  return false;
}

export const NYC_NEIGHBORHOODS = [
  "Upper West Side",
  "Upper East Side",
  "Midtown",
  "Midtown East",
  "Midtown West",
  "Chelsea",
  "Greenwich Village",
  "East Village",
  "West Village",
  "SoHo",
  "Tribeca",
  "Lower East Side",
  "Financial District",
  "Battery Park City",
  "Harlem",
  "Washington Heights",
  "Inwood",
  "Williamsburg",
  "Greenpoint",
  "DUMBO",
  "Brooklyn Heights",
  "Park Slope",
  "Prospect Heights",
  "Crown Heights",
  "Bedford-Stuyvesant",
  "Bushwick",
  "Astoria",
  "Long Island City",
  "Jackson Heights",
  "Flushing",
  "Forest Hills",
  "Gramercy",
  "Murray Hill",
  "Sutton Place",
  "Hell's Kitchen",
  "Kips Bay",
  "Stuyvesant Town",
];

export const BUILDING_TYPES = [
  "Pre-war",
  "Post-war",
  "High-rise",
  "Walk-up",
  "Brownstone",
  "Townhouse",
  "New Construction",
  "Condo",
  "Co-op",
  "Rental",
];
