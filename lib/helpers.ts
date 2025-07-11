import {
	ActiveDays,
	BooleanToSqlite,
	Habit,
	HabitParsed,
	HabitReminderDisplay,
	HabitReminderParsed,
	HabitReminderResult,
	IsHabitActiveToday,
	ParseActiveDays,
	SqliteToBoolean,
	StringifyActiveDays
} from './types';

export const parseActiveDays: ParseActiveDays = (activeDaysJSON) => {
	try {
		return JSON.parse(activeDaysJSON) as ActiveDays;
	} catch {
		return [1, 2, 3, 4, 5, 6, 7];
	}
};

export const stringifyActiveDays: StringifyActiveDays = (activeDays) => {
	return JSON.stringify(activeDays);
};

export const isHabitActiveToday: IsHabitActiveToday = (habit) => {
	const today = new Date().getDay();
	const dayOfWeek = today === 0 ? 7 : today;

	const activeDays =
		typeof habit.active_days === 'string' ? parseActiveDays(habit.active_days) : habit.active_days;

	return activeDays.includes(dayOfWeek);
};

export const sqliteToBoolean: SqliteToBoolean = (value) => {
	return !!value;
};

export const booleanToSqlite: BooleanToSqlite = (value) => {
	return value ? 1 : 0;
};

export const parseHabit = (habit: Habit): HabitParsed => {
	return {
		...habit,
		active_days: parseActiveDays(habit.active_days),
		is_active: sqliteToBoolean(habit.is_active)
	};
};

export const serializeHabit = (habit: HabitParsed): Habit => {
	return {
		...habit,
		active_days: stringifyActiveDays(habit.active_days),
		is_active: booleanToSqlite(habit.is_active)
	};
};

// ===== NEXT HABIT REMINDER FUNCTIONS =====

export const parseHabitReminder = (result: HabitReminderResult): HabitReminderParsed => {
	return {
		uuid: result.uuid,
		title: result.title,
		description: result.description || undefined,
		target:
			result.target_value && result.target_unit
				? {
						value: result.target_value,
						unit: result.target_unit
				  }
				: undefined,
		reminderTime: result.reminder_time,
		activeDays: result.active_days,
		category:
			result.category_name && result.category_icon && result.category_uuid
				? {
						name: result.category_name,
						icon: result.category_icon,
						uuid: result.category_uuid
				  }
				: undefined,
		scheduleType: result.schedule_type,
		nextReminderDate: new Date(result.next_reminder_datetime),
		displayTime: result.display_time
	};
};

export const prepareReminderForDisplay = (habit: HabitReminderParsed): HabitReminderDisplay => {
	return {
		uuid: habit.uuid,
		title: habit.title,
		description: habit.description,
		scheduleType: habit.scheduleType,
		displayTime: habit.displayTime,
		categoryIcon: habit.category?.icon,
		categoryName: habit.category?.name,
		targetText: habit.target ? `${habit.target.value} ${habit.target.unit}` : undefined
	};
};

export const parseHabitReminders = (results: HabitReminderResult[]): HabitReminderParsed[] => {
	return results.map(parseHabitReminder);
};

export const prepareRemindersForDisplay = (
	habits: HabitReminderParsed[]
): HabitReminderDisplay[] => {
	return habits.map(prepareReminderForDisplay);
};
