// AI-assisted: see docs/AI_LOG.md #21, #31
import { useState } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";
import FormField from "../components/FormField";
import { validateLogin, loginErrorKey } from "../utils/loginValidators";
import { useLanguage } from "../context/LanguageContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  // No navigation after login: AuthContext sees the new user and
  // RootNavigator switches to the Drawer on its own.
  const login = async () => {
    const found = validateLogin({ email, password });
    setErrors(found);
    setAuthError(null);
    setInfo(null);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setAuthError(loginErrorKey(e.code));
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const found = validateLogin({ email, password: "-" });
    setErrors(found);
    setAuthError(null);
    setInfo(null);
    if (found.email) return;
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("login.resetSent");
    } catch (e) {
      setAuthError(loginErrorKey(e.code));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>{t("login.title")}</Text>
      <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

      <FormField
        label={t("login.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email && t(errors.email)}
      />
      <FormField
        label={t("login.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        error={errors.password && t(errors.password)}
      />

      {authError ? <Text style={styles.error}>{t(authError)}</Text> : null}
      {info ? <Text style={styles.info}>{t(info)}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title={t("login.submit")} onPress={login} />
      )}

      <Pressable onPress={resetPassword} style={styles.link}>
        <Text style={styles.linkText}>{t("login.forgot")}</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("Registro")}
        style={styles.link}
      >
        <Text style={styles.linkText}>{t("login.register")}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 24 },
  error: { color: "#d32f2f", marginBottom: 12, textAlign: "center" },
  info: { color: "#2e7d32", marginBottom: 12, textAlign: "center" },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#1a73e8", fontSize: 15 },
});
