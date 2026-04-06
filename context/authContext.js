"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on first render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hc_user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const acceptedAccounts = [
    { username: "melissa@gmail.com", password: "patient123", role: "patient", isApproved: true },
    { username: "drsmith@gmail.com", password: "clinic123", role: "clinic", isApproved: true },
    { username: "adminuser@gmail.com", password: "admin123", role: "admin", isApproved: true },
  ];

  const login = ({username, password}) => {
    const account = acceptedAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setUser(account);
      localStorage.setItem("hc_user", JSON.stringify(account)); // ← save
      document.cookie = `hc_user=${JSON.stringify(account)}; path=/`;
      return account;
    }
    return null;
  };

  // const logout = () => setUser(null);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("hc_user"); // ← clear
    document.cookie = "hc_user=; path=/; max-age=0";
  };

  // const value = {
  //   user,
  //   login,
  //   logout
  // };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}