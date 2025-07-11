import {
	ActiveDays,
	BooleanToSqlite,
	DisplayReminder,
	HabitParsed,
	HabitWithCategoryParsed,
	IsHabitActiveToday,
	ParseActiveDays,
	RawHabit,
	RawHabitWithCategory,
	RawReminder,
	ReminderParsed,
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

export const parseHabit = (habit: RawHabit): HabitParsed => {
	return {
		...habit,
		active_days: parseActiveDays(habit.active_days),
		is_active: sqliteToBoolean(habit.is_active)
	};
};

export const serializeHabit = (habit: HabitParsed): RawHabit => {
	return {
		...habit,
		active_days: stringifyActiveDays(habit.active_days),
		is_active: booleanToSqlite(habit.is_active)
	};
};

// ===== NEXT HABIT REMINDER FUNCTIONS =====

export const parseHabitReminder = (result: RawReminder): ReminderParsed => {
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

export const prepareReminderForDisplay = (habit: ReminderParsed): DisplayReminder => {
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

export const parseHabitReminders = (results: RawReminder[]): ReminderParsed[] => {
	return results.map(parseHabitReminder);
};

export const prepareRemindersForDisplay = (habits: ReminderParsed[]): DisplayReminder[] => {
	return habits.map(prepareReminderForDisplay);
};

// ===== ACTIVE FUNCTIONS =====

export const parseActiveHabit = (result: RawHabitWithCategory): HabitWithCategoryParsed => ({
	...result,
	active_days: parseActiveDays(result.active_days),
	is_active: sqliteToBoolean(result.is_active),
	category:
		result.category_name && result.category_icon && result.category_uuid
			? {
					name: result.category_name,
					icon: result.category_icon,
					uuid: result.category_uuid
			  }
			: undefined
});

export function parseResults<T, U>(results: T[], parser: (item: T) => U): U[] {
	return results.map(parser);
}
