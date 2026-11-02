// AI-assisted: see docs/AI_LOG.md #6
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import FormField from "../components/FormField";
import ImagePickerField from "../components/ImagePickerField";
import { useRegistration } from "../context/RegistrationContext";

const COLORS = [
  { label: "Blanco", value: "white" },
  { label: "Negro", value: "black" },
  { label: "Gris", value: "gray" },
  { label: "Plateado", value: "silver" },
  { label: "Rojo", value: "red" },
  { label: "Azul", value: "blue" },
  { label: "Verde", value: "green" },
  { label: "Amarillo", value: "yellow" },
  { label: "Otro", value: "other" },
];

export default function VehicleScreen() {
  const { vehicle, setVehicleField, touched, touchField, vehicleErrors } =
    useRegistration();

  const err = (field) => (touched[field] ? vehicleErrors[field] : undefined);
  const update = (field) => (value) => setVehicleField(field, value);
  const onlyDigits = (field) => (text) =>
    setVehicleField(field, text.replace(/\D/g, ""));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.block}>
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={vehicle.category}
            onValueChange={(v) => {
              setVehicleField("category", v);
              touchField("category");
            }}
          >
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Económico" value="economy" />
            <Picker.Item label="XL" value="xl" />
            <Picker.Item label="Premium" value="premium" />
          </Picker>
        </View>
        {err("category") ? (
          <Text style={styles.error}>{err("category")}</Text>
        ) : null}
      </View>

      <FormField
        label="Placa (ejemplo: ABC123)"
        value={vehicle.plate}
        onChangeText={(t) => setVehicleField("plate", t.toUpperCase())}
        onBlur={() => touchField("plate")}
        autoCapitalize="characters"
        maxLength={6}
        error={err("plate")}
      />

      <FormField
        label="Marca"
        value={vehicle.brand}
        onChangeText={update("brand")}
        onBlur={() => touchField("brand")}
        autoCapitalize="words"
        maxLength={30}
        error={err("brand")}
      />

      <FormField
        label="Modelo"
        value={vehicle.model}
        onChangeText={update("model")}
        onBlur={() => touchField("model")}
        autoCapitalize="words"
        maxLength={30}
        error={err("model")}
      />

      <FormField
        label="Año"
        value={vehicle.year}
        onChangeText={onlyDigits("year")}
        onBlur={() => touchField("year")}
        keyboardType="numeric"
        maxLength={4}
        error={err("year")}
      />

      <View style={styles.block}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={vehicle.color}
            onValueChange={(v) => {
              setVehicleField("color", v);
              touchField("color");
            }}
          >
            <Picker.Item label="Selecciona..." value="" />
            {COLORS.map((c) => (
              <Picker.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Picker>
        </View>
        {err("color") ? <Text style={styles.error}>{err("color")}</Text> : null}
      </View>

      <FormField
        label="Capacidad de pasajeros"
        value={vehicle.capacity}
        onChangeText={onlyDigits("capacity")}
        onBlur={() => touchField("capacity")}
        keyboardType="numeric"
        maxLength={2}
        error={err("capacity")}
      />

      <ImagePickerField
        label="Foto del vehículo (la placa debe verse)"
        uri={vehicle.vehiclePhotoUri}
        error={err("vehiclePhotoUri")}
        onPick={(uri) => {
          setVehicleField("vehiclePhotoUri", uri);
          touchField("vehiclePhotoUri");
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  block: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 4 },
  pickerBox: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8 },
  error: { color: "#d32f2f", marginTop: 4, fontSize: 13 },
});
