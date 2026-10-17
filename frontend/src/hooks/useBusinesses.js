import { useState, useEffect, useCallback } from 'react';
import { fetchBusinesses } from '../services/api';

/**
 * useBusinesses – Hook për marrjen dhe filtrimin e bizneseve nga API-ja.
 * @param {Object} filters – filtrat aktualë { search, category, settlement }
 */
export function useBusinesses(filters = {}) {
  const { search, category, settlement, featured } = filters;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBusinesses({ search, category, settlement, featured });
      setBusinesses(data.data || []);
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë lidhjes me serverin.');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, settlement, featured]);

  useEffect(() => {
    load();
  }, [load]);

  return { businesses, loading, error, reload: load };
}
