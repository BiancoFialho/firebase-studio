// src/contexts/auth-context.tsx
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// IMPORTANT: This is a basic client-side only authentication state.
// It does NOT persist across page refreshes or browser sessions.
// A real application would use cookies, local storage, or session storage
// along with backend validation for persistent authentication.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // --- Persistence Placeholder ---
  // useEffect(() => {
  //   // Check for a token/session in localStorage/sessionStorage on initial load
  //   const storedAuth = sessionStorage.getItem('isAuthenticated');
  //   if (storedAuth === 'true') {
  //     setIsAuthenticated(true);
  //   }
  // }, []);
  // --- End Placeholder ---


  const login = () => {
    setIsAuthenticated(true);
    // --- Persistence Placeholder ---
    // sessionStorage.setItem('isAuthenticated', 'true'); // Example persistence
    // --- End Placeholder ---
  };

  const logout = () => {
    setIsAuthenticated(false);
     // --- Persistence Placeholder ---
     // sessionStorage.removeItem('isAuthenticated');
     // --- End Placeholder ---
     // Optionally redirect to login page:
     // window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
