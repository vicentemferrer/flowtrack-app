import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect } from 'react';

import { parseActiveHabit, parseHabit, parseResults } from '@/lib/helpers';
import { activeHabitsQuery, inactiveHabitsQuery } from '@/lib/queries';
import { HabitParsed, HabitsByCategory } from '@/lib/types';
import { useAsyncState } from './useAsyncState';

interface UseHabitsResult {
	habitsByCategory: HabitsByCategory[];
	inactiveHabits: HabitParsed[];
	loading: boolean;
	error: string | null;
	refreshHabits: () => Promise<void>;
}

export default function useHabits(): UseHabitsResult {
	const {
		data: habitsByCategory,
		loading,
		error,
		runAsync,
		setData: setHabitsByCategory
	} = useAsyncState<HabitsByCategory[]>([]);

	const { data: inactiveHabits, setData: setInactiveHabits } = useAsyncState<HabitParsed[]>([]);

	const db = useSQLiteContext();

	const loadHabits = useCallback(async () => {
		return runAsync(async () => {
			const activeResults = await activeHabitsQuery(db);
			const inactiveResults = await inactiveHabitsQuery(db);

			const parsedActiveHabits = parseResults(activeResults, parseActiveHabit);
			const parsedInactiveHabits = parseResults(inactiveResults, parseHabit);

			const categoriesMap = new Map<string, HabitsByCategory>();

			for (const habit of parsedActiveHabits) {
				const categoryKey = habit.category?.uuid || 'uncategorized';

				if (!categoriesMap.has(categoryKey)) {
					categoriesMap.set(categoryKey, {
						category: {
							uuid: habit.category?.uuid || 'uncategorized',
							name: habit.category?.name || 'Uncategorized',
							icon: habit.category?.icon || 'circle'
						},
						habits: []
					});
				}

				categoriesMap.get(categoryKey)!.habits.push(habit);
			}

			setHabitsByCategory(Array.from(categoriesMap.values()));
			setInactiveHabits(parsedInactiveHabits);
			return Array.from(categoriesMap.values());
		});
	}, [db, runAsync, setInactiveHabits]);

	const refreshHabits = useCallback(async () => {
		await loadHabits();
	}, [loadHabits]);

	useEffect(() => {
		loadHabits();
	}, [loadHabits]);

	return {
		habitsByCategory,
		inactiveHabits,
		loading,
		error,
		refreshHabits
	};
}
