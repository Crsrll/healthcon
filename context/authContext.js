"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useLoginUser } from "@/hooks/useLoginUser";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { loginUser, loading, error } = useLoginUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hc_user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const result = await loginUser(email, password, rememberMe);
    if (!result.success) return { success: false };

    const userData = { uid: result.user.uid, role: result.role, ...result.data };
    setUser(userData);
    localStorage.setItem("hc_user", JSON.stringify(userData));

    if (rememberMe) {
      Cookies.set("hc_user", JSON.stringify(userData), { expires: 7 });
    } else {
      Cookies.set("hc_user", JSON.stringify(userData));
    }

    return { success: true, user: userData };
  };

  const refreshUser = async () => {
    if (!user?.uid) return;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const updated = { uid: user.uid, role: user.role, ...snap.data() };
        setUser(updated);
        localStorage.setItem("hc_user", JSON.stringify(updated));
        Cookies.set("hc_user", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    localStorage.removeItem("hc_user");
    Cookies.remove("hc_user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, resetPassword, refreshUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}