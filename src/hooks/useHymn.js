import { useState, useEffect, useContext } from 'react';
import { HimnosContext } from '../context/HimnosContext';

export function useHymn(id) {
  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchHymnById } = useContext(HimnosContext);

  useEffect(() => {
    let isMounted = true;

    const loadHymn = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const hymnData = await fetchHymnById(id);
        
        if (isMounted) {
          setHymn(hymnData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading hymn:', err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadHymn();

    return () => {
      isMounted = false;
    };
  }, [id, fetchHymnById]);

  return { hymn, loading, error };
}