import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export function useRegisterPatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerPatient = async (form) => {
    setError("");
    setLoading(true);
    try {
      const auth = getAuth();

      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;

      // 2. Update display name in Auth
      await updateProfile(userCredential.user, {
        displayName: `${form.firstName} ${form.middleInitial} ${form.lastName}`,
      });

      // 3. Save full details to Firestore
      await addDoc(collection(db, "patients"), {
        uid,
        firstName: form.firstName,
        middleInitial: form.middleInitial,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        role: "patient",
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { registerPatient, loading, error };
}