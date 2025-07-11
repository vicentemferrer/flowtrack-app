import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { parseHabitReminders, prepareRemindersForDisplay } from '@/lib/helpers';
import { nextRemindersQuery } from '@/lib/queries';
import { DisplayReminder } from '@/lib/types';
import { useAsyncState } from './useAsyncState';

interface UseRemindersOptions {
	autoRefreshInterval?: number;
	refreshOnAppFocus?: boolean;
	refreshOnDateChange?: boolean;
}

export default function useReminders(qty: number, options: UseRemindersOptions = {}) {
	const {
		data: nextReminders,
		loading,
		error,
		runAsync,
		setData: setNextReminders
	} = useAsyncState<DisplayReminder[]>([]);

	const db = useSQLiteContext();

	const appState = useRef(AppState.currentState);
	const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
	const lastDateRef = useRef(new Date().toDateString());

	const {
		autoRefreshInterval = 60000,
		refreshOnAppFocus = true,
		refreshOnDateChange = true
	} = options;

	const fastLoad = useCallback(async () => {
		return runAsync(async () => {
			const results = await nextRemindersQuery(db, qty);
			const reminders = prepareRemindersForDisplay(parseHabitReminders(results));
			setNextReminders(reminders);
			return reminders;
		});
	}, [db, qty, runAsync, setNextReminders]);

	const loadReminders = useDebouncedCallback(fastLoad, 300, {
		leading: false,
		trailing: true
	});

	const refreshReminders = useCallback(() => {
		loadReminders.flush();
	}, [loadReminders]);

	const checkDateChange = () => {
		const currentDate = new Date().toDateString();
		if (refreshOnDateChange && currentDate !== lastDateRef.current) {
			lastDateRef.current = currentDate;
			loadReminders();
		}
	};

	useEffect(() => {
		fastLoad();
	}, [fastLoad]);

	useEffect(() => {
		return () => {
			loadReminders.cancel();
		};
	}, [loadReminders]);

	useEffect(() => {
		if (!refreshOnAppFocus) return;

		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				checkDateChange();
				loadReminders.flush();
			}
			appState.current = nextAppState;
		};

		const subscription = AppState.addEventListener('change', handleAppStateChange);
		return () => subscription?.remove();
	}, [refreshOnAppFocus, loadReminders]);

	useEffect(() => {
		if (autoRefreshInterval <= 0) return;

		intervalRef.current = setInterval(() => {
			checkDateChange();
			loadReminders();
		}, autoRefreshInterval);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [autoRefreshInterval, loadReminders]);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		reminders: nextReminders,
		loading,
		error,
		refreshReminders,
		isAutoRefreshing: intervalRef.current !== null
	};
}
