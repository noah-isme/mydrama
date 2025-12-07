// ============================================================================
// Authentication Context - User Management
// ============================================================================

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthContextValue } from "../types";
import {
  getUser,
  saveUser,
  removeUser,
  saveAuthToken,
  removeAuthToken,
} from "../utils/storage";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages user authentication state and operations
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage
    return getUser();
  });

  const isAuthenticated = user !== null;

  /**
   * Login function
   * In a real app, this would make an API call
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any credentials
      // In production, validate against backend
      if (username && password) {
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          username,
          email: `${username}@example.com`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        saveUser(newUser);
        saveAuthToken("demo_token_" + newUser.id);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Register function
   * In a real app, this would make an API call
   */
  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any input
      // In production, validate and create user in backend
      if (username && email && password) {
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          username,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        saveUser(newUser);
        saveAuthToken("demo_token_" + newUser.id);
      } else {
        throw new Error("Invalid input");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = (): void => {
    setUser(null);
    removeUser();
    removeAuthToken();
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
