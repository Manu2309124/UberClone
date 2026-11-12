// AI-assisted: see docs/AI_LOG.md #19, #29, #31
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
import DocumentsEditor from "../components/DocumentsEditor";
import { useLanguage } from "../context/LanguageContext";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useAuth } from "../context/AuthContext";
import { validateProfileEdit } from "../utils/profileValidators";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading } = useDriverProfile();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

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
    setMessage(t("profile.saved"));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {personal.photoUrl ? (
        <Image source={{ uri: personal.photoUrl }} style={styles.photo} />
      ) : null}
      <Text style={styles.section}>{t("profile.personal")}</Text>
      <FormField
        label={t("profile.fullName")}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        maxLength={50}
        error={errors.fullName}
      />
      <FormField
        label={t("profile.phone")}
        value={phone}
        onChangeText={(v) => setPhone(v.replace(/\D/g, ""))}
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.phone}
      />
      <Text>{t("profile.email", { email: personal.email })}</Text>
      <Button title={t("profile.save")} onPress={save} />
      {message ? <Text style={styles.ok}>{message}</Text> : null}

      <Text style={styles.section}>{t("profile.vehicle")}</Text>
      <Text>
        {vehicle.brand} {vehicle.model} ({vehicle.year}) ·{" "}
        {t(`color.${vehicle.color}`)}
      </Text>
      <Text>
        {t("profile.plate", {
          plate: vehicle.plate,
          category: t(`category.${vehicle.category}`),
          capacity: vehicle.capacity,
        })}
      </Text>

      <Text style={styles.section}>{t("profile.documents")}</Text>
      <DocumentsEditor
        uid={user.uid}
        documents={documents}
        vehicleYear={vehicle.year}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  photo: { width: 100, height: 100, borderRadius: 50, alignSelf: "center" },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
  ok: { color: "#2e7d32" },
});
