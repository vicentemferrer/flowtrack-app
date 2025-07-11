import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import useReminders from '@/hooks/useReminders';
import { HabitReminderDisplay } from '@/lib/types';
import ReminderCard from './ReminderCard';

interface Props {
	onReminderPress?: (uuid: string) => void;
	variant?: 'reminder' | 'habit';
	title?: string;
	cardsQty?: number;
	onShowAllPress?: () => void;
}

export default function RemindersList({
	onReminderPress,
	variant = 'reminder',
	title = 'Next Reminders',
	cardsQty = 5,
	onShowAllPress
}: Props) {
	const { reminders } = useReminders(cardsQty);

	const renderReminderCard = ({ item }: { item: HabitReminderDisplay }) => (
		<ReminderCard reminder={item} onPress={onReminderPress} variant={variant} />
	);

	const renderHeader = () => (
		<View style={styles.listHeader}>
			<Text style={styles.listTitle}>{title}</Text>
			{reminders.length > 3 && (
				<Pressable
					onPress={onShowAllPress}
					style={({ pressed }) => [styles.showAllButton, pressed && styles.showAllButtonPressed]}>
					<Text style={styles.showAllText}>See all</Text>
				</Pressable>
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
