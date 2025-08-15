import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function detectIntent(text: string) {
  const t = text.toLowerCase();
  if (t.match(/(nearest|nearby|find).*(clinic|doctor|walk-?in|hospital|pharmacy)/)) return "FIND_NEARBY";
  if (t.match(/find.*(clinic|doctor|walk-?in|hospital|pharmacy).*in|at|near/)) return "FIND_MANUAL";
  return "SMALL_TALK";
}

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{role:"user"|"bot"; text:string}[]>([
    { role:"bot", text:"Hi! Ask me: “Find the nearest walk‑in clinic” or “Find clinics near B3H 4R2”." }
  ]);
  const nav = useNavigation();

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setHistory(h => [...h, { role:"user", text }]);
    setInput("");

    const intent = detectIntent(text);
    if (intent === "FIND_NEARBY") {
      setHistory(h => [...h, { role:"bot", text:"On it — showing nearby clinics." }]);
      // @ts-ignore
      nav.navigate("Home");
    } else if (intent === "FIND_MANUAL") {
      setHistory(h => [...h, { role:"bot", text:"Sure — head to Manual Search to enter an address." }]);
      // @ts-ignore
      nav.navigate("Search");
    } else {
      setHistory(h => [...h, { role:"bot", text:"I can help find clinics nearby or by address. Try: “nearest walk‑in clinic”." }]);
    }
  };

  return (
    <SafeAreaView style={{ flex:1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios:"padding" })} style={{ flex:1 }}>
        <View style={{ flex:1, padding:16 }}>
          <Text style={{ fontSize:22, fontWeight:"700", marginBottom:8 }}>Chat</Text>
          <View style={{ flex:1, gap:8 }}>
            {history.map((m, i) => (
              <View key={i} style={{
                alignSelf: m.role==="user" ? "flex-end" : "flex-start",
                maxWidth:"85%", padding:12, borderRadius:16,
                backgroundColor: m.role==="user" ? "#2563eb" : "#e5e7eb"
              }}>
                <Text style={{ color: m.role==="user" ? "#fff" : "#111827" }}>{m.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection:"row", gap:8, marginTop:12 }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your question…"
              style={{ flex:1, backgroundColor:"#fff", borderRadius:12, padding:12, borderWidth:1, borderColor:"#e5e7eb" }}
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <TouchableOpacity onPress={send} style={{ backgroundColor:"#111827", paddingHorizontal:16, borderRadius:12, justifyContent:"center" }}>
              <Text style={{ color:"#fff", fontWeight:"700" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
