import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { parseActiveHabit } from '@/lib/helpers';
import { habitDetailsQuery } from '@/lib/queries';
import { HabitWithCategoryParsed } from '@/lib/types';
import { useAsyncState } from './useAsyncState';

interface UseHabitDetailsResult {
	habit: HabitWithCategoryParsed | null;
	loading: boolean;
	error: string | null;
	loadHabitDetails: (habitUuid: string) => Promise<HabitWithCategoryParsed | null>;
}

export default function useHabitDetails(): UseHabitDetailsResult {
	const {
		data: habit,
		loading,
		error,
		runAsync
	} = useAsyncState<HabitWithCategoryParsed | null>(null);
	const db = useSQLiteContext();

	const loadHabitDetails = useCallback(
		async (habitUuid: string) => {
			return runAsync(async () => {
				const result = await habitDetailsQuery(db, habitUuid);

				if (!result) {
					throw new Error('Habit not found');
				}

				return parseActiveHabit(result);
			});
		},
		[db, runAsync]
	);

	return {
		habit,
		loading,
		error,
		loadHabitDetails
	};
}
