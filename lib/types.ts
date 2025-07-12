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

export interface RawHabit {
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

export interface HabitParsed extends Omit<RawHabit, 'active_days' | 'is_active'> {
	active_days: ActiveDays;
	is_active: boolean;
}

export interface RawHabitWithCategory extends RawHabit {
	category_name: string | null;
	category_icon: string | null;
	category_uuid: UUID | null;
}

export interface HabitWithCategoryParsed extends Omit<HabitParsed, 'category_uuid'> {
	category?: Omit<Category, 'id'> | null;
}

export interface HabitsByCategory {
	category: Omit<Category, 'id'>;
	habits: HabitWithCategoryParsed[];
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
export type IsHabitActiveToday = (habit: RawHabit | HabitParsed) => boolean;
export type SqliteToBoolean = (value: number) => boolean;
export type BooleanToSqlite = (value: boolean) => number;

// ===== NEXT HABIT REMINDER TYPES =====

export type ScheduleType = 'today' | 'tomorrow' | 'later';

export interface RawReminder {
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

export interface ReminderParsed {
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

export interface DisplayReminder {
	uuid: UUID;
	title: string;
	description?: string;
	scheduleType: ScheduleType;
	displayTime: TimeString;
	categoryIcon?: string;
	categoryName?: string;
	targetText?: string;
}

// ===== CREATE HABIT TYPES =====

export interface HabitFormData {
	title: string;
	description: string | null;
	target_value: number | null;
	target_unit: string | null;
	active_days: ActiveDays;
	reminder_time: TimeString | null;
	due_date: DateString | null;
	category_uuid: UUID | null;
}

export interface HabitFormErrors {
	title?: string;
	target_value?: string;
	target_unit?: string;
	due_date?: string;
	category_uuid?: string;
	general?: string;
}

export interface CategoryOption {
	uuid: UUID;
	name: string;
	icon: string;
}
