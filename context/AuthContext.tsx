// context/AuthContextProvider.tsx
"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  currentUser: any;
  updateUser: (data: any) => void;
  loadingUser: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true); // NEW

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoadingUser(false); // Finish loading
  }, []);

  // Save to localStorage on user change
  useEffect(() => {
    if (currentUser !== null) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  const updateUser = (data: any) => {
    setCurrentUser(data);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthContextProvider>");
  }
  return ctx;
};
