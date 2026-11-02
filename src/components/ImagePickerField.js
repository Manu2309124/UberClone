// AI-assisted: see docs/AI_LOG.md #5
import { View, Text, Image, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerField({ label, uri, error, onPick }) {
  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : null}
      <View style={styles.row}>
        <Button title="Cámara" onPress={pickFromCamera} />
        <Button title="Galería" onPress={pickFromGallery} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14, alignItems: "center" },
  label: { fontWeight: "600", marginBottom: 8 },
  preview: { width: 120, height: 120, borderRadius: 60, marginBottom: 8 },
  row: { flexDirection: "row", gap: 16 },
  error: { color: "#d32f2f", marginTop: 4, fontSize: 13 },
});
