// AI-assisted: see docs/AI_LOG.md #3
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaceholderScreen from "../components/PlaceholderScreen";
import RegisterTabs from "./RegisterTabs";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={PlaceholderScreen} />
      <Stack.Screen name="Registro" component={RegisterTabs} />
    </Stack.Navigator>
  );
}
