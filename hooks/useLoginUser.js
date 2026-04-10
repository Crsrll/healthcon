import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export function useLoginUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();

      // Persistence
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Firebase Auth — must stay client-side
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Email verification
      if (!user.emailVerified) {
        await auth.signOut();
        setError("Please verify your email before logging in.");
        return { success: false, error: "Please verify your email before logging in." };
      }

      // Call API route for Firestore lookup
      const res = await fetch(`/api/user/getUser?uid=${user.uid}`);
      const json = await res.json();

      if (!res.ok) {
        await auth.signOut();
        setError(json.error || "Something went wrong.");
        return { success: false, error: json.error };
      }

      return {
        success: true,
        user,
        role: json.data.role,
        data: json.data,
      };

    } catch (err) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with that email."); break;
        case "auth/wrong-password":
          setError("Incorrect password."); break;
        case "auth/invalid-email":
          setError("Invalid email address."); break;
        case "auth/invalid-credential":
          setError("Invalid email or password."); break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later."); break;
        default:
          setError("Something went wrong. Please try again.");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
}