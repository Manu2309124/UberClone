// AI-assisted: see docs/AI_LOG.md #19
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import FormField from "../components/FormField";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useAuth } from "../context/AuthContext";
import { validateProfileEdit } from "../utils/profileValidators";

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleDateString("es-CO") : "No aplica";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading } = useDriverProfile();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.personal.fullName);
      setPhone(profile.personal.phone);
    }
  }, [profile]);

  if (loading || !profile)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const { personal, vehicle, documents } = profile;

  const save = async () => {
    const e = validateProfileEdit({ fullName, phone });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    await updateDoc(doc(db, "drivers", user.uid), {
      "personal.fullName": fullName.trim(),
      "personal.phone": phone,
    });
    setMessage("Datos actualizados");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {personal.photoUrl ? (
        <Image source={{ uri: personal.photoUrl }} style={styles.photo} />
      ) : null}
      <Text style={styles.section}>Datos personales</Text>
      <FormField
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        maxLength={50}
        error={errors.fullName}
      />
      <FormField
        label="Celular"
        value={phone}
        onChangeText={(t) => setPhone(t.replace(/\D/g, ""))}
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.phone}
      />
      <Text>Correo: {personal.email}</Text>
      <Button title="Guardar cambios" onPress={save} />
      {message ? <Text style={styles.ok}>{message}</Text> : null}

      <Text style={styles.section}>Vehículo</Text>
      <Text>
        {vehicle.brand} {vehicle.model} ({vehicle.year}) · {vehicle.color}
      </Text>
      <Text>
        Placa: {vehicle.plate} · Categoría: {vehicle.category} · Capacidad:{" "}
        {vehicle.capacity}
      </Text>

      <Text style={styles.section}>Documentos</Text>
      <Text>Licencia vence: {fmt(documents?.licenseExpiry)}</Text>
      <Text>SOAT vence: {fmt(documents?.soatExpiry)}</Text>
      <Text>
        Revisión técnico-mecánica vence: {fmt(documents?.inspectionExpiry)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  photo: { width: 100, height: 100, borderRadius: 50, alignSelf: "center" },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
  ok: { color: "#2e7d32" },
});
