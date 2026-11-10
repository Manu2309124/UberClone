// AI-assisted: see docs/AI_LOG.md #18
import { createDrawerNavigator } from "@react-navigation/drawer";
import PlaceholderScreen from "../components/PlaceholderScreen";
import EarningsScreen from "../screens/EarningsScreen";
import TripStack from "./TripStack";
import HistoryStack from "./HistoryStack";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Viajes" component={TripStack} />
      <Drawer.Screen name="Perfil" component={PlaceholderScreen} />
      <Drawer.Screen name="Historial" component={HistoryStack} />
      <Drawer.Screen name="Ganancias" component={EarningsScreen} />
      <Drawer.Screen name="Configuración" component={PlaceholderScreen} />
    </Drawer.Navigator>
  );
}
