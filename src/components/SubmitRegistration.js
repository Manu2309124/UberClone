// AI-assisted: see docs/AI_LOG.md #12, #26
import { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRegistration } from "../context/RegistrationContext";
import { registerDriver } from "../services/registerDriver";

export default function SubmitRegistration() {
  const {
    personal,
    vehicle,
    documents,
    isPersonalValid,
    isVehicleValid,
    isDocumentsValid,
    personalErrors,
    vehicleErrors,
    documentErrors,
  } = useRegistration();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    isPersonalValid && isVehicleValid && isDocumentsValid && !loading;

  // Errors only show under a field after it is touched, so list here what is
  // still missing in each tab; otherwise a skipped field blocks the button
  // without saying why.
  const missing = [
    ["Datos personales", personalErrors],
    ["Vehículo", vehicleErrors],
    ["Documentos", documentErrors],
  ].filter(([, errors]) => Object.keys(errors).length > 0);

  const onSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      await registerDriver(personal, vehicle, documents);
      setMessage("Registro enviado. Tu cuenta está pendiente de aprobación.");
    } catch (e) {
      if (e.code === "auth/email-already-in-use")
        setMessage("Ese correo ya está registrado");
      else setMessage("No se pudo enviar el registro. Intenta de nuevo.");
      console.log(e.code, e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.box}>
      {loading ? <ActivityIndicator /> : null}
      <Button
        title="Enviar registro"
        onPress={onSubmit}
        disabled={!canSubmit}
      />
      {message ? <Text style={styles.msg}>{message}</Text> : null}
      {!loading && missing.length > 0 ? (
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Para enviar, falta:</Text>
          {missing.map(([tab, errors]) => (
            <Text key={tab} style={styles.missingText}>
              • {tab}: {Object.values(errors).join(", ")}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 12, borderTopWidth: 1, borderColor: "#ddd" },
  msg: { marginTop: 8, textAlign: "center" },
  missing: { marginTop: 8 },
  missingTitle: { fontWeight: "600", color: "#d32f2f" },
  missingText: { color: "#d32f2f", fontSize: 13 },
});
