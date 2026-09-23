import { useCallback, useEffect, useState } from "react";
// Callers supply a stable loader (service method or useCallback).
export function useResource<T>(loader: () => Promise<T>) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    loader: () => Promise<T>;
    revision: number;
    data?: T;
    error?: string;
  }>();
  const current = result?.loader === loader && result.revision === revision;
  useEffect(() => {
    let active = true;
    loader()
      .then((data) => {
        if (active) setResult({ loader, revision, data });
      })
      .catch(() => {
        if (active)
          setResult({
            loader,
            revision,
            error: "Não foi possível carregar agora. Tente novamente.",
          });
      });
    return () => {
      active = false;
    };
  }, [loader, revision]);
  return {
    data: current ? result.data : undefined,
    loading: !current,
    error: current ? result.error : undefined,
    retry: useCallback(() => setRevision((r) => r + 1), []),
  };
}
