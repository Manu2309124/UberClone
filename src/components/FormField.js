// AI-assisted: see docs/AI_LOG.md #5
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function FormField({ label, error, ...inputProps }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        autoCapitalize="none"
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputError: { borderColor: "#d32f2f" },
  error: { color: "#d32f2f", marginTop: 4, fontSize: 13 },
});
