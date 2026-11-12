// AI-assisted: see docs/AI_LOG.md #15, #22, #30, #31
import { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { updateTripStatus } from "../services/trips";
import { useRoute } from "../hooks/useRoute";
import { useSimulatedDrive } from "../hooks/useSimulatedDrive";
import CarMarker from "../components/CarMarker";
import { useActiveTripContext } from "../context/ActiveTripContext";
import { useLanguage } from "../context/LanguageContext";

const STEPS = {
  accepted: {
    label: "trip.onMyWay",
    next: "driver_arriving",
    title: "trip.goPickup",
  },
  driver_arriving: {
    label: "trip.passengerOnBoard",
    next: "in_progress",
    title: "trip.arriving",
  },
  in_progress: {
    label: "trip.finish",
    next: "completed",
    title: "trip.inProgress",
  },
};

const EDGE = { top: 60, right: 60, bottom: 60, left: 60 };

// "Viaje en curso" screen of the trip Stack. The trip and the driver
// location come from ActiveTripContext.
export default function ActiveTripScreen() {
  const { activeTrip, driverLocation } = useActiveTripContext();
  // Keep the last trip while the Stack moves to the next screen
  const lastTrip = useRef(activeTrip);
  if (activeTrip) lastTrip.current = activeTrip;
  const trip = lastTrip.current;
  if (!trip) return null;
  return <ActiveTrip trip={trip} driverLocation={driverLocation} />;
}

function ActiveTrip({ trip, driverLocation }) {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const [simulating, setSimulating] = useState(false);

  const step = STEPS[trip.status];
  const toPickup =
    trip.status === "accepted" || trip.status === "driver_arriving";
  const target = toPickup ? trip.origin : trip.destination;

  const origin = { latitude: trip.origin.lat, longitude: trip.origin.lng };
  const destination = {
    latitude: trip.destination.lat,
    longitude: trip.destination.lng,
  };

  // Leg 1: driver -> pickup. Leg 2 (after "Pasajero a bordo"): pickup -> destination.
  const leg = toPickup ? "pickup" : "dropoff";
  const route = useRoute(
    `${trip.id}-${leg}`,
    toPickup ? driverLocation : origin,
    toPickup ? origin : destination,
  );

  const simulated = useSimulatedDrive(route?.coordinates, simulating);
  const carPosition = simulated ?? driverLocation;

  // A new leg starts with the simulation off
  useEffect(() => setSimulating(false), [leg]);

  // Zoom the map to show the whole route
  useEffect(() => {
    if (route?.coordinates?.length > 1) {
      mapRef.current?.fitToCoordinates(route.coordinates, {
        edgePadding: EDGE,
        animated: true,
      });
    }
  }, [route]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...origin,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        <Marker coordinate={origin} title={t("common.pickup")} pinColor="green" />
        <Marker
          coordinate={destination}
          title={t("common.destination")}
          pinColor="red"
        />
        {route ? (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={5}
            strokeColor="#1a73e8"
            lineDashPattern={route.straightLine ? [10, 10] : undefined}
          />
        ) : null}
        <CarMarker coordinate={carPosition} />
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.title}>{step ? t(step.title) : null}</Text>
        <Text>{t("trip.towards", { address: target.address })}</Text>
        {route?.distanceMeters ? (
          <Text>
            {t("trip.routeInfo", {
              km: (route.distanceMeters / 1000).toFixed(1),
              min: Math.round(parseInt(route.duration, 10) / 60),
            })}
          </Text>
        ) : null}
        {step ? (
          <Button
            title={t(step.label)}
            onPress={() => updateTripStatus(trip.id, step.next)}
          />
        ) : null}
        {__DEV__ && route ? (
          <Button
            title={simulating ? t("trip.stopSimulation") : t("trip.simulate")}
            color="#555"
            onPress={() => setSimulating((s) => !s)}
          />
        ) : null}
        {toPickup ? (
          <Button
            title={t("trip.cancel")}
            color="#d32f2f"
            onPress={() => updateTripStatus(trip.id, "cancelled")}
          />
        ) : null}
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
