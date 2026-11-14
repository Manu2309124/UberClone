// AI-assisted: see docs/AI_LOG.md #7
import { useState } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguage } from "../context/LanguageContext";

export default function DateField({
  label,
  value,
  error,
  onChange,
  minimumDate,
}) {
  const [show, setShow] = useState(false);
  const { t, locale } = useLanguage();

  const handleChange = (event, selected) => {
    if (Platform.OS === "android") setShow(false);
    if (event.type === "set" && selected) onChange(selected);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Button
        title={value ? value.toLocaleDateString(locale) : t("field.selectDate")}
        onPress={() => setShow(true)}
      />
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 4 },
  error: { color: "#d32f2f", marginTop: 4, fontSize: 13 },
});
