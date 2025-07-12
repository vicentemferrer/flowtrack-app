import * as Crypto from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { stringifyActiveDays } from '@/lib/helpers';
import { createHabitQuery, getAllCategoriesQuery } from '@/lib/queries';
import { CategoryOption, HabitFormData, HabitFormErrors } from '@/lib/types';
import { useAsyncState } from './useAsyncState';

interface UseHabitCreationResult {
	categories: CategoryOption[];
	loadingCategories: boolean;
	creating: boolean;
	error: string | null;
	createHabit: (formData: HabitFormData) => Promise<boolean>;
	validateForm: (formData: HabitFormData) => HabitFormErrors;
}

export default function useHabitCreation(): UseHabitCreationResult {
	const db = useSQLiteContext();
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		data: categories,
		loading: loadingCategories,
		error: categoriesError,
		runAsync: runCategoriesAsync
	} = useAsyncState<CategoryOption[]>([]);

	const validateForm = useCallback((formData: HabitFormData): HabitFormErrors => {
		const errors: HabitFormErrors = {};

		if (!formData.title.trim()) {
			errors.title = 'Habit title is required';
		}

		if (formData.target_value !== null) {
			if (formData.target_value < 0) {
				errors.target_value = 'Target value must be positive';
			}
			if (!formData.target_unit) {
				errors.target_unit = 'Target unit is required when target value is set';
			}
		}

		if (formData.due_date) {
			const dueDate = new Date(formData.due_date);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (dueDate < today) {
				errors.due_date = 'Due date cannot be in the past';
			}
		}

		return errors;
	}, []);

	const createHabit = useCallback(
		async (formData: HabitFormData): Promise<boolean> => {
			setCreating(true);
			setError(null);

			try {
				const errors = validateForm(formData);
				if (Object.keys(errors).length > 0) {
					setError(Object.values(errors)[0] || 'Validation failed');
					return false;
				}

				const habitUuid = Crypto.randomUUID();

				await createHabitQuery(db, {
					uuid: habitUuid,
					title: formData.title,
					description: formData.description,
					target_value: formData.target_value,
					target_unit: formData.target_unit,
					active_days: stringifyActiveDays(formData.active_days),
					reminder_time: formData.reminder_time,
					is_active: true,
					due_date: formData.due_date,
					category_uuid: formData.category_uuid
				});

				return true;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to create habit');
				return false;
			} finally {
				setCreating(false);
			}
		},
		[db, validateForm]
	);

	const loadCategoriesData = useCallback(async () => {
		return runCategoriesAsync(async () => {
			const results = await getAllCategoriesQuery(db);
			return results;
		});
	}, [db, runCategoriesAsync]);

	useEffect(() => {
		loadCategoriesData();
	}, [loadCategoriesData]);

	return {
		categories,
		loadingCategories,
		creating,
		error: error || categoriesError,
		createHabit,
		validateForm
	};
}
