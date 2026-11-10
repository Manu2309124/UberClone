// AI-assisted: see docs/AI_LOG.md #19
import { createDrawerNavigator } from "@react-navigation/drawer";
import EarningsScreen from "../screens/EarningsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TripStack from "./TripStack";
import HistoryStack from "./HistoryStack";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Viajes" component={TripStack} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Historial" component={HistoryStack} />
      <Drawer.Screen name="Ganancias" component={EarningsScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
