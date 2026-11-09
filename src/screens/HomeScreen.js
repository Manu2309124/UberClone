// AI-assisted: see docs/AI_LOG.md #15
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useDriverLocation } from "../hooks/useDriverLocation";
import { useTripRequests } from "../hooks/useTripRequests";
import { useActiveTrip } from "../hooks/useActiveTrip";
import TripRequestCard from "../components/TripRequestCard";
import ActiveTripScreen from "./ActiveTripScreen";
import TripSummaryScreen from "./TripSummaryScreen";
import { createFakeTrip, acceptTrip, rejectTrip } from "../services/trips";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { profile, loading } = useDriverProfile();
  const { user, logout } = useAuth();
  const [available, setAvailable] = useState(false);

  const approved = profile?.status === "approved";
  const { location, error } = useDriverLocation(
    user?.uid,
    available && approved,
  );

  // Trip requests are only listened to while the driver is available
  const requests = useTripRequests(available && approved);
  const currentRequest = requests[0] ?? null;

  // Trip the driver is currently working on (accepted -> completed)
  const activeTrip = useActiveTrip(user?.uid);

  // If approval is lost, force "not available"
  useEffect(() => {
    if (!approved && available) setAvailable(false);
  }, [approved, available]);

  const toggleAvailable = (value) => {
    setAvailable(value);
    if (user) {
      updateDoc(doc(db, "drivers", user.uid), { available: value }).catch((e) =>
        console.log(e.code),
      );
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // Active trip screens replace the home screen
  if (activeTrip?.status === "completed")
    return <TripSummaryScreen trip={activeTrip} />;
  if (activeTrip) return <ActiveTripScreen trip={activeTrip} />;

  const region = location
    ? { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : {
        latitude: 6.2442,
        longitude: -75.5812,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        {location ? <Marker coordinate={location} title="Tú" /> : null}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>
          Hola, {profile?.personal?.fullName ?? "conductora"}
        </Text>
        <Text>
          Estado de la cuenta:{" "}
          {approved ? "Aprobada" : "Pendiente de aprobación"}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            {available ? "Disponible" : "No disponible"}
          </Text>
          <Switch
            value={available}
            onValueChange={toggleAvailable}
            disabled={!approved}
          />
        </View>

        {!approved ? (
          <Text style={styles.hint}>
            No puedes ponerte disponible hasta que tu cuenta sea aprobada.
          </Text>
        ) : null}
        {error ? <Text style={styles.hint}>{error}</Text> : null}

        {currentRequest ? (
          <TripRequestCard
            trip={currentRequest}
            onAccept={(t) => acceptTrip(t.id, user.uid)}
            onReject={(t) => rejectTrip(t.id)}
          />
        ) : null}

        {available ? (
          <Button
            title="Simular pasajero"
            onPress={() => createFakeTrip("economy")}
          />
        ) : null}

        <Button title="Cerrar sesión" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { padding: 16, gap: 8, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 18 },
  hint: { color: "#d32f2f" },
});
