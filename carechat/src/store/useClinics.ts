import { create } from "zustand";
import { Clinic } from "../lib/types";

interface ClinicState {
  clinics: Clinic[];
  setClinics: (xs: Clinic[]) => void;
  lastCoords?: { lat: number; lon: number };
  setLastCoords: (c: { lat:number; lon:number }) => void;
}

export const useClinics = create<ClinicState>((set) => ({
  clinics: [],
  setClinics: (xs) => set({ clinics: xs }),
  lastCoords: undefined,
  setLastCoords: (c) => set({ lastCoords: c }),
}));
