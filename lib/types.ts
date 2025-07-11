export type UUID = string;
export type ISODateTime = string;
export type TimeString = string;
export type DateString = string;
export type ActiveDaysJSON = string;
export type ActiveDays = number[];

// ===== CATEGORY TYPES =====

export interface Category {
	id: number;
	uuid: UUID;
	name: string;
	icon: string;
}

export interface CreateCategoryInput {
	uuid: UUID;
	name: string;
	icon?: string;
}

export interface UpdateCategoryInput {
	name?: string;
	icon?: string;
}

// ===== HABIT TYPES =====

export interface Habit {
	id: number;
	uuid: UUID;
	title: string;
	description: string | null;
	target_value: number | null;
	target_unit: string | null;
	active_days: ActiveDaysJSON;
	reminder_time: TimeString | null;
	is_active: number;
	due_date: DateString | null;
	created_at: ISODateTime;
	category_uuid: UUID | null;
}

export interface HabitParsed extends Omit<Habit, 'active_days' | 'is_active'> {
	active_days: ActiveDays;
	is_active: boolean;
}

export interface CreateHabitInput {
	uuid: UUID;
	title: string;
	description?: string | null;
	target_value?: number | null;
	target_unit?: string | null;
	active_days?: ActiveDaysJSON;
	reminder_time?: TimeString | null;
	is_active?: boolean;
	due_date?: DateString | null;
	category_uuid?: UUID | null;
}

export interface UpdateHabitInput {
	title?: string;
	description?: string | null;
	target_value?: number | null;
	target_unit?: string | null;
	active_days?: ActiveDaysJSON;
	reminder_time?: TimeString | null;
	is_active?: boolean;
	due_date?: DateString | null;
	category_uuid?: UUID | null;
}

// ===== VIEW TYPES =====

export interface CategoryStats {
	uuid: UUID;
	name: string;
	icon: string;
	total_habits: number;
	active_habits: number;
	inactive_habits: number;
}

export interface DailyReminder {
	uuid: UUID;
	title: string;
	reminder_time: TimeString;
	target_value: number | null;
	target_unit: string | null;
	category_name: string | null;
	category_icon: string | null;
}

// ===== COMBINED TYPES =====

export interface HabitWithCategory extends HabitParsed {
	category: Category | null;
}

export interface CategoryWithHabits extends Category {
	habits: HabitParsed[];
}

// ===== ENUMS =====

export enum DayOfWeek {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 7
}

export enum TargetUnit {
	MINUTES = 'minutes',
	HOURS = 'hours',
	GLASSES = 'glasses',
	PILLS = 'pill',
	SESSIONS = 'session',
	TASKS = 'tasks',
	ENTRIES = 'entry',
	DOLLARS = 'dollars',
	REVIEWS = 'review',
	MEALS = 'meal',
	CALLS = 'call',
	CONTACTS = 'contact',
	EPISODES = 'episode',
	CIGARETTES = 'cigarettes',
	GRAMS = 'grams'
}

export enum CategoryIcon {
	HEART = 'heart',
	ZAP = 'zap',
	DUMBBELL = 'dumbbell',
	BOOK = 'book',
	DOLLAR_SIGN = 'dollar-sign',
	HOME = 'home',
	USERS = 'users',
	PALETTE = 'palette',
	CIRCLE = 'circle'
}

// ===== HELPER FUNCTIONS TYPES =====

export type ParseActiveDays = (activeDaysJSON: ActiveDaysJSON) => ActiveDays;
export type StringifyActiveDays = (activeDays: ActiveDays) => ActiveDaysJSON;
export type IsHabitActiveToday = (habit: Habit | HabitParsed) => boolean;
export type SqliteToBoolean = (value: number) => boolean;
export type BooleanToSqlite = (value: boolean) => number;

// ===== NEXT HABIT REMINDER TYPES =====

export type ScheduleType = 'today' | 'tomorrow' | 'later';

export interface HabitReminderResult {
	uuid: UUID;
	title: string;
	description: string | null;
	target_value: number | null;
	target_unit: string | null;
	reminder_time: TimeString;
	active_days: string;
	category_name: string | null;
	category_icon: string | null;
	category_uuid: UUID | null;
	schedule_type: ScheduleType;
	next_reminder_datetime: ISODateTime;
	display_time: TimeString;
}

export interface HabitReminderParsed {
	uuid: UUID;
	title: string;
	description?: string;
	target?: {
		value: number;
		unit: string;
	};
	reminderTime: TimeString;
	activeDays: string;
	category?: {
		name: string;
		icon: string;
		uuid: UUID;
	};
	scheduleType: ScheduleType;
	nextReminderDate: Date;
	displayTime: TimeString;
}

export interface HabitReminderDisplay {
	uuid: UUID;
	title: string;
	description?: string;
	scheduleType: ScheduleType;
	displayTime: TimeString;
	categoryIcon?: string;
	categoryName?: string;
	targetText?: string;
}
