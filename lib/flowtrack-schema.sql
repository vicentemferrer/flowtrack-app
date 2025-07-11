-- ===== FLOWTRACK DATABASE SCHEMA WITH EXPO CRYPTO UUIDs =====

-- ===== CATEGORY TABLE =====
CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'circle'
);

-- ===== HABIT TABLE =====
CREATE TABLE habit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER, -- Daily target
    target_unit TEXT, -- Unit of measurement
    active_days TEXT DEFAULT '[1,2,3,4,5,6,7]', -- JSON: active days (1=Monday, 7=Sunday)
    reminder_time TEXT, -- HH:MM format
    is_active INTEGER DEFAULT 1, -- 0=inactive, 1=active
    due_date TEXT, -- Due date (optional)
    created_at TEXT DEFAULT (datetime('now')),
    category_uuid TEXT REFERENCES category(uuid) ON DELETE SET NULL
);

-- ===== INDEXES - PERFORMANCE OPTIMIZATION =====
-- Indexes work like "shortcuts" to find data faster
-- Without indexes: searching 1000 records = checking all 1000
-- With indexes: searching 1000 records = checking ~10 (logarithmic)

CREATE INDEX idx_habit_category ON habit(category_uuid);    -- Speeds up: "habits of category X"
CREATE INDEX idx_habit_active ON habit(is_active);          -- Speeds up: "active/inactive habits"
CREATE INDEX idx_habit_due_date ON habit(due_date);         -- Speeds up: "habits due soon"
CREATE INDEX idx_category_uuid ON category(uuid);           -- Speeds up: category UUID searches
CREATE INDEX idx_habit_uuid ON habit(uuid);                 -- Speeds up: habit UUID searches

-- ===== SAMPLE DATA WITH EXPO CRYPTO UUIDs =====

