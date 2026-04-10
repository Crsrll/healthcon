import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

export function useRegisterPatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerPatient = async (form) => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();

      // Firebase Auth — client-side only
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Update display name — client-side only
      await updateProfile(user, {
        displayName: `${form.firstName} ${form.middleInitial} ${form.lastName}`,
      });

      // Send verification email — client-side only
      await sendEmailVerification(user);

      // Save to Firestore via API route
      const res = await fetch("/api/patients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          firstName: form.firstName,
          middleInitial: form.middleInitial,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to save patient data.");
        return { success: false };
      }

      return { success: true };

    } catch (err) {
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