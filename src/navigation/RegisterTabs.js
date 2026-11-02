// AI-assisted: see docs/AI_LOG.md #5
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlaceholderScreen from "../components/PlaceholderScreen";
import PersonalDataScreen from "../screens/PersonalDataScreen";
import { RegistrationProvider } from "../context/RegistrationContext";

const Tab = createBottomTabNavigator();

export default function RegisterTabs() {
  return (
    <RegistrationProvider>
      <Tab.Navigator>
        <Tab.Screen name="Datos personales" component={PersonalDataScreen} />
        <Tab.Screen name="Vehículo" component={PlaceholderScreen} />
        <Tab.Screen name="Documentos" component={PlaceholderScreen} />
      </Tab.Navigator>
    </RegistrationProvider>
  );
}
