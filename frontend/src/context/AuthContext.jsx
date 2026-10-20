import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import {
  getToken,
  getUser,
  loginAdmin,
  logoutAdmin,
  fetchCurrentUser,
  testAdminRoute,
} from '../services/auth';

export { AuthContext };

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);
  const [error, setError] = useState(null);

  // Verifiko vlefshmërinë e token-it ekzistues në nisje
  useEffect(() => {
    async function verifyExistingAuth() {
      if (!token) {
        setInitialChecking(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();
        if (response?.user) {
          setUserState(response.user);
        }
      } catch {
        setTokenState(null);
        setUserState(null);
      } finally {
        setInitialChecking(false);
      }
    }

    verifyExistingAuth();
  }, [token]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAdmin(email, password);
      setTokenState(response.token);
      setUserState(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Dështoi kyçja.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutAdmin();
      setTokenState(null);
      setUserState(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const testAccess = useCallback(async () => {
    return await testAdminRoute();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    initialChecking,
    error,
    login,
    logout,
    testAccess,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
