// AI-assisted: see docs/AI_LOG.md #7
import { ScrollView, View, Text, Switch, StyleSheet } from "react-native";
import FormField from "../components/FormField";
import ImagePickerField from "../components/ImagePickerField";
import DateField from "../components/DateField";
import { useRegistration } from "../context/RegistrationContext";
import { requiresInspection } from "../utils/documentValidators";
import { PRICING } from "../config/pricing";

export default function DocumentsScreen() {
  const {
    documents,
    setDocumentField,
    documentErrors,
    vehicle,
    touched,
    touchField,
  } = useRegistration();

  const err = (field) => (touched[field] ? documentErrors[field] : undefined);
  const pickPhoto = (field) => (uri) => {
    setDocumentField(field, uri);
    touchField(field);
  };
  const pickDate = (field) => (date) => {
    setDocumentField(field, date);
    touchField(field);
  };

  const needsInspection = requiresInspection(vehicle.year);
  const commissionPercent = Math.round(PRICING.commissionRate * 100);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.section}>Licencia de conducción</Text>
      <FormField
        label="Número de licencia"
        value={documents.licenseNumber}
        onChangeText={(t) =>
          setDocumentField("licenseNumber", t.replace(/\D/g, ""))
        }
        onBlur={() => touchField("licenseNumber")}
        keyboardType="numeric"
        maxLength={15}
        error={err("licenseNumber")}
      />
      <ImagePickerField
        label="Foto de la licencia"
        uri={documents.licensePhotoUri}
        error={err("licensePhotoUri")}
        onPick={pickPhoto("licensePhotoUri")}
      />
      <DateField
        label="Vencimiento de la licencia"
        value={documents.licenseExpiry}
        error={err("licenseExpiry")}
        onChange={pickDate("licenseExpiry")}
        minimumDate={tomorrow}
      />

      <Text style={styles.section}>SOAT</Text>
      <ImagePickerField
        label="Foto del SOAT"
        uri={documents.soatPhotoUri}
        error={err("soatPhotoUri")}
        onPick={pickPhoto("soatPhotoUri")}
      />
      <DateField
        label="Vencimiento del SOAT"
        value={documents.soatExpiry}
        error={err("soatExpiry")}
        onChange={pickDate("soatExpiry")}
        minimumDate={tomorrow}
      />

      <Text style={styles.section}>Revisión técnico-mecánica</Text>
      {needsInspection ? (
        <>
          <ImagePickerField
            label="Foto de la revisión"
            uri={documents.inspectionPhotoUri}
            error={err("inspectionPhotoUri")}
            onPick={pickPhoto("inspectionPhotoUri")}
          />
          <DateField
            label="Vencimiento de la revisión"
            value={documents.inspectionExpiry}
            error={err("inspectionExpiry")}
            onChange={pickDate("inspectionExpiry")}
            minimumDate={tomorrow}
          />
        </>
      ) : (
        <Text style={styles.note}>
          No aplica: tu vehículo tiene menos de 5 años.
        </Text>
      )}

      <Text style={styles.section}>Pagos</Text>
      <FormField
        label="Correo de tu cuenta de Mercado Pago"
        value={documents.mercadoPagoEmail}
        onChangeText={(t) => setDocumentField("mercadoPagoEmail", t)}
        onBlur={() => touchField("mercadoPagoEmail")}
        keyboardType="email-address"
        error={err("mercadoPagoEmail")}
      />

      <View style={styles.termsRow}>
        <Switch
          value={documents.acceptedTerms}
          onValueChange={(v) => {
            setDocumentField("acceptedTerms", v);
            touchField("acceptedTerms");
          }}
        />
        <Text style={styles.termsText}>
          Acepto los términos y la comisión de la plataforma del{" "}
          {commissionPercent} % sobre cada viaje.
        </Text>
      </View>
      {err("acceptedTerms") ? (
        <Text style={styles.error}>{err("acceptedTerms")}</Text>
      ) : null}

      <Text style={styles.note}>
        No se guardan números de cuenta ni de tarjeta: los datos sensibles los
        maneja la pasarela de pago.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 8, marginBottom: 10 },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  termsText: { flex: 1 },
  note: { color: "#666", marginVertical: 8 },
  error: { color: "#d32f2f", marginTop: 4, fontSize: 13 },
});
