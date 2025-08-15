export interface GeocodeResult {
  display_name: string;
  lat: number;
  lon: number;
}

// Nominatim asks for a UA header—add one to be polite.
export async function geocode(query: string): Promise<GeocodeResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, { headers: { "Accept-Language": "en", "User-Agent": "carechat/1.0" } });
  if (!res.ok) throw new Error("Geocoding failed");
  const json = await res.json();
  return (json ?? []).map((r: any) => ({
    display_name: r.display_name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  }));
}
