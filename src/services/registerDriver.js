// AI-assisted: see docs/AI_LOG.md #12
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { uploadImage } from "./uploadImage";
import { requiresInspection } from "../utils/documentValidators";

// Uploads photos first (no half-created accounts), then creates the Auth user
// and saves the profile. The password only goes to Firebase Auth.
export async function registerDriver(personal, vehicle, documents) {
  const needsInspection = requiresInspection(vehicle.year);

  const [
    photoUrl,
    vehiclePhotoUrl,
    licensePhotoUrl,
    soatPhotoUrl,
    inspectionPhotoUrl,
  ] = await Promise.all([
    uploadImage(personal.photoUri, "drivers/profile"),
    uploadImage(vehicle.vehiclePhotoUri, "drivers/vehicle"),
    uploadImage(documents.licensePhotoUri, "drivers/license"),
    uploadImage(documents.soatPhotoUri, "drivers/soat"),
    needsInspection
      ? uploadImage(documents.inspectionPhotoUri, "drivers/inspection")
      : Promise.resolve(null),
  ]);

  const email = personal.email.trim();
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    personal.password,
  );
  const uid = cred.user.uid;

  await setDoc(doc(db, "drivers", uid), {
    uid,
    status: "pending",
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
    documents: {
      licenseNumber: documents.licenseNumber,
      licensePhotoUrl,
      licenseExpiry: documents.licenseExpiry.toISOString(),
      soatPhotoUrl,
      soatExpiry: documents.soatExpiry.toISOString(),
      inspectionPhotoUrl,
      inspectionExpiry: needsInspection
        ? documents.inspectionExpiry.toISOString()
        : null,
      mercadoPagoEmail: documents.mercadoPagoEmail.trim(),
      acceptedTerms: true,
    },
    createdAt: serverTimestamp(),
  });

  return uid;
}
