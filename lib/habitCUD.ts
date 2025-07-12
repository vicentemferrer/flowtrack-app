import { SQLiteDatabase } from 'expo-sqlite';
import { CreateHabitInput, UpdateHabitInput } from './types';

export async function createHabitQuery(db: SQLiteDatabase, habit: CreateHabitInput) {
	const query = `
        INSERT INTO habit (uuid, title, description, target_value, target_unit, active_days, reminder_time, is_active, due_date, category_uuid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

	const params = [
		habit.uuid,
		habit.title,
		habit.description || null,
		habit.target_value || null,
		habit.target_unit || null,
		habit.active_days || '[1,2,3,4,5,6,7]',
		habit.reminder_time || null,
		habit.is_active ? 1 : 0,
		habit.due_date || null,
		habit.category_uuid || null
	];

	await db.runAsync(query, params);
}

export async function updateHabitQuery(
	db: SQLiteDatabase,
	habitUuid: string,
	habit: UpdateHabitInput
) {
	const setFields: string[] = [];
	const params: any[] = [];

	if (habit.title !== undefined) {
		setFields.push('title = ?');
		params.push(habit.title);
	}

	if (habit.description !== undefined) {
		setFields.push('description = ?');
		params.push(habit.description);
	}

	if (habit.target_value !== undefined) {
		setFields.push('target_value = ?');
		params.push(habit.target_value);
	}

	if (habit.target_unit !== undefined) {
		setFields.push('target_unit = ?');
		params.push(habit.target_unit);
	}

	if (habit.active_days !== undefined) {
		setFields.push('active_days = ?');
		params.push(habit.active_days);
	}

	if (habit.reminder_time !== undefined) {
		setFields.push('reminder_time = ?');
		params.push(habit.reminder_time);
	}

	if (habit.is_active !== undefined) {
		setFields.push('is_active = ?');
		params.push(habit.is_active ? 1 : 0);
	}

	if (habit.due_date !== undefined) {
		setFields.push('due_date = ?');
		params.push(habit.due_date);
	}

	if (habit.category_uuid !== undefined) {
		setFields.push('category_uuid = ?');
		params.push(habit.category_uuid);
	}

	if (setFields.length === 0) {
		throw new Error('No fields provided for update');
	}

	setFields.push('updated_at = datetime("now")');

	params.push(habitUuid);

	const query = `
		UPDATE habit 
		SET ${setFields.join(', ')}
		WHERE uuid = ?;
	`;

	const result = await db.runAsync(query, params);

	if (result.changes === 0) {
		throw new Error('Habit not found or no changes made');
	}

	return result;
}

export async function deleteHabitQuery(db: SQLiteDatabase, habitUuid: string) {
	const query = `DELETE FROM habit WHERE uuid = ?;`;

	const result = await db.runAsync(query, [habitUuid]);

	if (result.changes === 0) {
		throw new Error('Habit not found');
	}

	return result;
}
