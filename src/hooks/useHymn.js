import { useState, useEffect } from "react";
import { getHymnById } from "../db/databaseService";

export const useHymn = (id) => {
  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getHymnById(id);
        if (!cancelled) {
          setHymn(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { hymn, loading, error };
};
