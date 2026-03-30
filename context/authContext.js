import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // const value = {
  //   user,
  //   setUser
  // };

  const acceptedAccounts = [
    { username: "melissa", password: "patient123", role: "patient", isApproved: true },
    { username: "drsmith", password: "doctor123", role: "doctor", isApproved: true },
    { username: "adminuser", password: "admin123", role: "admin", isApproved: true },
  ];

  const login = ({username, password}) => {
    const account = acceptedAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setUser(account);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}