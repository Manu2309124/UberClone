// AI-assisted: see docs/AI_LOG.md #19, #31
import { createDrawerNavigator } from "@react-navigation/drawer";
import EarningsScreen from "../screens/EarningsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TripStack from "./TripStack";
import HistoryStack from "./HistoryStack";
import { useLanguage } from "../context/LanguageContext";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  const { t } = useLanguage();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Viajes"
        component={TripStack}
        options={{ title: t("nav.trips") }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: t("nav.profile") }}
      />
      <Drawer.Screen
        name="Historial"
        component={HistoryStack}
        options={{ title: t("nav.history") }}
      />
      <Drawer.Screen
        name="Ganancias"
        component={EarningsScreen}
        options={{ title: t("nav.earnings") }}
      />
      <Drawer.Screen
        name="Configuración"
        component={SettingsScreen}
        options={{ title: t("nav.settings") }}
      />
    </Drawer.Navigator>
  );
}
