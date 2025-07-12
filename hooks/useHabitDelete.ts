import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { deleteHabitQuery } from '@/lib/habitCUD';
import { useAsyncState } from './useAsyncState';

interface UseHabitDeleteResult {
	deleting: boolean;
	error: string | null;
	deleteHabit: (habitUuid: string) => Promise<boolean>;
}

export default function useHabitDelete(): UseHabitDeleteResult {
	const db = useSQLiteContext();
	const { loading: deleting, error, runAsync } = useAsyncState();

	const deleteHabit = useCallback(
		async (habitUuid: string): Promise<boolean> => {
			const result = await runAsync(async () => {
				await deleteHabitQuery(db, habitUuid);
				return true;
			});

			return result !== null;
		},
		[db, runAsync]
	);

	return {
		deleting,
		error,
		deleteHabit
	};
}
