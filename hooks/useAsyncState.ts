import { useCallback, useState } from 'react';

export function useAsyncState<T>(value?: T) {
	const [data, setData] = useState<T>(value as T);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const runAsync = useCallback(async (fn: () => Promise<T>) => {
		setLoading(true);
		setError(null);
		try {
			const result = await fn();
			setData(result);
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error');
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	return { data, loading, error, runAsync, setData };
}
