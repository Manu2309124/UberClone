// AI-assisted: see docs/AI_LOG.md #15
import { View, Text, Button, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { updateTripStatus } from "../services/trips";

const STEPS = {
  accepted: {
    label: "Voy en camino",
    next: "driver_arriving",
    title: "Ve al punto de recogida",
  },
  driver_arriving: {
    label: "Pasajero a bordo",
    next: "in_progress",
    title: "Llegando al pasajero",
  },
  in_progress: {
    label: "Finalizar viaje",
    next: "completed",
    title: "Viaje en curso hacia el destino",
  },
};

export default function ActiveTripScreen({ trip }) {
  const step = STEPS[trip.status];
  const toPickup =
    trip.status === "accepted" || trip.status === "driver_arriving";
  const target = toPickup ? trip.origin : trip.destination;

  const origin = { latitude: trip.origin.lat, longitude: trip.origin.lng };
  const destination = {
    latitude: trip.destination.lat,
    longitude: trip.destination.lng,
  };
  const region = {
    latitude: (origin.latitude + destination.latitude) / 2,
    longitude: (origin.longitude + destination.longitude) / 2,
    latitudeDelta:
      Math.abs(origin.latitude - destination.latitude) * 1.8 + 0.01,
    longitudeDelta:
      Math.abs(origin.longitude - destination.longitude) * 1.8 + 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        <Marker coordinate={origin} title="Recogida" pinColor="green" />
        <Marker coordinate={destination} title="Destino" pinColor="red" />
        <Polyline
          coordinates={[origin, destination]}
          strokeWidth={4}
          strokeColor="#1a73e8"
        />
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.title}>{step?.title}</Text>
        <Text>Hacia: {target.address}</Text>
        {step ? (
          <Button
            title={step.label}
            onPress={() => updateTripStatus(trip.id, step.next)}
          />
        ) : null}
        <Button
          title="Cancelar viaje"
          color="#d32f2f"
          onPress={() => updateTripStatus(trip.id, "cancelled")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { padding: 16, gap: 8, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold" },
});
