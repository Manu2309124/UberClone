// AI-assisted: see docs/AI_LOG.md #3
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlaceholderScreen from "../components/PlaceholderScreen";

const Tab = createBottomTabNavigator();

export default function RegisterTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Datos personales" component={PlaceholderScreen} />
      <Tab.Screen name="Vehículo" component={PlaceholderScreen} />
      <Tab.Screen name="Documentos" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}
