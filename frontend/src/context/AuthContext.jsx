import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import {
  getToken,
  getUser,
  loginAdmin,
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
  logoutUser,
  fetchCurrentUser,
  updateUserProfile as apiUpdateProfile,
  changeUserPassword as apiChangePassword,
  testAdminRoute,
} from '../services/auth';
import { fetchUserFavorites, toggleUserFavorite } from '../services/api';

export { AuthContext };

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);
  const [error, setError] = useState(null);

  // Ngarko bizneset e ruajtura për përdoruesin e autentikuar
  const loadFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    try {
      const res = await fetchUserFavorites();
      setFavorites(res.data || []);
    } catch {
      setFavorites([]);
    }
  }, [token]);

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
          loadFavorites();
        }
      } catch {
        setTokenState(null);
        setUserState(null);
        setFavorites([]);
      } finally {
        setInitialChecking(false);
      }
    }

    verifyExistingAuth();
  }, [token, loadFavorites]);

  // Kyçje administrative
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAdmin(email, password);
      setTokenState(response.token);
      setUserState(response.user);
      loadFavorites();
      return response;
    } catch (err) {
      setError(err.message || 'Dështoi kyçja.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  // Kyçje përdoruesi
  const userLogin = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLoginUser(email, password);
      setTokenState(response.token);
      setUserState(response.user);
      loadFavorites();
      return response;
    } catch (err) {
      setError(err.message || 'Dështoi kyçja.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  // Regjistrim përdoruesi i ri
  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRegisterUser(name, email, password, passwordConfirmation);
      setTokenState(response.token);
      setUserState(response.user);
      setFavorites([]);
      return response;
    } catch (err) {
      setError(err.message || 'Dështoi regjistrimi.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Përditësim profili
  const updateProfile = useCallback(async (name, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUpdateProfile(name, email);
      if (response?.user) {
        setUserState(response.user);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Dështoi përditësimi i profilit.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ndryshim fjalëkalimi
  const changePassword = useCallback(async (currentPassword, newPassword, newPasswordConfirmation) => {
    setLoading(true);
    setError(null);
    try {
      return await apiChangePassword(currentPassword, newPassword, newPasswordConfirmation);
    } catch (err) {
      setError(err.message || 'Dështoi ndryshimi i fjalëkalimit.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Shkyçje e sigurt
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
      setTokenState(null);
      setUserState(null);
      setFavorites([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ruaj / Hiq nga të favorizuarat
  const toggleFavorite = useCallback(async (businessId) => {
    if (!token) {
      throw new Error('Duhet të jeni të kyçur për të ruajtur bizneset.');
    }
    const res = await toggleUserFavorite(businessId);
    loadFavorites();
    return res;
  }, [token, loadFavorites]);

  const isFavorite = useCallback((businessId) => {
    if (!businessId || !favorites.length) return false;
    return favorites.some((fav) => fav.id === businessId || fav.business_id === businessId);
  }, [favorites]);

  const testAccess = useCallback(async () => {
    return await testAdminRoute();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(user?.is_admin),
    favorites,
    favoritesCount: favorites.length,
    loading,
    initialChecking,
    error,
    login,
    userLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    toggleFavorite,
    isFavorite,
    reloadFavorites: loadFavorites,
    testAccess,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
