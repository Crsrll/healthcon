"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAuth, signOut } from "firebase/auth";
import { useLoginUser } from "@/hooks/useLoginUser";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { loginUser } = useLoginUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hc_user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password, rememberMe);

      if (!result.success) {
        setError(result.error || "Login failed.");
        return { success: false };
      }

      // Save user info in state and localStorage
      const userData = { uid: result.user.uid, role: result.role, ...result.data };
      setUser(userData);
      localStorage.setItem("hc_user", JSON.stringify(userData));

      Cookies.set("hc_user", JSON.stringify(userData), { expires: rememberMe ? 7 : null });

      return { success: true, user: userData };
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    localStorage.removeItem("hc_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}