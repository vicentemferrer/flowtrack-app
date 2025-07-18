import { SQLiteDatabase } from 'expo-sqlite';
import { CategoryOption, RawHabit, RawHabitWithCategory, RawReminder } from './types';

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

export async function habitDetailsQuery(db: SQLiteDatabase, habitUuid: string) {
	const query = `
		SELECT 
			h.*,
			c.name as category_name,
			c.icon as category_icon,
			c.uuid as category_uuid
		FROM habit h
		LEFT JOIN category c ON h.category_uuid = c.uuid
		WHERE h.uuid = ?
		LIMIT 1;
	`;

	const result = await db.getFirstAsync<RawHabitWithCategory>(query, habitUuid);

	return result;
}
