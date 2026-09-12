import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';

const AuthContext = createContext(null);

// Support optional backend API URL (for cross-origin production deployments like Vercel frontend -> Render backend)
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Listen to Firebase persistent auth state (works in both local and static hosting like Vercel)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        // Attempt backend verification first (for MongoDB profile and HTTP-only session cookie)
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            if (isMounted) {
              setUser(data.user);
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        // Backend offline or not deployed on this domain
      }

      // If backend verification returned 404/failed, but Firebase user exists, use Firebase profile
      if (firebaseUser && isMounted) {
        setUser({
          _id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Barista',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || undefined,
          authProvider: 'google',
          createdAt: new Date().toISOString(),
        });
      } else if (isMounted) {
        setUser(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
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

      const fallbackUser = {
        _id: googleUser.uid,
        name: googleUser.displayName || googleUser.email?.split('@')[0] || 'Barista',
        email: googleUser.email,
        avatar: googleUser.photoURL || undefined,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
      };

      // Attempt to exchange with LastHope backend to establish MongoDB user & session cookie
      try {
        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.displayName || fallbackUser.name,
            avatar: googleUser.photoURL || undefined,
            firebaseUid: googleUser.uid,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            return { success: true, user: data.user };
          }
        } else {
          console.warn(`Backend responded with status ${res.status}. Continuing with verified Firebase credentials.`);
        }
      } catch (backendErr) {
        console.warn('Backend sync unreachable, continuing with Firebase credentials:', backendErr.message);
      }

      // If backend is not deployed on this domain (e.g. Vercel static deployment),
      // seamlessly establish the session using the verified Firebase Google credentials
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
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
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
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
