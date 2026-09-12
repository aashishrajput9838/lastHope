import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/auth/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include', // Sends HTTP-only cookie
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session verification error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setAuthError(null);
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please check your details.');
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Exchange with LastHope backend to establish session and MongoDB user
      const res = await fetch('/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.displayName || 'Google User',
          avatar: googleUser.photoURL || undefined,
          firebaseUid: googleUser.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Google Sign In Error:', err);
      const isClosedByUser =
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request';
      const message = isClosedByUser
        ? 'Google sign-in was cancelled.'
        : err.message || 'Google sign-in failed.';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      await signOut(auth).catch(() => {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAuthError(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    authError,
    setAuthError,
    login,
    register,
    loginWithGoogle,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
