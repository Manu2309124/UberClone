// AI-assisted: see docs/AI_LOG.md #10
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { uploadImage } from "./uploadImage";

// Uploads the photos, creates the Auth user and saves the driver profile.
// The password goes only to Firebase Auth, never to Firestore.
export async function registerDriver(personal, vehicle) {
  // 1. Upload photos first: if this fails, no account is left half-created
  const [photoUrl, vehiclePhotoUrl] = await Promise.all([
    uploadImage(personal.photoUri, "drivers/profile"),
    uploadImage(vehicle.vehiclePhotoUri, "drivers/vehicle"),
  ]);

  // 2. Create the Auth user
  const email = personal.email.trim();
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    personal.password,
  );
  const uid = cred.user.uid;

  // 3. Save the profile in Firestore
  await setDoc(doc(db, "drivers", uid), {
    uid,
    status: "pending", // pending | approved
    personal: {
      fullName: personal.fullName.trim(),
      idNumber: personal.idNumber,
      phone: personal.phone,
      birthDate: personal.birthDate.toISOString(),
      gender: personal.gender,
      email,
      language: personal.language,
      photoUrl,
    },
    vehicle: {
      category: vehicle.category,
      plate: vehicle.plate.trim().toUpperCase(),
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: Number(vehicle.year),
      color: vehicle.color,
      capacity: Number(vehicle.capacity),
      vehiclePhotoUrl,
    },
    createdAt: serverTimestamp(),
  });

  return uid;
}
