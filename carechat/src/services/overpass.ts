import { Clinic, PlaceType } from "../lib/types";

const TYPES: PlaceType[] = ["clinic", "doctors", "hospital", "pharmacy"];

export async function fetchClinicsNearby(lat: number, lon: number, radius = 3000): Promise<Clinic[]> {
  const query = `
    [out:json][timeout:25];
    (
      ${TYPES.map(t => `
        node(around:${radius},${lat},${lon})["amenity"="${t}"];
        way(around:${radius},${lat},${lon})["amenity"="${t}"];
      `).join("\n")}
    );
    out center tags;
  `.trim();

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ data: query }).toString(),
  });
  if (!res.ok) throw new Error("Overpass request failed");

  const json = await res.json();
  const seen = new Set<string>();
  const list: Clinic[] = [];

  for (const el of json?.elements ?? []) {
    const tags = el.tags ?? {};
    const center = el.type === "way" ? el.center : el;
    if (!center?.lat || !center?.lon) continue;

    const address = [
      tags["addr:housenumber"], tags["addr:street"], tags["addr:city"],
      tags["addr:state"], tags["addr:postcode"], tags["addr:country"],
    ].filter(Boolean).join(", ");

    const item: Clinic = {
      id: `${el.type}/${el.id}`,
      name: tags.name || null,
      type: (tags.amenity as PlaceType) ?? null,
      lat: center.lat, lon: center.lon,
      address: address || tags["addr:full"] || null,
      phone: tags.phone || tags["contact:phone"] || null,
      hours: tags.opening_hours || null,
      website: tags.website || tags["contact:website"] || null,
    };

    if (!seen.has(item.id)) {
      seen.add(item.id);
      list.push(item);
    }
  }
  return list;
}