-- Categories with Crypto.randomUUID() generated UUIDs
INSERT INTO category (uuid, name, icon) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Health', 'heart'),
('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'Productivity', 'bolt'),
('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'Exercise', 'dumbbell'),
('d4e5f6g7-h8i9-0123-4567-890123defghi', 'Learning', 'book'),
('e5f6g7h8-i9j0-1234-5678-901234efghij', 'Finance', 'dollar-sign'),
('f6g7h8i9-j0k1-2345-6789-012345fghijk', 'Home', 'home'),
('g7h8i9j0-k1l2-3456-7890-123456ghijkl', 'Social', 'users'),
('h8i9j0k1-l2m3-4567-8901-234567hijklm', 'Creativity', 'palette');

-- Habits with Crypto.randomUUID() generated UUIDs
INSERT INTO habit (uuid, title, description, target_value, target_unit, active_days, reminder_time, is_active, due_date, category_uuid) VALUES

-- === HEALTH HABITS ===
('01234567-89ab-cdef-0123-456789abcdef', 'Drink Water', 'Stay hydrated throughout the day', 8, 'glasses', '[1,2,3,4,5,6,7]', '08:00', 1, NULL, 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('12345678-9abc-def0-1234-56789abcdef0', 'Take Vitamins', 'Daily vitamin supplement', 1, 'pill', '[1,2,3,4,5,6,7]', '09:00', 1, NULL, 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('23456789-abcd-ef01-2345-6789abcdef01', 'Sleep 8 Hours', 'Get adequate rest', 8, 'hours', '[1,2,3,4,5,6,7]', '22:00', 1, NULL, 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('3456789a-bcde-f012-3456-789abcdef012', 'Walk Daily', 'Walk at least 30 minutes', 30, 'minutes', '[1,2,3,4,5,6,7]', '18:00', 1, NULL, 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),

-- === PRODUCTIVITY HABITS ===
('456789ab-cdef-0123-4567-89abcdef0123', 'Plan Day', 'Organize daily tasks', 1, 'session', '[1,2,3,4,5]', '07:30', 1, NULL, 'b2c3d4e5-f6g7-8901-2345-678901bcdefg'),
('56789abc-def0-1234-5678-9abcdef01234', 'Check Emails', 'Manage inbox', 1, 'session', '[1,2,3,4,5]', '09:30', 1, NULL, 'b2c3d4e5-f6g7-8901-2345-678901bcdefg'),
('6789abcd-ef01-2345-6789-abcdef012345', 'Complete Important Tasks', 'Focus on priorities', 3, 'tasks', '[1,2,3,4,5]', '10:00', 1, NULL, 'b2c3d4e5-f6g7-8901-2345-678901bcdefg'),
('789abcde-f012-3456-789a-bcdef0123456', 'Organize Desk', 'Keep workspace clean', 1, 'session', '[1,2,3,4,5]', '17:00', 1, NULL, 'b2c3d4e5-f6g7-8901-2345-678901bcdefg'),

-- === EXERCISE HABITS ===
('89abcdef-0123-4567-89ab-cdef01234567', 'Go to Gym', 'Strength training', 1, 'session', '[1,3,5]', '06:00', 1, NULL, 'c3d4e5f6-g7h8-9012-3456-789012cdefgh'),
('9abcdef0-1234-5678-9abc-def012345678', 'Running', 'Cardiovascular exercise', 30, 'minutes', '[2,4,6]', '06:30', 1, NULL, 'c3d4e5f6-g7h8-9012-3456-789012cdefgh'),
('abcdef01-2345-6789-abcd-ef0123456789', 'Do Yoga', 'Flexibility and relaxation', 20, 'minutes', '[7]', '19:00', 1, NULL, 'c3d4e5f6-g7h8-9012-3456-789012cdefgh'),
('bcdef012-3456-789a-bcde-f01234567890', 'Stretching', 'Maintain flexibility', 10, 'minutes', '[1,2,3,4,5,6,7]', '21:00', 1, NULL, 'c3d4e5f6-g7h8-9012-3456-789012cdefgh'),

-- === LEARNING HABITS ===
('cdef0123-4567-89ab-cdef-012345678901', 'Read Books', 'Daily reading', 30, 'minutes', '[1,2,3,4,5,6,7]', '20:00', 1, NULL, 'd4e5f6g7-h8i9-0123-4567-890123defghi'),
('def01234-5678-9abc-def0-123456789012', 'Study English', 'Language practice', 25, 'minutes', '[1,2,3,4,5]', '19:30', 1, NULL, 'd4e5f6g7-h8i9-0123-4567-890123defghi'),
('ef012345-6789-abcd-ef01-234567890123', 'Practice Coding', 'Improve technical skills', 60, 'minutes', '[1,2,3,4,5]', '20:30', 1, NULL, 'd4e5f6g7-h8i9-0123-4567-890123defghi'),
('f0123456-789a-bcde-f012-345678901234', 'Listen to Educational Podcast', 'Passive learning', 1, 'episode', '[1,2,3,4,5]', '08:30', 1, NULL, 'd4e5f6g7-h8i9-0123-4567-890123defghi'),

-- === FINANCE HABITS ===
('01234567-89ab-cdef-0123-456789012345', 'Track Expenses', 'Daily financial control', 1, 'entry', '[1,2,3,4,5,6,7]', '21:30', 1, NULL, 'e5f6g7h8-i9j0-1234-5678-901234efghij'),
('12345678-9abc-def0-1234-567890123456', 'Save Money', 'Daily savings goal', 20, 'dollars', '[1,2,3,4,5,6,7]', '22:00', 1, NULL, 'e5f6g7h8-i9j0-1234-5678-901234efghij'),
('23456789-abcd-ef01-2345-678901234567', 'Review Investments', 'Monitor portfolio', 1, 'review', '[1,3,5]', '18:30', 1, NULL, 'e5f6g7h8-i9j0-1234-5678-901234efghij'),

-- === HOME HABITS ===
('34567890-bcde-f012-3456-789012345678', 'Cook at Home', 'Prepare homemade meals', 1, 'meal', '[1,2,3,4,5,6,7]', '12:00', 1, NULL, 'f6g7h8i9-j0k1-2345-6789-012345fghijk'),
('45678901-cdef-0123-4567-890123456789', 'Clean House', 'Maintain order', 30, 'minutes', '[2,4,6]', '16:00', 1, NULL, 'f6g7h8i9-j0k1-2345-6789-012345fghijk'),
('56789012-def0-1234-5678-901234567890', 'Care for Plants', 'Watering and care', 1, 'session', '[1,4,7]', '08:00', 1, NULL, 'f6g7h8i9-j0k1-2345-6789-012345fghijk'),

-- === SOCIAL HABITS ===
('67890123-ef01-2345-6789-012345678901', 'Call Family', 'Stay in touch', 1, 'call', '[2,5,7]', '19:00', 1, NULL, 'g7h8i9j0-k1l2-3456-7890-123456ghijkl'),
('78901234-f012-3456-789a-123456789012', 'Contact Friends', 'Active social life', 1, 'contact', '[3,6]', '18:00', 1, NULL, 'g7h8i9j0-k1l2-3456-7890-123456ghijkl'),
('89012345-0123-4567-89ab-234567890123', 'Network', 'Expand professional network', 1, 'contact', '[1,3,5]', '17:30', 1, NULL, 'g7h8i9j0-k1l2-3456-7890-123456ghijkl'),

-- === CREATIVITY HABITS ===
('90123456-1234-5678-9abc-345678901234', 'Write Journal', 'Personal reflection', 1, 'entry', '[1,2,3,4,5,6,7]', '22:30', 1, NULL, 'h8i9j0k1-l2m3-4567-8901-234567hijklm'),
('a0123456-2345-6789-abcd-456789012345', 'Draw or Paint', 'Artistic expression', 30, 'minutes', '[2,4,6,7]', '20:00', 1, NULL, 'h8i9j0k1-l2m3-4567-8901-234567hijklm'),
('b0123456-3456-789a-bcde-567890123456', 'Play Instrument', 'Musical practice', 45, 'minutes', '[1,3,5,7]', '19:00', 1, NULL, 'h8i9j0k1-l2m3-4567-8901-234567hijklm'),

-- === INACTIVE HABITS ===
('c0123456-4567-89ab-cdef-678901234567', 'Quit Smoking', 'Habit to eliminate', 0, 'cigarettes', '[1,2,3,4,5,6,7]', NULL, 0, '2024-12-31', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('d0123456-5678-9abc-def0-789012345678', 'Avoid Sugar', 'Reduce consumption', 0, 'grams', '[1,2,3,4,5,6,7]', NULL, 0, '2024-12-31', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');

-- ===== VIEWS FOR STATISTICS =====
-- Views also benefit from indexes

CREATE VIEW category_stats AS
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

-- View optimized by indexes
CREATE VIEW daily_reminders AS
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

-- ===== QUERIES OPTIMIZED BY INDEXES =====

-- 🚀 FAST: Find active habits of a category (uses idx_habit_category + idx_habit_active)
-- SELECT h.*, c.name as category_name 
-- FROM habit h 
-- JOIN category c ON h.category_uuid = c.uuid 
-- WHERE c.name = 'Health' AND h.is_active = 1;

-- 🚀 FAST: Find habits by UUID (uses idx_habit_uuid)
-- SELECT * FROM habit WHERE uuid = '01234567-89ab-cdef-0123-456789abcdef';

-- 🚀 FAST: Habits due soon (uses idx_habit_due_date)
-- SELECT * FROM habit WHERE due_date <= date('now', '+7 days') AND is_active = 1;

-- Without indexes, these queries would be SLOW on large databases

-- ===== EXPO CRYPTO UUID GENERATION EXAMPLE =====
/*
JavaScript example for generating UUIDs with Expo Crypto:

import * as Crypto from 'expo-crypto';

// Generate UUID for new habit
const createHabit = async (habitData) => {
  const habitUUID = await Crypto.randomUUID();
  const categoryUUID = await Crypto.randomUUID();
  
  return {
    uuid: habitUUID,
    category_uuid: categoryUUID,
    ...habitData,
    created_at: new Date().toISOString()
  };
};

// Usage example:
const newHabit = await createHabit({
  title: 'Daily Meditation',
  description: 'Practice mindfulness',
  target_value: 10,
  target_unit: 'minutes'
});

console.log(newHabit.uuid); // Output: "01234567-89ab-cdef-0123-456789abcdef"
*/