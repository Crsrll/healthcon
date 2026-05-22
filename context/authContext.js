"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";        // ← remove getAuth
import { auth } from "@/lib/firebase";          // ← add this
import { useLoginUser } from "@/hooks/useLoginUser";
import { sendPasswordResetEmail } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { loginUser, loading, error } = useLoginUser(); // ✅ reuse hook state
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
      Cookies.set("hc_user", JSON.stringify(userData)); // session cookie
    }

    return { success: true, user: userData };
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
      await signOut(auth);  // ← use imported auth, not getAuth()
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    localStorage.removeItem("hc_user");
    Cookies.remove("hc_user");
  };

  return (
  <AuthContext.Provider value={{ 
    user, 
    setUser,  // ← Add this
    login, 
    logout, 
    resetPassword, 
    loading, 
    error 
  }}>
    {children}
  </AuthContext.Provider>
);
  }
