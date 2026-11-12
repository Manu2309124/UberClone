// AI-assisted: see docs/AI_LOG.md #18, #23, #31
import { useRef } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  paymentStatusLabel,
  paymentMethodLabel,
} from "../utils/paymentStatus";
import { useLanguage } from "../context/LanguageContext";

export default function TripDetailScreen({ route }) {
  const { trip } = route.params;
  const mapRef = useRef(null);
  const { t, money, locale, language } = useLanguage();

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
        <Marker coordinate={o} title={t("common.origin")} pinColor="green" />
        <Marker coordinate={d} title={t("common.destination")} pinColor="red" />
        <Polyline coordinates={[o, d]} strokeWidth={4} strokeColor="#1a73e8" />
      </MapView>
      <View style={styles.info}>
        <Text>
          {t("detail.date", { date: new Date(trip.date).toLocaleString(locale) })}
        </Text>
        <Text>
          {t("common.distanceDuration", {
            km: trip.distanceKm,
            min: trip.durationMin,
          })}
        </Text>
        <Text>
          {t("common.fare")}: {money(trip.fare)}
        </Text>
        <Text>
          {t("common.commission", {
            rate: Math.round(trip.commissionRate * 100),
          })}
          : {money(trip.commission)}
        </Text>
        <Text>
          {t("common.tip")}: {money(trip.tip || 0)}
        </Text>
        <Text>
          {t("common.netEarnings")}: {money(trip.driverEarnings)}
        </Text>
        <Text>
          {t("common.payment")}:{" "}
          {paymentMethodLabel(trip.paymentMethod, language)} ·{" "}
          {paymentStatusLabel(trip, language)}
        </Text>
        <Text>
          {t("detail.rating", {
            rating: trip.rating ? `${trip.rating} / 5` : t("detail.noRating"),
          })}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: { height: 260 },
  info: { padding: 16, gap: 6 },
});
