// AI-assisted: see docs/AI_LOG.md #11
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import PersonalDataScreen from "../screens/PersonalDataScreen";
import VehicleScreen from "../screens/VehicleScreen";
import SubmitRegistration from "../components/SubmitRegistration";
import { RegistrationProvider } from "../context/RegistrationContext";

const Tab = createBottomTabNavigator();

// Icon name for each tab: filled when active, outline when inactive
const ICONS = {
  "Datos personales": { active: "person", inactive: "person-outline" },
  Vehículo: { active: "car", inactive: "car-outline" },
};

export default function RegisterTabs() {
  return (
    <RegistrationProvider>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const icon = ICONS[route.name];
              return (
                <Ionicons
                  name={focused ? icon.active : icon.inactive}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: "#1a73e8",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Datos personales" component={PersonalDataScreen} />
          <Tab.Screen name="Vehículo" component={VehicleScreen} />
        </Tab.Navigator>
        <SubmitRegistration />
      </View>
    </RegistrationProvider>
  );
}
