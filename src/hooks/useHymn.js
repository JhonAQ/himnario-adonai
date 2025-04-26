import { useState, useEffect } from 'react';
import { getHymnById } from '../db/databaseService';

export const useHymn = (id) => {
  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHymn = async () => {
      try {
        setLoading(true);
        const hymnData = await getHymnById(id);
        setHymn(hymnData);
      } catch (err) {
        console.error('Error al cargar el himno:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHymn();
  }, [id]);

  return { hymn, loading, error };
};