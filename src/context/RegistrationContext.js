// AI-assisted: see docs/AI_LOG.md #7
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { validatePersonal } from "../utils/validators";
import { validateVehicle } from "../utils/vehicleValidators";
import { validateDocuments } from "../utils/documentValidators";

const RegistrationContext = createContext(null);

const initialPersonal = {
  photoUri: null,
  fullName: "",
  idNumber: "",
  phone: "",
  birthDate: null,
  gender: "",
  email: "",
  language: "es",
  password: "",
  confirmPassword: "",
};

const initialVehicle = {
  category: "",
  plate: "",
  brand: "",
  model: "",
  year: "",
  color: "",
  capacity: "",
  vehiclePhotoUri: null,
};

const initialDocuments = {
  licenseNumber: "",
  licensePhotoUri: null,
  licenseExpiry: null,
  soatPhotoUri: null,
  soatExpiry: null,
  inspectionPhotoUri: null,
  inspectionExpiry: null,
  mercadoPagoEmail: "",
  acceptedTerms: false,
};

export function RegistrationProvider({ children }) {
  const [personal, setPersonal] = useState(initialPersonal);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [documents, setDocuments] = useState(initialDocuments);
  const [touched, setTouched] = useState({});

  const setPersonalField = useCallback((field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setVehicleField = useCallback((field, value) => {
    setVehicle((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setDocumentField = useCallback((field, value) => {
    setDocuments((prev) => ({ ...prev, [field]: value }));
  }, []);

  const touchField = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const personalErrors = useMemo(() => validatePersonal(personal), [personal]);
  const vehicleErrors = useMemo(() => validateVehicle(vehicle), [vehicle]);
  // The inspection requirement depends on the vehicle year (tab 2)
  const documentErrors = useMemo(
    () => validateDocuments(documents, vehicle.year),
    [documents, vehicle.year],
  );

  const isPersonalValid = Object.keys(personalErrors).length === 0;
  const isVehicleValid = Object.keys(vehicleErrors).length === 0;
  const isDocumentsValid = Object.keys(documentErrors).length === 0;

  return (
    <RegistrationContext.Provider
      value={{
        personal,
        setPersonalField,
        personalErrors,
        isPersonalValid,
        vehicle,
        setVehicleField,
        vehicleErrors,
        isVehicleValid,
        documents,
        setDocumentField,
        documentErrors,
        isDocumentsValid,
        touched,
        touchField,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => useContext(RegistrationContext);
