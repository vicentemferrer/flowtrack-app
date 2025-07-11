import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HabitWithCategoryParsed } from '@/lib/types';

interface Props {
	habit: HabitWithCategoryParsed;
	onPress?: (uuid: string) => void;
	categoryIcon?: string;
	categoryName?: string;
}

export default function HabitCard({ habit, onPress, categoryIcon, categoryName }: Props) {
	const formatActiveDays = (activeDays: number[]): string => {
		const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
		return activeDays.map((day) => dayNames[day - 1]).join(', ');
	};

	return (
		<Pressable
			style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
			onPress={() => onPress?.(habit.uuid)}>
			<View style={styles.cardHeader}>
				<View style={styles.iconContainer}>
					<FontAwesome5 name={categoryIcon || 'circle'} style={styles.iconText} />
				</View>
				<View style={styles.headerInfo}>
					<Text style={styles.categoryName}>{categoryName || 'General'}</Text>
					<View style={styles.activeDaysContainer}>
						<Text style={styles.activeDaysText}>{formatActiveDays(habit.active_days)}</Text>
					</View>
				</View>
				{habit.reminder_time && <Text style={styles.timeText}>{habit.reminder_time}</Text>}
			</View>

			<View style={styles.cardContent}>
				<Text style={styles.title} numberOfLines={2}>
					{habit.title}
				</Text>

				{habit.description && (
					<Text style={styles.description} numberOfLines={2}>
						{habit.description}
					</Text>
				)}

				{habit.target_value && habit.target_unit && (
					<View style={styles.targetContainer}>
						<Text style={styles.targetText}>
							Goal: {habit.target_value} {habit.target_unit}
						</Text>
					</View>
				)}

				{habit.due_date && (
					<View style={styles.dueDateContainer}>
						<Text style={styles.dueDateText}>
							Due: {new Date(habit.due_date).toLocaleDateString()}
						</Text>
					</View>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
		shadowColor: '#3A5BA0',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 1,
		borderColor: '#F0F0F0'
	},
	cardPressed: {
		opacity: 0.8,
		transform: [{ scale: 0.98 }]
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	},
	iconContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#F6F7FA',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	},
	iconText: {
		fontSize: 14,
		color: '#3A5BA0'
	},
	headerInfo: {
		flex: 1
	},
	categoryName: {
		fontSize: 10,
		color: '#666666',
		fontWeight: '500',
		marginBottom: 2
	},
	activeDaysContainer: {
		alignSelf: 'flex-start'
	},
	activeDaysText: {
		fontSize: 9,
		color: '#7FB069',
		fontWeight: '500'
	},
	timeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	cardContent: {
		gap: 6
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1A1A1A',
		lineHeight: 18
	},
	description: {
		fontSize: 12,
		color: '#666666',
		lineHeight: 16
	},
	targetContainer: {
		marginTop: 2
	},
	targetText: {
		fontSize: 10,
		color: '#3A5BA0',
		fontWeight: '500'
	},
	dueDateContainer: {
		marginTop: 2
	},
	dueDateText: {
		fontSize: 10,
		color: '#FF6B6B',
		fontWeight: '500'
	}
});
