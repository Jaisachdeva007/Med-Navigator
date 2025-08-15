import React from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import { Clinic } from "../lib/types";

const metersReadable = (m?: number) => m == null ? "" : m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(1)} km`;

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const { name, address, phone, hours, lat, lon, type, distance } = clinic;

  const openDialer = () => phone && Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  const openMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(name ?? "Clinic")}`,
      android: `geo:${lat},${lon}?q=${encodeURIComponent(name ?? "Clinic")}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    })!;
    Linking.openURL(url);
  };

  return (
    <View style={{ backgroundColor:"#fff", borderRadius:16, padding:16, gap:8, shadowColor:"#000", shadowOpacity:0.05, shadowRadius:6, elevation:2 }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between" }}>
        <Text style={{ fontSize:18, fontWeight:"700", flex:1, paddingRight:8 }}>{name ?? "Unnamed clinic"}</Text>
        <Text style={{ fontSize:12, opacity:0.6 }}>{metersReadable(distance)}</Text>
      </View>
      <Text style={{ opacity:0.8 }}>{[type && (type[0].toUpperCase()+type.slice(1)), address].filter(Boolean).join(" • ")}</Text>
      {phone && <Text>📞 {phone}</Text>}
      {hours && <Text>⏰ {hours}</Text>}
      <View style={{ flexDirection:"row", gap:8, marginTop:6 }}>
        <TouchableOpacity onPress={openMaps} style={{ backgroundColor:"#111827", paddingVertical:10, paddingHorizontal:14, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"600" }}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openDialer} disabled={!phone} style={{ backgroundColor: phone ? "#2563eb" : "#9ca3af", paddingVertical:10, paddingHorizontal:14, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"600" }}>{phone ? "Call" : "No Phone"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
