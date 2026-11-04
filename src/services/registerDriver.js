// AI-assisted: see docs/AI_LOG.md #8
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Creates the Auth user and saves the driver profile in Firestore.
// The password goes only to Firebase Auth, never to Firestore.
export async function registerDriver(personal, vehicle) {
  const email = personal.email.trim();
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    personal.password,
  );
  const uid = cred.user.uid;

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
      photoUri: personal.photoUri, // local for now; Cloudinary URL later
    },
    vehicle: {
      category: vehicle.category,
      plate: vehicle.plate.trim().toUpperCase(),
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: Number(vehicle.year),
      color: vehicle.color,
      capacity: Number(vehicle.capacity),
      vehiclePhotoUri: vehicle.vehiclePhotoUri, // local for now
    },
    createdAt: serverTimestamp(),
  });

  return uid;
}
