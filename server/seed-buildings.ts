import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { buildings } from "@shared/schema";

const { Pool } = pg;

// Real NYC apartment buildings data
const nycBuildings = [
  // Manhattan - Upper East Side
  { name: "The Lucida", address: "151 E 85th St", city: "New York", zip: "10028", neighborhood: "Upper East Side", buildingType: "High-rise", landlord: "Extell Development" },
  { name: "Azure", address: "333 E 91st St", city: "New York", zip: "10128", neighborhood: "Upper East Side", buildingType: "High-rise", landlord: "Glenwood Management" },
  { name: "The Coronado", address: "155 E 93rd St", city: "New York", zip: "10128", neighborhood: "Upper East Side", buildingType: "Mid-rise", landlord: null },
  { name: "The Strathmore", address: "400 E 84th St", city: "New York", zip: "10028", neighborhood: "Upper East Side", buildingType: "High-rise", landlord: "Rose Associates" },
  { name: "The Bromley", address: "225 E 83rd St", city: "New York", zip: "10028", neighborhood: "Upper East Side", buildingType: "High-rise", landlord: "Glenwood Management" },

  // Manhattan - Upper West Side
  { name: "The Avery", address: "100 Riverside Blvd", city: "New York", zip: "10069", neighborhood: "Upper West Side", buildingType: "High-rise", landlord: "Related Companies" },
  { name: "The Aldyn", address: "60 Riverside Blvd", city: "New York", zip: "10069", neighborhood: "Upper West Side", buildingType: "High-rise", landlord: "Extell Development" },
  { name: "Trump Place", address: "180 Riverside Blvd", city: "New York", zip: "10069", neighborhood: "Upper West Side", buildingType: "High-rise", landlord: "Equity Residential" },
  { name: "The Corner", address: "200 W 72nd St", city: "New York", zip: "10023", neighborhood: "Upper West Side", buildingType: "High-rise", landlord: null },
  { name: "The Laureate", address: "2150 Broadway", city: "New York", zip: "10023", neighborhood: "Upper West Side", buildingType: "High-rise", landlord: "Stonehenge Partners" },

  // Manhattan - Midtown
  { name: "Sky", address: "605 W 42nd St", city: "New York", zip: "10036", neighborhood: "Hell's Kitchen", buildingType: "High-rise", landlord: "Moinian Group" },
  { name: "The Max", address: "600 W 42nd St", city: "New York", zip: "10036", neighborhood: "Hell's Kitchen", buildingType: "High-rise", landlord: "TF Cornerstone" },
  { name: "Silver Towers", address: "600 W 42nd St", city: "New York", zip: "10036", neighborhood: "Hell's Kitchen", buildingType: "High-rise", landlord: "Silverstein Properties" },
  { name: "Bettina", address: "500 W 43rd St", city: "New York", zip: "10036", neighborhood: "Hell's Kitchen", buildingType: "Mid-rise", landlord: null },
  { name: "The Durst", address: "855 Sixth Ave", city: "New York", zip: "10001", neighborhood: "Midtown", buildingType: "High-rise", landlord: "Durst Organization" },

  // Manhattan - Chelsea
  { name: "The Caledonia", address: "450 W 17th St", city: "New York", zip: "10011", neighborhood: "Chelsea", buildingType: "High-rise", landlord: "Related Companies" },
  { name: "The Ohm", address: "312 11th Ave", city: "New York", zip: "10001", neighborhood: "Chelsea", buildingType: "High-rise", landlord: null },
  { name: "Chelsea Stratus", address: "101 W 24th St", city: "New York", zip: "10011", neighborhood: "Chelsea", buildingType: "High-rise", landlord: "Rockrose Development" },
  { name: "The Charleston", address: "225 W 23rd St", city: "New York", zip: "10011", neighborhood: "Chelsea", buildingType: "Mid-rise", landlord: null },
  { name: "Fulton House", address: "101 W 15th St", city: "New York", zip: "10011", neighborhood: "Chelsea", buildingType: "High-rise", landlord: null },

  // Manhattan - East Village / Lower East Side
  { name: "The Jefferson", address: "211 E 13th St", city: "New York", zip: "10003", neighborhood: "East Village", buildingType: "Mid-rise", landlord: null },
  { name: "Avalon Bowery Place", address: "11 E 1st St", city: "New York", zip: "10003", neighborhood: "East Village", buildingType: "High-rise", landlord: "AvalonBay Communities" },
  { name: "The Ludlow", address: "188 Ludlow St", city: "New York", zip: "10002", neighborhood: "Lower East Side", buildingType: "Mid-rise", landlord: null },
  { name: "Essex Crossing", address: "242 Broome St", city: "New York", zip: "10002", neighborhood: "Lower East Side", buildingType: "High-rise", landlord: "Taconic Partners" },
  { name: "One Manhattan Square", address: "252 South St", city: "New York", zip: "10002", neighborhood: "Lower East Side", buildingType: "High-rise", landlord: "Extell Development" },

  // Manhattan - Financial District
  { name: "One Wall Street", address: "1 Wall St", city: "New York", zip: "10005", neighborhood: "Financial District", buildingType: "High-rise", landlord: "Macklowe Properties" },
  { name: "70 Pine", address: "70 Pine St", city: "New York", zip: "10005", neighborhood: "Financial District", buildingType: "High-rise", landlord: "Rose Associates" },
  { name: "The Beekman", address: "5 Beekman St", city: "New York", zip: "10038", neighborhood: "Financial District", buildingType: "High-rise", landlord: null },
  { name: "50 West", address: "50 West St", city: "New York", zip: "10006", neighborhood: "Financial District", buildingType: "High-rise", landlord: "Time Equities" },
  { name: "123 Washington Street", address: "123 Washington St", city: "New York", zip: "10006", neighborhood: "Financial District", buildingType: "High-rise", landlord: null },

  // Brooklyn - Williamsburg
  { name: "The Edge", address: "22 North 6th St", city: "Brooklyn", zip: "11249", neighborhood: "Williamsburg", buildingType: "High-rise", landlord: "Douglaston Development" },
  { name: "Northside Piers", address: "4 North 5th St", city: "Brooklyn", zip: "11249", neighborhood: "Williamsburg", buildingType: "High-rise", landlord: "Two Trees Management" },
  { name: "The Williamsburg", address: "480 Kent Ave", city: "Brooklyn", zip: "11249", neighborhood: "Williamsburg", buildingType: "High-rise", landlord: "Two Trees Management" },
  { name: "325 Kent", address: "325 Kent Ave", city: "Brooklyn", zip: "11249", neighborhood: "Williamsburg", buildingType: "High-rise", landlord: "Two Trees Management" },
  { name: "Austin Nichols House", address: "184 Kent Ave", city: "Brooklyn", zip: "11249", neighborhood: "Williamsburg", buildingType: "Mid-rise", landlord: null },

  // Brooklyn - DUMBO
  { name: "Olympia Dumbo", address: "30 Front St", city: "Brooklyn", zip: "11201", neighborhood: "DUMBO", buildingType: "High-rise", landlord: "Fortis Property Group" },
  { name: "Kirkman Lofts", address: "99 Gold St", city: "Brooklyn", zip: "11201", neighborhood: "DUMBO", buildingType: "Mid-rise", landlord: null },
  { name: "J Condominium", address: "100 Jay St", city: "Brooklyn", zip: "11201", neighborhood: "DUMBO", buildingType: "Mid-rise", landlord: null },
  { name: "Clocktower Building", address: "1 Main St", city: "Brooklyn", zip: "11201", neighborhood: "DUMBO", buildingType: "Mid-rise", landlord: "Two Trees Management" },
  { name: "Front & York", address: "85 Jay St", city: "Brooklyn", zip: "11201", neighborhood: "DUMBO", buildingType: "High-rise", landlord: "CIM Group" },

  // Brooklyn - Downtown Brooklyn
  { name: "City Tower", address: "250 Ashland Pl", city: "Brooklyn", zip: "11217", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: "Two Trees Management" },
  { name: "Hub", address: "333 Schermerhorn St", city: "Brooklyn", zip: "11217", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: "Steiner NYC" },
  { name: "66 Rockwell", address: "66 Rockwell Pl", city: "Brooklyn", zip: "11217", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: null },
  { name: "The Brooklyner", address: "111 Lawrence St", city: "Brooklyn", zip: "11201", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: "Brookfield Properties" },
  { name: "AVA DoBro", address: "100 Willoughby St", city: "Brooklyn", zip: "11201", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: "AvalonBay Communities" },

  // Brooklyn - Park Slope / Prospect Heights
  { name: "461 Dean", address: "461 Dean St", city: "Brooklyn", zip: "11217", neighborhood: "Prospect Heights", buildingType: "High-rise", landlord: "Forest City Ratner" },
  { name: "550 Vanderbilt", address: "550 Vanderbilt Ave", city: "Brooklyn", zip: "11238", neighborhood: "Prospect Heights", buildingType: "High-rise", landlord: "Greenland USA" },
  { name: "The Parkside", address: "170 Flatbush Ave", city: "Brooklyn", zip: "11217", neighborhood: "Prospect Heights", buildingType: "High-rise", landlord: null },
  { name: "One Prospect Park", address: "1 Grand Army Plaza", city: "Brooklyn", zip: "11238", neighborhood: "Park Slope", buildingType: "High-rise", landlord: null },
  { name: "The Landmark", address: "1 Hanson Pl", city: "Brooklyn", zip: "11243", neighborhood: "Fort Greene", buildingType: "High-rise", landlord: null },

  // Queens - Long Island City
  { name: "The Hayden", address: "43-25 Hunter St", city: "Long Island City", zip: "11101", neighborhood: "Long Island City", buildingType: "High-rise", landlord: "Tishman Speyer" },
  { name: "Gotham Point", address: "1-50 50th Ave", city: "Long Island City", zip: "11101", neighborhood: "Long Island City", buildingType: "High-rise", landlord: "Gotham Organization" },
  { name: "The View at East Coast", address: "4545 Center Blvd", city: "Long Island City", zip: "11109", neighborhood: "Long Island City", buildingType: "High-rise", landlord: "TF Cornerstone" },
  { name: "Linc LIC", address: "43-10 Crescent St", city: "Long Island City", zip: "11101", neighborhood: "Long Island City", buildingType: "High-rise", landlord: "Rockrose Development" },
  { name: "One Court Square", address: "28-10 Jackson Ave", city: "Long Island City", zip: "11101", neighborhood: "Long Island City", buildingType: "High-rise", landlord: null },

  // Queens - Astoria
  { name: "Astoria Central", address: "31-43 Vernon Blvd", city: "Astoria", zip: "11106", neighborhood: "Astoria", buildingType: "High-rise", landlord: null },
  { name: "The Ditmars", address: "21-30 44th Dr", city: "Astoria", zip: "11101", neighborhood: "Astoria", buildingType: "Mid-rise", landlord: null },
  { name: "Halletts Point", address: "26-01 1st St", city: "Astoria", zip: "11102", neighborhood: "Astoria", buildingType: "High-rise", landlord: "Durst Organization" },
  { name: "RiverEast", address: "4-40 44th Dr", city: "Long Island City", zip: "11101", neighborhood: "Hunters Point", buildingType: "High-rise", landlord: "TF Cornerstone" },
  { name: "The Forge", address: "30-02 39th Ave", city: "Long Island City", zip: "11101", neighborhood: "Long Island City", buildingType: "High-rise", landlord: null },

  // Bronx
  { name: "The Grand at Bergen", address: "2850 Grand Concourse", city: "Bronx", zip: "10458", neighborhood: "Bedford Park", buildingType: "High-rise", landlord: null },
  { name: "River Park Towers", address: "10 Richman Plaza", city: "Bronx", zip: "10453", neighborhood: "Morris Heights", buildingType: "High-rise", landlord: null },
  { name: "Tracey Towers", address: "20 W Mosholu Pkwy S", city: "Bronx", zip: "10468", neighborhood: "Jerome Park", buildingType: "High-rise", landlord: null },
  { name: "1800 Grand Concourse", address: "1800 Grand Concourse", city: "Bronx", zip: "10457", neighborhood: "Mount Eden", buildingType: "High-rise", landlord: null },
  { name: "Metro North Plaza", address: "320 E 158th St", city: "Bronx", zip: "10451", neighborhood: "Melrose", buildingType: "Mid-rise", landlord: null },

  // Manhattan - Harlem
  { name: "One Museum Mile", address: "1280 Fifth Ave", city: "New York", zip: "10029", neighborhood: "East Harlem", buildingType: "High-rise", landlord: null },
  { name: "The Savoy", address: "35 W 130th St", city: "New York", zip: "10037", neighborhood: "Harlem", buildingType: "Mid-rise", landlord: null },
  { name: "The Rennie", address: "147 W 126th St", city: "New York", zip: "10027", neighborhood: "Harlem", buildingType: "Mid-rise", landlord: null },
  { name: "The Ellington", address: "2178 Frederick Douglass Blvd", city: "New York", zip: "10026", neighborhood: "Harlem", buildingType: "High-rise", landlord: null },
  { name: "2280 FDB", address: "2280 Frederick Douglass Blvd", city: "New York", zip: "10027", neighborhood: "Harlem", buildingType: "High-rise", landlord: "L+M Development" },

  // Manhattan - TriBeCa / SoHo
  { name: "56 Leonard", address: "56 Leonard St", city: "New York", zip: "10013", neighborhood: "TriBeCa", buildingType: "High-rise", landlord: "Alexico Group" },
  { name: "30 Park Place", address: "30 Park Pl", city: "New York", zip: "10007", neighborhood: "TriBeCa", buildingType: "High-rise", landlord: "Silverstein Properties" },
  { name: "101 Warren Street", address: "101 Warren St", city: "New York", zip: "10007", neighborhood: "TriBeCa", buildingType: "High-rise", landlord: null },
  { name: "The Smile", address: "126 Madison Ave", city: "New York", zip: "10016", neighborhood: "NoMad", buildingType: "Mid-rise", landlord: "GDS Development" },
  { name: "40 Mercer", address: "40 Mercer St", city: "New York", zip: "10013", neighborhood: "SoHo", buildingType: "Mid-rise", landlord: null },

  // More Brooklyn neighborhoods
  { name: "The Ashland", address: "250 Ashland Pl", city: "Brooklyn", zip: "11217", neighborhood: "Fort Greene", buildingType: "High-rise", landlord: "Two Trees Management" },
  { name: "Greenpoint Landing", address: "1 Eagle St", city: "Brooklyn", zip: "11222", neighborhood: "Greenpoint", buildingType: "High-rise", landlord: "Brookfield Properties" },
  { name: "77 Commercial Street", address: "77 Commercial St", city: "Brooklyn", zip: "11222", neighborhood: "Greenpoint", buildingType: "High-rise", landlord: null },
  { name: "The Linden", address: "1111 Linden Blvd", city: "Brooklyn", zip: "11226", neighborhood: "Flatbush", buildingType: "Mid-rise", landlord: null },
  { name: "Brooklyn Crossing", address: "200 Livingston St", city: "Brooklyn", zip: "11201", neighborhood: "Downtown Brooklyn", buildingType: "High-rise", landlord: null },

  // Staten Island
  { name: "Urby Staten Island", address: "7 Navy Pier Ct", city: "Staten Island", zip: "10304", neighborhood: "Stapleton", buildingType: "High-rise", landlord: "Ironstate Development" },
  { name: "Lighthouse Point", address: "101 Bay St", city: "Staten Island", zip: "10301", neighborhood: "St. George", buildingType: "High-rise", landlord: "Lighthouse Point LLC" },
  { name: "Empire Outlets", address: "55 Richmond Terrace", city: "Staten Island", zip: "10301", neighborhood: "St. George", buildingType: "Mixed-use", landlord: "BFC Partners" },
];

async function seedBuildings() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("Seeding buildings...");

  try {
    // Insert all buildings with status 'approved' so they show up immediately
    const result = await db.insert(buildings).values(
      nycBuildings.map(b => ({
        ...b,
        status: "approved" as const,
      }))
    ).returning({ id: buildings.id, name: buildings.name });

    console.log(`Successfully seeded ${result.length} buildings!`);

    // Show a few examples
    console.log("\nSample buildings added:");
    result.slice(0, 5).forEach(b => console.log(`  - ${b.name}`));
    console.log("  ...");

  } catch (error) {
    console.error("Error seeding buildings:", error);
  } finally {
    await pool.end();
  }
}

seedBuildings();
