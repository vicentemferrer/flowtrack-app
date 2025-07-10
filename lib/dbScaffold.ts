import { SQLiteDatabase } from 'expo-sqlite';

export async function createTables(db: SQLiteDatabase) {
	await db.execAsync(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL DEFAULT 'circle'
    );
  `);

	await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_value INTEGER,
      target_unit TEXT,
      active_days TEXT DEFAULT '[1,2,3,4,5,6,7]',
      reminder_time TEXT,
      is_active INTEGER DEFAULT 1,
      due_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      category_uuid TEXT REFERENCES category(uuid) ON DELETE SET NULL
    );
  `);
}

export async function createIndexes(db: SQLiteDatabase) {
	await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_habit_category ON habit(category_uuid);
    CREATE INDEX IF NOT EXISTS idx_habit_active ON habit(is_active);
    CREATE INDEX IF NOT EXISTS idx_habit_due_date ON habit(due_date);
    CREATE INDEX IF NOT EXISTS idx_category_uuid ON category(uuid);
    CREATE INDEX IF NOT EXISTS idx_habit_uuid ON habit(uuid);
  `);
}

export async function createViews(db: SQLiteDatabase) {
	await db.execAsync(`
    CREATE VIEW IF NOT EXISTS category_stats AS
    SELECT 
      c.uuid,
      c.name,
      c.icon,
      COUNT(h.uuid) as total_habits,
      SUM(CASE WHEN h.is_active = 1 THEN 1 ELSE 0 END) as active_habits,
      SUM(CASE WHEN h.is_active = 0 THEN 1 ELSE 0 END) as inactive_habits
    FROM category c
    LEFT JOIN habit h ON c.uuid = h.category_uuid
    GROUP BY c.uuid, c.name, c.icon
    ORDER BY total_habits DESC;
  `);

	await db.execAsync(`
    CREATE VIEW IF NOT EXISTS daily_reminders AS
    SELECT 
      h.uuid,
      h.title,
      h.reminder_time,
      h.target_value,
      h.target_unit,
      c.name as category_name,
      c.icon as category_icon
    FROM habit h
    LEFT JOIN category c ON h.category_uuid = c.uuid
    WHERE h.is_active = 1 
      AND h.reminder_time IS NOT NULL
      AND h.active_days LIKE '%' || CAST(strftime('%w', 'now') AS INTEGER) || '%'
    ORDER BY h.reminder_time;
  `);
}
