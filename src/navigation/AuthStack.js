// AI-assisted: see docs/AI_LOG.md #3, #21
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterTabs from "./RegisterTabs";
import { useLanguage } from "../context/LanguageContext";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { t } = useLanguage();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro"
        component={RegisterTabs}
        options={{ title: t("nav.register") }}
      />
    </Stack.Navigator>
  );
}
