// AI-assisted: see docs/AI_LOG.md #6
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { validatePersonal } from "../utils/validators";
import { validateVehicle } from "../utils/vehicleValidators";

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

export function RegistrationProvider({ children }) {
  const [personal, setPersonal] = useState(initialPersonal);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [touched, setTouched] = useState({});

  const setPersonalField = useCallback((field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setVehicleField = useCallback((field, value) => {
    setVehicle((prev) => ({ ...prev, [field]: value }));
  }, []);

  const touchField = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const personalErrors = useMemo(() => validatePersonal(personal), [personal]);
  const vehicleErrors = useMemo(() => validateVehicle(vehicle), [vehicle]);

  const isPersonalValid = Object.keys(personalErrors).length === 0;
  const isVehicleValid = Object.keys(vehicleErrors).length === 0;

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
        touched,
        touchField,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => useContext(RegistrationContext);
