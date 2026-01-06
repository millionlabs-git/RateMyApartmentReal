interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function geocodeAddress(
  address: string,
  city: string,
  zip: string
): Promise<GeocodeResult | null> {
  if (!GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY not set, skipping geocoding");
    return null;
  }

  try {
    const fullAddress = `${address}, ${city}, NY ${zip}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    if (data.status === "ZERO_RESULTS") {
      return null;
    }

    console.error("Geocoding API error:", data.status, data.error_message);
    return null;
  } catch (error) {
    console.error("Geocoding request failed:", error);
    return null;
  }
}

export function isGeocodingEnabled(): boolean {
  return !!GOOGLE_API_KEY;
}
