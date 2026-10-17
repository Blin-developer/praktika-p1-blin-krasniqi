import { useState, useEffect, useCallback } from 'react';
import { fetchBusiness } from '../services/api';

/**
 * useBusiness – Hook për marrjen e detajeve të një biznesi specifik nga API-ja.
 * @param {string|number} idOrSlug
 */
export function useBusiness(idOrSlug) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(Boolean(idOrSlug));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!idOrSlug) {
      setBusiness(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchBusiness(idOrSlug);
      setBusiness(response.data || null);
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë marrjes së të dhënave të biznesit.');
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    load();
  }, [load]);

  return { business, loading, error, reload: load };
}
