// AI-assisted: see docs/AI_LOG.md #18, #23
import { useRef } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  paymentStatusLabel,
  PAYMENT_METHOD_LABEL,
} from "../utils/paymentStatus";

const money = (n) => `$${n.toLocaleString("es-CO")}`;

export default function TripDetailScreen({ route }) {
  const { trip } = route.params;
  const mapRef = useRef(null);

  const o = { latitude: trip.origin.lat, longitude: trip.origin.lng };
  const d = { latitude: trip.destination.lat, longitude: trip.destination.lng };
  const region = {
    latitude: (o.latitude + d.latitude) / 2,
    longitude: (o.longitude + d.longitude) / 2,
    latitudeDelta: Math.abs(o.latitude - d.latitude) * 1.8 + 0.01,
    longitudeDelta: Math.abs(o.longitude - d.longitude) * 1.8 + 0.01,
  };

  return (
    <ScrollView>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onMapReady={() =>
          mapRef.current?.fitToCoordinates([o, d], {
            edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
            animated: false,
          })
        }
      >
        <Marker coordinate={o} title="Origen" pinColor="green" />
        <Marker coordinate={d} title="Destino" pinColor="red" />
        <Polyline coordinates={[o, d]} strokeWidth={4} strokeColor="#1a73e8" />
      </MapView>
      <View style={styles.info}>
        <Text>Fecha: {new Date(trip.date).toLocaleString("es-CO")}</Text>
        <Text>
          Distancia: {trip.distanceKm} km · Duración: {trip.durationMin} min
        </Text>
        <Text>Tarifa: {money(trip.fare)}</Text>
        <Text>
          Comisión ({Math.round(trip.commissionRate * 100)} %):{" "}
          {money(trip.commission)}
        </Text>
        <Text>Propina: {money(trip.tip || 0)}</Text>
        <Text>Ganancia neta: {money(trip.driverEarnings)}</Text>
        <Text>
          Pago:{" "}
          {PAYMENT_METHOD_LABEL[trip.paymentMethod] ?? trip.paymentMethod} ·{" "}
          {paymentStatusLabel(trip)}
        </Text>
        <Text>
          Calificación del pasajero:{" "}
          {trip.rating ? `${trip.rating} / 5` : "Sin calificación"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: { height: 260 },
  info: { padding: 16, gap: 6 },
});
