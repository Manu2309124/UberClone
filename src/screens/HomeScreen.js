// AI-assisted: see docs/AI_LOG.md #9
import { useState } from "react";
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { profile, loading } = useDriverProfile();
  const { logout } = useAuth();
  const [available, setAvailable] = useState(false);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const approved = profile?.status === "approved";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hola, {profile?.personal?.fullName ?? "conductora"}
      </Text>
      <Text style={styles.status}>
        Estado de la cuenta: {approved ? "Aprobada" : "Pendiente de aprobación"}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          {available ? "Disponible" : "No disponible"}
        </Text>
        <Switch
          value={available && approved}
          onValueChange={setAvailable}
          disabled={!approved}
        />
      </View>

      {!approved ? (
        <Text style={styles.hint}>
          No puedes ponerte disponible hasta que tu cuenta sea aprobada.
        </Text>
      ) : null}

      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  status: { fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 18 },
  hint: { color: "#d32f2f" },
});
