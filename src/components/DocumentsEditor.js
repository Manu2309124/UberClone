// AI-assisted: see docs/AI_LOG.md #29, #31
import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import FormField from "./FormField";
import DateField from "./DateField";
import ImagePickerField from "./ImagePickerField";
import { uploadImage } from "../services/uploadImage";
import {
  validateDocuments,
  requiresInspection,
} from "../utils/documentValidators";
import { useLanguage } from "../context/LanguageContext";

const toDate = (iso) => (iso ? new Date(iso) : null);
const isLocal = (uri) => Boolean(uri) && !uri.startsWith("http");

// Edit the driver's documents from Perfil, with the same validation as the
// registration. Only photos that changed are uploaded to Cloudinary again.
export default function DocumentsEditor({ uid, documents, vehicleYear }) {
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  // Accounts created before the Documents tab have no documents yet
  useEffect(() => {
    const d = documents ?? {};
    setValues({
      licenseNumber: d.licenseNumber ?? "",
      licensePhotoUri: d.licensePhotoUrl ?? null,
      licenseExpiry: toDate(d.licenseExpiry),
      soatPhotoUri: d.soatPhotoUrl ?? null,
      soatExpiry: toDate(d.soatExpiry),
      inspectionPhotoUri: d.inspectionPhotoUrl ?? null,
      inspectionExpiry: toDate(d.inspectionExpiry),
      mercadoPagoEmail: d.mercadoPagoEmail ?? "",
      acceptedTerms: true,
    });
  }, [documents]);

  if (!values) return null;

  const needsInspection = requiresInspection(vehicleYear);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const set = (field) => (value) => {
    setValues((v) => ({ ...v, [field]: value }));
    setMessage("");
  };

  const save = async () => {
    const found = validateDocuments(values, vehicleYear);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const upload = (uri, folder) =>
        isLocal(uri) ? uploadImage(uri, folder) : Promise.resolve(uri);
      const [licensePhotoUrl, soatPhotoUrl, inspectionPhotoUrl] =
        await Promise.all([
          upload(values.licensePhotoUri, "drivers/license"),
          upload(values.soatPhotoUri, "drivers/soat"),
          needsInspection
            ? upload(values.inspectionPhotoUri, "drivers/inspection")
            : Promise.resolve(null),
        ]);

      await updateDoc(doc(db, "drivers", uid), {
        "documents.licenseNumber": values.licenseNumber,
        "documents.licensePhotoUrl": licensePhotoUrl,
        "documents.licenseExpiry": values.licenseExpiry.toISOString(),
        "documents.soatPhotoUrl": soatPhotoUrl,
        "documents.soatExpiry": values.soatExpiry.toISOString(),
        "documents.inspectionPhotoUrl": inspectionPhotoUrl,
        "documents.inspectionExpiry": needsInspection
          ? values.inspectionExpiry.toISOString()
          : null,
        "documents.mercadoPagoEmail": values.mercadoPagoEmail.trim(),
        "documents.acceptedTerms": true,
        "documents.updatedAt": serverTimestamp(),
      });
      setMessage(t("docs.saved"));
    } catch (e) {
      console.log(e.code, e.message);
      setMessage(t("docs.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <FormField
        label={t("docs.licenseNumber")}
        value={values.licenseNumber}
        onChangeText={(v) => set("licenseNumber")(v.replace(/\D/g, ""))}
        keyboardType="number-pad"
        maxLength={15}
        error={errors.licenseNumber}
      />
      <ImagePickerField
        label={t("docs.licensePhoto")}
        uri={values.licensePhotoUri}
        onPick={set("licensePhotoUri")}
        error={errors.licensePhotoUri}
      />
      <DateField
        label={t("docs.licenseExpiry")}
        value={values.licenseExpiry}
        onChange={set("licenseExpiry")}
        minimumDate={tomorrow}
        error={errors.licenseExpiry}
      />

      <ImagePickerField
        label={t("docs.soatPhoto")}
        uri={values.soatPhotoUri}
        onPick={set("soatPhotoUri")}
        error={errors.soatPhotoUri}
      />
      <DateField
        label={t("docs.soatExpiry")}
        value={values.soatExpiry}
        onChange={set("soatExpiry")}
        minimumDate={tomorrow}
        error={errors.soatExpiry}
      />

      {needsInspection ? (
        <>
          <ImagePickerField
            label={t("docs.inspectionPhoto")}
            uri={values.inspectionPhotoUri}
            onPick={set("inspectionPhotoUri")}
            error={errors.inspectionPhotoUri}
          />
          <DateField
            label={t("docs.inspectionExpiry")}
            value={values.inspectionExpiry}
            onChange={set("inspectionExpiry")}
            minimumDate={tomorrow}
            error={errors.inspectionExpiry}
          />
        </>
      ) : (
        <Text style={styles.hint}>
          {t("docs.noInspection")}
        </Text>
      )}

      <FormField
        label={t("docs.mpEmail")}
        value={values.mercadoPagoEmail}
        onChangeText={set("mercadoPagoEmail")}
        keyboardType="email-address"
        error={errors.mercadoPagoEmail}
      />

      {saving ? (
        <ActivityIndicator />
      ) : (
        <Button title={t("docs.save")} onPress={save} />
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { color: "#666", marginBottom: 12 },
  message: { marginTop: 8, color: "#2e7d32" },
});
