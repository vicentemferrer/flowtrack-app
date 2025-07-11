import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import useReminders from '@/hooks/useReminders';
import { DisplayReminder } from '@/lib/types';
import ReminderCard from './ReminderCard';

interface Props {
	onReminderPress?: (uuid: string) => void;
	variant?: 'reminder' | 'habit';
	title?: string;
	cardsQty?: number;
	autoRefresh?: boolean;
	refreshInterval?: number;
}

export default function RemindersList({
	onReminderPress,
	variant = 'reminder',
	title = 'Next Reminders',
	cardsQty = 5,
	autoRefresh = true,
	refreshInterval = 60000
}: Props) {
	const { reminders, refreshReminders } = useReminders(cardsQty, {
		autoRefreshInterval: autoRefresh ? refreshInterval : 0,
		refreshOnAppFocus: true,
		refreshOnDateChange: true
	});
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshReminders();
		setRefreshing(false);
	};

	const renderReminderCard = ({ item }: { item: DisplayReminder }) => (
		<ReminderCard reminder={item} onPress={onReminderPress} variant={variant} />
	);

	const renderHeader = () => (
		<View style={styles.listHeader}>
			<Text style={styles.listTitle}>{title}</Text>
			{reminders.length >= cardsQty && (
				<Link href='/habits' asChild>
					<Pressable
						style={({ pressed }) => [styles.showAllButton, pressed && styles.showAllButtonPressed]}>
						<Text style={styles.showAllText}>See all habits</Text>
					</Pressable>
				</Link>
			)}
		</View>
	);

	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			<Text style={styles.emptyIcon}>📅</Text>
			<Text style={styles.emptyTitle}>No reminders.</Text>
			<Text style={styles.emptySubtitle}>Your next reminders will be here.</Text>
		</View>
	);

	if (reminders.length === 0) {
		return (
			<View style={styles.container}>
				{renderHeader()}
				{renderEmpty()}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{renderHeader()}
			<FlatList
				data={reminders}
				renderItem={renderReminderCard}
				keyExtractor={(item) => item.uuid}
				contentContainerStyle={styles.listContainer}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						colors={['#3A5BA0']}
						tintColor='#3A5BA0'
						title='Pull to refresh'
						titleColor='#666666'
					/>
				}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 16
	},

	listHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		paddingHorizontal: 4
	},
	listTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	showAllButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6
	},
	showAllButtonPressed: {
		backgroundColor: '#F6F7FA',
		opacity: 0.8
	},
	showAllText: {
		fontSize: 14,
		color: '#3A5BA0',
		fontWeight: '500'
	},

	listContainer: {
		paddingBottom: 150,
		gap: 12
	},

	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 40,
		paddingHorizontal: 20
	},
	emptyIcon: {
		fontSize: 48,
		marginBottom: 16
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#3A5BA0',
		marginBottom: 8
	},
	emptySubtitle: {
		fontSize: 14,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 20
	}
});
