import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { errorHandlerAsync } from '@/lib/errorHandler';
import { parseHabitReminders, prepareRemindersForDisplay } from '@/lib/helpers';
import { nextRemindersQuery } from '@/lib/queries';
import { HabitReminderDisplay } from '@/lib/types';

export default function useReminders(qty: number) {
	const db = useSQLiteContext();
	const [nextReminders, setNextReminders] = useState<HabitReminderDisplay[]>(
		[] as HabitReminderDisplay[]
	);

	useEffect(() => {
		async function getNextReminders() {
			const results = await errorHandlerAsync(nextRemindersQuery.bind(null, db, qty));

			setNextReminders(prepareRemindersForDisplay(parseHabitReminders(results)));
		}

		getNextReminders();
	}, [db, qty]);

	return { reminders: nextReminders };
}
