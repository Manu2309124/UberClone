// AI-assisted: see docs/AI_LOG.md #3, #30, #31
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ActiveTripScreen from "../screens/ActiveTripScreen";
import TripSummaryScreen from "../screens/TripSummaryScreen";
import { useLanguage } from "../context/LanguageContext";

const Stack = createNativeStackNavigator();

// Trip flow: Inicio -> Viaje en curso -> Cobro y resumen.
// Inicio navigates by itself when the trip status changes (see HomeScreen).
// The driver cannot go back in the middle of a trip.
const tripScreenOptions = {
  headerBackVisible: false,
  gestureEnabled: false,
};

export default function TripStack() {
  const { t } = useLanguage();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Viaje en curso"
        component={ActiveTripScreen}
        options={{ ...tripScreenOptions, title: t("nav.tripInProgress") }}
      />
      <Stack.Screen
        name="Cobro y resumen"
        component={TripSummaryScreen}
        options={{ ...tripScreenOptions, title: t("nav.tripSummary") }}
      />
    </Stack.Navigator>
  );
}
