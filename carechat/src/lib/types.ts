export type PlaceType = "clinic" | "doctors" | "hospital" | "pharmacy";

export interface Clinic {
  id: string;
  name: string | null;
  type: PlaceType | null;
  lat: number;
  lon: number;
  address?: string | null;
  phone?: string | null;
  hours?: string | null;
  website?: string | null;
  distance?: number;
}
