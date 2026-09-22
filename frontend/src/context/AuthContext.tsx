import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  authProvider: 'google' | 'email';
  accessToken?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogleToken: (accessToken: string) => Promise<void>;
  loginWithGoogleCredential: (credentialJwt: string) => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'smartcrop_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Handle REAL Google OAuth Access Token from Google Account Selection
  const loginWithGoogleToken = async (accessToken: string) => {
    try {
      // Fetch user profile info directly from Google OpenID API
      const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = res.data;
      const profile: UserProfile = {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        picture: data.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || data.email)}&background=16a34a&color=fff`,
        authProvider: 'google',
        accessToken
      };
      setUser(profile);
    } catch (err) {
      console.error("Failed to fetch Google User Info:", err);
      throw err;
    }
  };

  // Handle Google One-Tap / JWT Credential Response
  const loginWithGoogleCredential = (credentialJwt: string) => {
    try {
      // Decode JWT payload
      const base64Url = credentialJwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const data = JSON.parse(jsonPayload);
      const profile: UserProfile = {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        picture: data.picture,
        authProvider: 'google'
      };
      setUser(profile);
    } catch (err) {
      console.error("Failed to parse Google Credential JWT:", err);
    }
  };

  const loginWithEmail = (email: string, name?: string) => {
    const displayName = name || email.split('@')[0];
    const profile: UserProfile = {
      name: displayName,
      email: email.trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=16a34a&color=fff`,
      authProvider: 'email'
    };
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogleToken,
        loginWithGoogleCredential,
        loginWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
