import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import { geocode } from "../../services/nominatim";
import { fetchClinicsNearby } from "../../services/overpass";
import { distanceMeters } from "../../lib/haversine";
import ClinicCard from "../../components/ClinicCard";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setHint(null); setClinics([]); setPlaces([]);
    try {
      const results = await geocode(query.trim());
      setPlaces(results);
      if (results[0]) {
        const { lat, lon } = results[0];
        const raw = await fetchClinicsNearby(lat, lon, 3000);
        const withDist = raw.map(r => ({ ...r, distance: distanceMeters(lat, lon, r.lat, r.lon) }))
                            .sort((a,b)=> (a.distance ?? 0) - (b.distance ?? 0));
        setClinics(withDist);
      } else {
        setHint("No location found. Try a city, postal code, or full address.");
      }
    } catch (e:any) {
      setHint(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex:1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios:"padding", android:undefined })} style={{ flex:1 }}>
        <View style={{ padding:16, gap:8 }}>
          <Text style={{ fontSize:22, fontWeight:"700" }}>Manual search</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Enter address, city, or postal code"
            style={{ backgroundColor:"#fff", borderRadius:12, padding:14, borderColor:"#e5e7eb", borderWidth:1 }}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity onPress={onSearch} style={{ backgroundColor:"#111827", padding:12, borderRadius:12, alignItems:"center" }}>
            <Text style={{ color:"#fff", fontWeight:"600" }}>Find clinics near this location</Text>
          </TouchableOpacity>
          {loading && (<View style={{ padding:16, alignItems:"center" }}><ActivityIndicator /><Text>Searching…</Text></View>)}
          {hint && <Text style={{ color:"crimson" }}>{hint}</Text>}
          {places.length > 0 && (
            <Text style={{ opacity:0.7 }}>Using: {places[0].display_name}</Text>
          )}
        </View>

        <FlatList
          data={clinics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding:16, gap:12 }}
          renderItem={({ item }) => <ClinicCard clinic={item} />}
          ListEmptyComponent={!loading ? <Text style={{ padding:16 }}>No places yet—search above.</Text> : null}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
