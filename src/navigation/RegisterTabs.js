// AI-assisted: see docs/AI_LOG.md #8
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PersonalDataScreen from "../screens/PersonalDataScreen";
import VehicleScreen from "../screens/VehicleScreen";
import SubmitRegistration from "../components/SubmitRegistration";
import { RegistrationProvider } from "../context/RegistrationContext";

const Tab = createBottomTabNavigator();

export default function RegisterTabs() {
  return (
    <RegistrationProvider>
      <View style={{ flex: 1 }}>
        <Tab.Navigator>
          <Tab.Screen name="Datos personales" component={PersonalDataScreen} />
          <Tab.Screen name="Vehículo" component={VehicleScreen} />
        </Tab.Navigator>
        <SubmitRegistration />
      </View>
    </RegistrationProvider>
  );
}
