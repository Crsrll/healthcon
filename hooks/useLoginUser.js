import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useLoginUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();

      // Set persistence
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Authenticate
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Email verification
      if (!user.emailVerified) {
        await auth.signOut();
        setError("Please verify your email before logging in.");
        return { success: false };
      }

      // Get user data
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await auth.signOut();
        setError("User record not found.");
        return { success: false };
      }

      const userData = userDocSnap.data();
      const role = userData.role;

      if (!role) {
        await auth.signOut();
        setError("User role is not defined.");
        return { success: false };
      }

      if (role === "clinic" && !userData.approved) {
        await auth.signOut();
        setError("Your clinic account is pending admin approval.");
        return { success: false };
      }

      // ✅ Return role for routing
      return {
        success: true,
        user,
        role,
        data: userData,
      };

    } catch (err) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with that email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
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
    loginUser,
    loading,
    error,
  };
}