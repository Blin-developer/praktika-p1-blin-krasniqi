import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

/**
 * useAuth – Hook për të aksesuar gjendjen dhe veprimet e autentikimit.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth duhet të përdoret brenda një <AuthProvider>.');
  }

  return context;
}
