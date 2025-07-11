import { SQLiteDatabase } from 'expo-sqlite';
import { HabitReminderResult } from './types';

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

	const results = await db.getAllAsync<HabitReminderResult>(query, maxReminders);

	return results;
}
