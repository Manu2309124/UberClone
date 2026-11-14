// AI-assisted: see docs/AI_LOG.md #19, #31
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// The language is saved by LanguageContext in AsyncStorage (a preference,
// never sensitive data) and in the driver profile.
export default function SettingsScreen() {
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.section}>{t("settings.language")}</Text>
      <View style={styles.row}>
        <Button
          title={language === "es" ? "✓ Español" : "Español"}
          onPress={() => setLanguage("es")}
        />
        <Button
          title={language === "en" ? "✓ English" : "English"}
          onPress={() => setLanguage("en")}
        />
      </View>
      <Text style={styles.section}>{t("settings.session")}</Text>
      <Button title={t("settings.logout")} color="#d32f2f" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
  row: { flexDirection: "row", gap: 12 },
});
