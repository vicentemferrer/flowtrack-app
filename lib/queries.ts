import { SQLiteDatabase } from 'expo-sqlite';
import {
	CategoryOption,
	CreateHabitInput,
	RawHabit,
	RawHabitWithCategory,
	RawReminder
} from './types';

export async function nextRemindersQuery(db: SQLiteDatabase, maxReminders: number) {
	const query = `
        SELECT 
            h.uuid,
            h.title,
            h.description,
            h.target_value,
            h.target_unit,
            h.reminder_time,
            h.active_days,
            c.name as category_name,
            c.icon as category_icon,
            c.uuid as category_uuid,
            CASE 
                WHEN h.reminder_time >= strftime('%H:%M', 'now', 'localtime') 
                    AND h.active_days LIKE '%' || 
                        CASE strftime('%w', 'now', 'localtime')
                            WHEN '0' THEN '7'
                            ELSE strftime('%w', 'now', 'localtime')
                        END || '%'
                THEN 'today'
                WHEN h.active_days LIKE '%' || 
                    CASE strftime('%w', 'now', 'localtime', '+1 day')
                        WHEN '0' THEN '7'
                        ELSE strftime('%w', 'now', 'localtime', '+1 day')
                    END || '%'
                THEN 'tomorrow'
                ELSE 'later'
            END as schedule_type,
            CASE 
                WHEN h.reminder_time >= strftime('%H:%M', 'now', 'localtime') 
                    AND h.active_days LIKE '%' || 
                        CASE strftime('%w', 'now', 'localtime')
                            WHEN '0' THEN '7'
                            ELSE strftime('%w', 'now', 'localtime')
                        END || '%'
                THEN datetime('now', 'localtime', 'start of day', '+' || 
                    CAST(substr(h.reminder_time, 1, 2) AS INTEGER) || ' hours', 
                    '+' || CAST(substr(h.reminder_time, 4, 2) AS INTEGER) || ' minutes')
                ELSE datetime('now', 'localtime', '+1 day', 'start of day', '+' || 
                    CAST(substr(h.reminder_time, 1, 2) AS INTEGER) || ' hours', 
                    '+' || CAST(substr(h.reminder_time, 4, 2) AS INTEGER) || ' minutes')
            END as next_reminder_datetime,
            h.reminder_time as display_time
        FROM habit h
        LEFT JOIN category c ON h.category_uuid = c.uuid
        WHERE h.is_active = 1
        AND h.reminder_time IS NOT NULL
        AND (
            (h.reminder_time >= strftime('%H:%M', 'now', 'localtime') 
            AND h.active_days LIKE '%' || 
                CASE strftime('%w', 'now', 'localtime')
                    WHEN '0' THEN '7'
                    ELSE strftime('%w', 'now', 'localtime')
                END || '%')
            OR
            (h.active_days LIKE '%' || 
            CASE strftime('%w', 'now', 'localtime', '+1 day')
                WHEN '0' THEN '7'
                ELSE strftime('%w', 'now', 'localtime', '+1 day')
            END || '%')
        )
        ORDER BY
            CASE 
                WHEN h.reminder_time >= strftime('%H:%M', 'now', 'localtime') 
                    AND h.active_days LIKE '%' || 
                        CASE strftime('%w', 'now', 'localtime')
                            WHEN '0' THEN '7'
                            ELSE strftime('%w', 'now', 'localtime')
                        END || '%'
                THEN 0
                ELSE 1
            END,
            h.reminder_time
        LIMIT ?;
    `;

	const results = await db.getAllAsync<RawReminder>(query, maxReminders);

	return results;
}

export async function activeHabitsQuery(db: SQLiteDatabase) {
	const query = `
        WITH RankedHabits AS (
            SELECT 
                h.*,
                c.name as category_name,
                c.icon as category_icon,
                c.uuid as category_uuid,
                ROW_NUMBER() OVER (PARTITION BY c.uuid ORDER BY h.created_at DESC) as rn
            FROM habit h
            LEFT JOIN category c ON h.category_uuid = c.uuid
            WHERE h.is_active = 1
        )
        SELECT * FROM RankedHabits WHERE rn <= 3
        ORDER BY category_name, created_at DESC;
    `;

	const results = await db.getAllAsync<RawHabitWithCategory>(query);

	return results;
}

export async function inactiveHabitsQuery(db: SQLiteDatabase) {
	const query = `
        SELECT h.*
        FROM habit h
        WHERE h.is_active = 0
        ORDER BY h.created_at DESC
        LIMIT 3
    `;

	const results = await db.getAllAsync<RawHabit>(query);

	return results;
}

export async function getAllCategoriesQuery(db: SQLiteDatabase) {
	const query = `
        SELECT uuid, name, icon
        FROM category
        ORDER BY name ASC;
    `;

	const results = await db.getAllAsync<CategoryOption>(query);

	return results;
}

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
