import "react-native-gesture-handler";
// AI-assisted: see docs/AI_LOG.md #24, #31
import { AuthProvider } from "./src/context/AuthContext";
import { ActiveTripProvider } from "./src/context/ActiveTripContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ActiveTripProvider>
          <RootNavigator />
        </ActiveTripProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
