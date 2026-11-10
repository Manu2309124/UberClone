// AI-assisted: see docs/AI_LOG.md #19
import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState("es");

  // AsyncStorage is only for preferences, never sensitive data
  useEffect(() => {
    AsyncStorage.getItem("language").then((v) => v && setLanguage(v));
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang);
    if (user)
      updateDoc(doc(db, "drivers", user.uid), {
        "personal.language": lang,
      }).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.section}>Idioma</Text>
      <View style={styles.row}>
        <Button
          title={language === "es" ? "✓ Español" : "Español"}
          onPress={() => changeLanguage("es")}
        />
        <Button
          title={language === "en" ? "✓ English" : "English"}
          onPress={() => changeLanguage("en")}
        />
      </View>
      <Text style={styles.section}>Sesión</Text>
      <Button title="Cerrar sesión" color="#d32f2f" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
  row: { flexDirection: "row", gap: 12 },
});
