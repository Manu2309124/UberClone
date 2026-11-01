// AI-assisted: see docs/AI_LOG.md #3
import { View, Text, StyleSheet } from "react-native";

export default function PlaceholderScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.name}</Text>
      <Text>Pantalla en construcción</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
});
