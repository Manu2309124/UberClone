// AI-assisted: see docs/AI_LOG.md #3
import { createDrawerNavigator } from "@react-navigation/drawer";
import PlaceholderScreen from "../components/PlaceholderScreen";
import TripStack from "./TripStack";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Viajes" component={TripStack} />
      <Drawer.Screen name="Perfil" component={PlaceholderScreen} />
      <Drawer.Screen name="Historial" component={PlaceholderScreen} />
      <Drawer.Screen name="Ganancias" component={PlaceholderScreen} />
      <Drawer.Screen name="Configuración" component={PlaceholderScreen} />
    </Drawer.Navigator>
  );
}
