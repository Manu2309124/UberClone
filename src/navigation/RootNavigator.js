// AI-assisted: see docs/AI_LOG.md #3
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
