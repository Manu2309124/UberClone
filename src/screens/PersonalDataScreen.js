// AI-assisted: see docs/AI_LOG.md #5
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import FormField from "../components/FormField";
import ImagePickerField from "../components/ImagePickerField";
import { useRegistration } from "../context/RegistrationContext";

export default function PersonalDataScreen() {
  const { personal, setPersonalField, touched, touchField, personalErrors } =
    useRegistration();
  const [showDate, setShowDate] = useState(false);

  const err = (field) => (touched[field] ? personalErrors[field] : undefined);

  const update = (field) => (value) => setPersonalField(field, value);
  const onlyDigits = (field) => (text) =>
    setPersonalField(field, text.replace(/\D/g, ""));

  const onDateChange = (event, selected) => {
    if (Platform.OS === "android") setShowDate(false);
    if (event.type === "set" && selected)
      setPersonalField("birthDate", selected);
    touchField("birthDate");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ImagePickerField
        label="Foto de perfil"
        uri={personal.photoUri}
        error={err("photoUri")}
        onPick={(uri) => {
          setPersonalField("photoUri", uri);
          touchField("photoUri");
        }}
      />

      <FormField
        label="Nombre completo"
        value={personal.fullName}
        onChangeText={update("fullName")}
        onBlur={() => touchField("fullName")}
        maxLength={50}
        autoCapitalize="words"
        error={err("fullName")}
      />

      <FormField
        label="Documento de identidad"
        value={personal.idNumber}
        onChangeText={onlyDigits("idNumber")}
        onBlur={() => touchField("idNumber")}
        keyboardType="numeric"
        maxLength={10}
        error={err("idNumber")}
      />

      <FormField
        label="Número de celular"
        value={personal.phone}
        onChangeText={onlyDigits("phone")}
        onBlur={() => touchField("phone")}
        keyboardType="phone-pad"
        maxLength={10}
        error={err("phone")}
      />

      <View style={styles.block}>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <Button
          title={
            personal.birthDate
              ? personal.birthDate.toLocaleDateString("es-CO")
              : "Seleccionar fecha"
          }
          onPress={() => setShowDate(true)}
        />
        {showDate && (
          <DateTimePicker
            value={personal.birthDate || new Date(2000, 0, 1)}
            mode="date"
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}
        {err("birthDate") ? (
          <Text style={styles.error}>{err("birthDate")}</Text>
        ) : null}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Género</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={personal.gender}
            onValueChange={(v) => {
              setPersonalField("gender", v);
              touchField("gender");
            }}
          >
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Femenino" value="female" />
            <Picker.Item label="Masculino" value="male" />
            <Picker.Item label="Otro" value="other" />
            <Picker.Item label="Prefiero no decir" value="undisclosed" />
          </Picker>
        </View>
        {err("gender") ? (
          <Text style={styles.error}>{err("gender")}</Text>
        ) : null}
      </View>

      <FormField
        label="Correo electrónico"
        value={personal.email}
        onChangeText={update("email")}
        onBlur={() => touchField("email")}
        keyboardType="email-address"
        error={err("email")}
      />

      <View style={styles.block}>
        <Text style={styles.label}>Idioma</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={personal.language}
            onValueChange={(v) => {
              setPersonalField("language", v);
              touchField("language");
            }}
          >
            <Picker.Item label="Español" value="es" />
            <Picker.Item label="English" value="en" />
          </Picker>
        </View>
        {err("language") ? (
          <Text style={styles.error}>{err("language")}</Text>
        ) : null}
      </View>

      <FormField
        label="Contraseña"
        value={personal.password}
        onChangeText={update("password")}
        onBlur={() => touchField("password")}
        secureTextEntry
        error={err("password")}
      />

      <FormField
        label="Confirmar contraseña"
        value={personal.confirmPassword}
        onChangeText={update("confirmPassword")}
        onBlur={() => touchField("confirmPassword")}
        secureTextEntry
        error={err("confirmPassword")}
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
