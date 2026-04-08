import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useRegisterClinic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerClinic = async ({
    clinicName,
    phone,
    email,
    ltoNumber,
    password,
    confirmPassword,
  }) => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();

      // 🔒 Basic validation
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

      // ✅ Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Save to Firestore (single users collection)
      await setDoc(doc(db, "users", user.uid), {
        clinicName,
        phone,
        email,
        ltoNumber,
        role: "clinic",
        aprroved: "false",
        createdAt: serverTimestamp(),
      });

      // ✅ Send email verification
      await sendEmailVerification(user);

      return { success: true };

    } catch (err) {
      console.error("Register clinic error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    registerClinic,
    loading,
    error,
  };
}