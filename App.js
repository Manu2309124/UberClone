import "react-native-gesture-handler";
// AI-assisted: see docs/AI_LOG.md #24
import { AuthProvider } from "./src/context/AuthContext";
import { ActiveTripProvider } from "./src/context/ActiveTripContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <ActiveTripProvider>
        <RootNavigator />
      </ActiveTripProvider>
    </AuthProvider>
  );
}
