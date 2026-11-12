// AI-assisted: see docs/AI_LOG.md #22
import { View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

// The driver's car on the map. It moves when `coordinate` changes.
export default function CarMarker({ coordinate }) {
  if (!coordinate) return null;
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} title="Tú">
      <View style={styles.badge}>
        <Ionicons name="car-sport" size={22} color="#fff" />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
