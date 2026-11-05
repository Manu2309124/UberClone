// AI-assisted: see docs/AI_LOG.md #9
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export function useDriverProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "drivers", user.uid),
      (snap) => {
        setProfile(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (error) => {
        console.log(error.code, error.message);
        setLoading(false);
      },
    );
    return unsubscribe; // cleanup
  }, [user]);

  return { profile, loading };
}
