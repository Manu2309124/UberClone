// AI-assisted: see docs/AI_LOG.md #18
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "../screens/HistoryScreen";
import TripDetailScreen from "../screens/TripDetailScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaViajes" component={HistoryScreen} />
      <Stack.Screen name="DetalleViaje" component={TripDetailScreen} />
    </Stack.Navigator>
  );
}
