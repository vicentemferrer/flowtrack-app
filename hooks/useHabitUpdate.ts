import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { updateHabitQuery } from '@/lib/habitCUD';
import { stringifyActiveDays } from '@/lib/helpers';
import { getAllCategoriesQuery } from '@/lib/queries';
import { CategoryOption, HabitFormData, HabitFormErrors, UpdateHabitInput } from '@/lib/types';

interface UseHabitUpdateResult {
	categories: CategoryOption[];
	updating: boolean;
	error: string | null;
	updateHabit: (habitUuid: string, formData: HabitFormData) => Promise<boolean>;
	validateForm: (formData: HabitFormData) => Partial<HabitFormErrors>;
}

export default function useHabitUpdate(): UseHabitUpdateResult {
	const [categories, setCategories] = useState<CategoryOption[]>([]);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const db = useSQLiteContext();

	const loadCategories = useCallback(async () => {
		try {
			const result = await getAllCategoriesQuery(db);
			setCategories(result);
		} catch (err) {
			console.error('Error loading categories:', err);
		}
	}, [db]);

	useState(() => {
		loadCategories();
	});

	const validateForm = useCallback((formData: HabitFormData): Partial<HabitFormErrors> => {
		const errors: Partial<HabitFormErrors> = {};

		if (!formData.title.trim()) {
			errors.title = 'Title is required';
		} else if (formData.title.length > 100) {
			errors.title = 'Title must be less than 100 characters';
		}

		if (formData.target_value !== null && formData.target_unit === null) {
			errors.target_unit = 'Unit is required when target value is set';
		}

		if (formData.target_unit !== null && formData.target_value === null) {
			errors.target_value = 'Value is required when target unit is set';
		}

		if (formData.target_value !== null && formData.target_value <= 0) {
			errors.target_value = 'Target value must be greater than 0';
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

	const updateHabit = useCallback(
		async (habitUuid: string, formData: HabitFormData): Promise<boolean> => {
			setUpdating(true);
			setError(null);

			try {
				const updateData: UpdateHabitInput = {
					title: formData.title,
					description: formData.description,
					target_value: formData.target_value,
					target_unit: formData.target_unit,
					active_days: stringifyActiveDays(formData.active_days),
					reminder_time: formData.reminder_time,
					due_date: formData.due_date,
					category_uuid: formData.category_uuid
				};

				await updateHabitQuery(db, habitUuid, updateData);

				return true;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Failed to update habit';
				setError(errorMessage);
				return false;
			} finally {
				setUpdating(false);
			}
		},
		[db]
	);

	return {
		categories,
		updating,
		error,
		updateHabit,
		validateForm
	};
}
