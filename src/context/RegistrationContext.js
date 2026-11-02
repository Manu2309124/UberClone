// AI-assisted: see docs/AI_LOG.md #5
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { validatePersonal } from "../utils/validators";

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

export function RegistrationProvider({ children }) {
  const [personal, setPersonal] = useState(initialPersonal);
  const [touched, setTouched] = useState({});

  const setPersonalField = useCallback((field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  }, []);

  const touchField = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const personalErrors = useMemo(() => validatePersonal(personal), [personal]);
  const isPersonalValid = Object.keys(personalErrors).length === 0;

  return (
    <RegistrationContext.Provider
      value={{
        personal,
        setPersonalField,
        touched,
        touchField,
        personalErrors,
        isPersonalValid,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => useContext(RegistrationContext);
