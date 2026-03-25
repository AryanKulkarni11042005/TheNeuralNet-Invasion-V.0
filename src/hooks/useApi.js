import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for calling async mock API functions.
 * @param {Function} apiFn - The API function to call
 * @param {Array} args - Arguments to pass to the API function
 * @param {boolean} immediate - Whether to call immediately on mount
 */
export function useApi(apiFn, args = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...overrideArgs) => {
      setLoading(true);
      setError(null);
      try {
        const callArgs = overrideArgs.length > 0 ? overrideArgs : args;
        const result = await apiFn(...callArgs);
        if (result.ok) {
          setData(result.data);
        } else {
          setError(result.error || 'Something went wrong');
        }
        return result;
      } catch (err) {
        setError(err.message);
        return { ok: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [apiFn, ...args]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, setData };
}
