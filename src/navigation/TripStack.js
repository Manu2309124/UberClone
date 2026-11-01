// AI-assisted: see docs/AI_LOG.md #3
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaceholderScreen from "../components/PlaceholderScreen";

const Stack = createNativeStackNavigator();

export default function TripStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={PlaceholderScreen} />
      <Stack.Screen name="Solicitud entrante" component={PlaceholderScreen} />
      <Stack.Screen name="Viaje en curso" component={PlaceholderScreen} />
      <Stack.Screen name="Cobro y resumen" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
