// ===== FLOWTRACK TYPESCRIPT TYPES =====

// ===== BASE TYPES =====

/**
 * UUID string format compatible with Expo Crypto.randomUUID()
 * Example: "01234567-89ab-cdef-0123-456789abcdef"
 */
export type UUID = string;

/**
 * ISO 8601 datetime string
 * Example: "2024-07-08T10:30:00.000Z"
 */
export type ISODateTime = string;

/**
 * Time string in HH:MM format
 * Example: "08:30", "14:45"
 */
export type TimeString = string;

/**
 * Date string in YYYY-MM-DD format
 * Example: "2024-12-31"
 */
export type DateString = string;

/**
 * JSON string representing array of active days
 * 1=Monday, 2=Tuesday, ..., 7=Sunday
 * Example: "[1,2,3,4,5,6,7]" for all days
 */
export type ActiveDaysJSON = string;

/**
 * Array of active days (parsed from JSON)
 * 1=Monday, 2=Tuesday, ..., 7=Sunday
 */
export type ActiveDays = number[];

// ===== CATEGORY TYPES =====

/**
 * Category database table structure
 */
export interface Category {
  id: number;
  uuid: UUID;
  name: string;
  icon: string;
}

/**
 * Input type for creating a new category
 */
export interface CreateCategoryInput {
  uuid: UUID;
  name: string;
  icon?: string;
}

/**
 * Input type for updating a category
 */
export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
}

// ===== HABIT TYPES =====

/**
 * Habit database table structure
 */
export interface Habit {
  id: number;
  uuid: UUID;
  title: string;
  description: string | null;
  target_value: number | null;
  target_unit: string | null;
  active_days: ActiveDaysJSON;
  reminder_time: TimeString | null;
  is_active: number; // 0=inactive, 1=active (SQLite boolean)
  due_date: DateString | null;
  created_at: ISODateTime;
  category_uuid: UUID | null;
}

/**
 * Habit with parsed active_days and boolean is_active
 */
export interface HabitParsed extends Omit<Habit, 'active_days' | 'is_active'> {
  active_days: ActiveDays;
  is_active: boolean;
}

/**
 * Input type for creating a new habit
 */
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

/**
 * Input type for updating a habit
 */
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

/**
 * Category statistics view
 */
export interface CategoryStats {
  uuid: UUID;
  name: string;
  icon: string;
  total_habits: number;
  active_habits: number;
  inactive_habits: number;
}

/**
 * Daily reminders view
 */
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

/**
 * Habit with category information
 */
export interface HabitWithCategory extends HabitParsed {
  category: Category | null;
}

/**
 * Category with its habits
 */
export interface CategoryWithHabits extends Category {
  habits: HabitParsed[];
}

// ===== UTILITY TYPES =====

/**
 * Database query result type
 */
export interface QueryResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Paginated result type
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ===== ENUMS =====

/**
 * Days of the week enum
 */
export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

/**
 * Common target units
 */
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
  GRAMS = 'grams',
}

/**
 * Common category icons
 */
export enum CategoryIcon {
  HEART = 'heart',
  ZAP = 'zap',
  DUMBBELL = 'dumbbell',
  BOOK = 'book',
  DOLLAR_SIGN = 'dollar-sign',
  HOME = 'home',
  USERS = 'users',
  PALETTE = 'palette',
  CIRCLE = 'circle',
}

// ===== HELPER FUNCTIONS TYPES =====

/**
 * Function to parse active days from JSON
 */
export type ParseActiveDays = (activeDaysJSON: ActiveDaysJSON) => ActiveDays;

/**
 * Function to stringify active days to JSON
 */
export type StringifyActiveDays = (activeDays: ActiveDays) => ActiveDaysJSON;

/**
 * Function to check if habit is active today
 */
export type IsHabitActiveToday = (habit: Habit | HabitParsed) => boolean;

/**
 * Function to convert SQLite boolean to JavaScript boolean
 */
export type SqliteToBoolean = (value: number) => boolean;

/**
 * Function to convert JavaScript boolean to SQLite boolean
 */
export type BooleanToSqlite = (value: boolean) => number;

// ===== EXPORT HELPER FUNCTIONS =====

/**
 * Parse active days from JSON string
 */
export const parseActiveDays: ParseActiveDays = (activeDaysJSON) => {
  try {
    return JSON.parse(activeDaysJSON) as ActiveDays;
  } catch {
    return [1, 2, 3, 4, 5, 6, 7]; // Default to all days
  }
};

/**
 * Stringify active days to JSON
 */
export const stringifyActiveDays: StringifyActiveDays = (activeDays) => {
  return JSON.stringify(activeDays);
};

/**
 * Check if habit is active today
 */
export const isHabitActiveToday: IsHabitActiveToday = (habit) => {
  const today = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const dayOfWeek = today === 0 ? 7 : today; // Convert to 1=Monday, ..., 7=Sunday
  
  const activeDays = typeof habit.active_days === 'string' 
    ? parseActiveDays(habit.active_days)
    : habit.active_days;
    
  return activeDays.includes(dayOfWeek);
};

/**
 * Convert SQLite boolean (0/1) to JavaScript boolean
 */
export const sqliteToBoolean: SqliteToBoolean = (value) => {
  return value === 1;
};

/**
 * Convert JavaScript boolean to SQLite boolean (0/1)
 */
export const booleanToSqlite: BooleanToSqlite = (value) => {
  return value ? 1 : 0;
};

/**
 * Convert Habit to HabitParsed
 */
export const parseHabit = (habit: Habit): HabitParsed => {
  return {
    ...habit,
    active_days: parseActiveDays(habit.active_days),
    is_active: sqliteToBoolean(habit.is_active),
  };
};

/**
 * Convert HabitParsed to Habit (for database operations)
 */
export const serializeHabit = (habit: HabitParsed): Habit => {
  return {
    ...habit,
    active_days: stringifyActiveDays(habit.active_days),
    is_active: booleanToSqlite(habit.is_active),
  };
};