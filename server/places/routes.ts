import { Router } from "express";

const router = Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface PlaceDetails {
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
}

// Autocomplete endpoint
router.get("/autocomplete", async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  if (!GOOGLE_API_KEY) {
    return res.status(503).json({ message: "Places API not configured" });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", query);
    url.searchParams.set("key", GOOGLE_API_KEY);
    url.searchParams.set("types", "address");
    url.searchParams.set("components", "country:us");
    // Bias results to NYC area
    url.searchParams.set("location", "40.7128,-74.0060");
    url.searchParams.set("radius", "50000");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK") {
      const predictions: PlacePrediction[] = data.predictions.map((p: any) => ({
        placeId: p.place_id,
        description: p.description,
        mainText: p.structured_formatting?.main_text || p.description,
        secondaryText: p.structured_formatting?.secondary_text || "",
      }));
      return res.json({ data: predictions });
    }

    if (data.status === "ZERO_RESULTS") {
      return res.json({ data: [] });
    }

    console.error("Places API error:", data.status, data.error_message);
    return res.status(500).json({ message: "Failed to fetch suggestions" });
  } catch (error) {
    console.error("Places autocomplete error:", error);
    return res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

// Place details endpoint
router.get("/details/:placeId", async (req, res) => {
  const { placeId } = req.params;

  if (!placeId) {
    return res.status(400).json({ message: "Place ID is required" });
  }

  if (!GOOGLE_API_KEY) {
    return res.status(503).json({ message: "Places API not configured" });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("key", GOOGLE_API_KEY);
    url.searchParams.set("fields", "address_components,formatted_address,geometry,name");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK" && data.result) {
      const components = data.result.address_components || [];

      const getComponent = (types: string[]): string => {
        const component = components.find((c: any) =>
          types.some(t => c.types.includes(t))
        );
        return component?.long_name || component?.short_name || "";
      };

      const streetNumber = getComponent(["street_number"]);
      const streetName = getComponent(["route"]);
      const address = streetNumber && streetName
        ? `${streetNumber} ${streetName}`
        : streetName || data.result.formatted_address?.split(",")[0] || "";

      const details: PlaceDetails = {
        address,
        city: getComponent(["locality", "sublocality", "sublocality_level_1"]) || "New York",
        state: getComponent(["administrative_area_level_1"]),
        zip: getComponent(["postal_code"]),
        neighborhood: getComponent(["neighborhood", "sublocality_level_1"]),
        lat: data.result.geometry?.location?.lat,
        lng: data.result.geometry?.location?.lng,
      };

      return res.json({ data: details });
    }

    console.error("Place details API error:", data.status, data.error_message);
    return res.status(500).json({ message: "Failed to fetch place details" });
  } catch (error) {
    console.error("Place details error:", error);
    return res.status(500).json({ message: "Failed to fetch place details" });
  }
});

export default router;
