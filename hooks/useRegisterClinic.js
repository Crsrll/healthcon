import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export function useRegisterClinic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerClinic = async ({ clinicName, phone, email, ltoNumber, password, confirmPassword }) => {
    setLoading(true);
    setError("");

    try {
      if (!clinicName || !phone || !email || !ltoNumber || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return { success: false };
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return { success: false };
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return { success: false };
      }

      const auth = getAuth();

      // Firebase Auth — client-side only
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save to Firestore via API route
      const res = await fetch("/api/clinics/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, clinicName, phone, email, ltoNumber }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to save clinic data.");
        return { success: false };
      }

      // Send verification email — client-side only
      await sendEmailVerification(user);

      return { success: true };

    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email is already registered."); break;
        case "auth/invalid-email":
          setError("Invalid email address."); break;
        case "auth/weak-password":
          setError("Password is too weak."); break;
        default:
          setError("Something went wrong. Please try again.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { registerClinic, loading, error };
}