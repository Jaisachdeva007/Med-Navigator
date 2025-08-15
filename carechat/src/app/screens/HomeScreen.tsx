import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, SafeAreaView } from "react-native";
import * as Location from "expo-location";
import { fetchClinicsNearby } from "../../services/overpass";
import { distanceMeters } from "../../lib/haversine";
import ClinicCard from "../../components/ClinicCard";
import { useClinics } from "../../store/useClinics";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clinics, setClinics, lastCoords, setLastCoords } = useClinics();

  async function getAndLoad() {
    setError(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied. Enable it in Settings.");
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = loc.coords.latitude, lon = loc.coords.longitude;
      setLastCoords({ lat, lon });

      const raw = await fetchClinicsNearby(lat, lon, 3000);
      const withDist = raw.map(r => ({ ...r, distance: distanceMeters(lat, lon, r.lat, r.lon) }))
                          .sort((a,b) => (a.distance ?? 0) - (b.distance ?? 0));
      setClinics(withDist);
    } catch (e:any) {
      setError(e?.message || "Failed to load clinics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getAndLoad(); }, []);

  const onRefresh = async () => {
    if (!lastCoords) return;
    setRefreshing(true);
    try {
      const raw = await fetchClinicsNearby(lastCoords.lat, lastCoords.lon, 3000);
      const withDist = raw.map(r => ({ ...r, distance: distanceMeters(lastCoords.lat, lastCoords.lon, r.lat, r.lon) }))
                          .sort((a,b) => (a.distance ?? 0) - (b.distance ?? 0));
      setClinics(withDist);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop:12 }}>Finding clinics near you…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={{ padding:16 }}>
        <Text style={{ fontSize:22, fontWeight:"700" }}>Nearby care</Text>
        <Text style={{ opacity:0.7 }}>Walk‑in clinics, doctors, hospitals, pharmacies</Text>
        {error && <Text style={{ color:"crimson", marginTop:8 }}>{error}</Text>}
      </View>

      <FlatList
        data={clinics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding:16, gap:12 }}
        renderItem={({ item }) => <ClinicCard clinic={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ padding:16 }}>No places found within 3km.</Text>}
      />
    </SafeAreaView>
  );
}
