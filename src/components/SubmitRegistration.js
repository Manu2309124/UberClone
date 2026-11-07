// AI-assisted: see docs/AI_LOG.md #12
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
  } = useRegistration();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    isPersonalValid && isVehicleValid && isDocumentsValid && !loading;

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
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 12, borderTopWidth: 1, borderColor: "#ddd" },
  msg: { marginTop: 8, textAlign: "center" },
});
