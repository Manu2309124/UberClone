// AI-assisted: see docs/AI_LOG.md #6
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlaceholderScreen from "../components/PlaceholderScreen";
import PersonalDataScreen from "../screens/PersonalDataScreen";
import VehicleScreen from "../screens/VehicleScreen";
import { RegistrationProvider } from "../context/RegistrationContext";
import DocumentsScreen from "../screens/DocumentsScreen";

const Tab = createBottomTabNavigator();

export default function RegisterTabs() {
  return (
    <RegistrationProvider>
      <Tab.Navigator>
        <Tab.Screen name="Datos personales" component={PersonalDataScreen} />
        <Tab.Screen name="Vehículo" component={VehicleScreen} />

        <Tab.Screen name="Documentos" component={DocumentsScreen} />
      </Tab.Navigator>
    </RegistrationProvider>
  );
}
