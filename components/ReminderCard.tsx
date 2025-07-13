import { DisplayReminder, ScheduleType } from '@/lib/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const getScheduleTypeColor = (scheduleType: ScheduleType): string => {
	switch (scheduleType) {
		case 'today':
			return '#7FB069';
		case 'tomorrow':
			return '#9BB1DD';
		case 'later':
			return '#A0A0A0';
		default:
			return '#A0A0A0';
	}
};

const getScheduleTypeText = (scheduleType: ScheduleType): string => {
	switch (scheduleType) {
		case 'today':
			return 'Today';
		case 'tomorrow':
			return 'Tomorrow';
		case 'later':
			return 'Later';
		default:
			return 'Scheduled';
	}
};

interface Props {
	reminder: DisplayReminder;
	onPress?: (uuid: string) => void;
	variant?: 'reminder' | 'habit';
}

export default function ReminderCard({ reminder, onPress, variant = 'reminder' }: Props) {
	return (
		<Pressable
			style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
			onPress={() => onPress?.(reminder.uuid)}>
			<View style={styles.cardHeader}>
				<View style={styles.iconContainer}>
					<FontAwesome5 name={`${reminder.categoryIcon}`} style={styles.iconText} />
				</View>
				<View style={styles.headerInfo}>
					<Text style={styles.categoryName}>{reminder.categoryName || 'General'}</Text>
					<View
						style={[
							styles.scheduleTypeBadge,
							{ backgroundColor: getScheduleTypeColor(reminder.scheduleType) }
						]}>
						<Text style={styles.scheduleTypeText}>
							{getScheduleTypeText(reminder.scheduleType)}
						</Text>
					</View>
				</View>
				<Text style={styles.timeText}>{reminder.displayTime}</Text>
			</View>

			<View style={styles.cardContent}>
				<Text style={styles.title} numberOfLines={2}>
					{reminder.title}
				</Text>

				{reminder.description && (
					<Text style={styles.description} numberOfLines={2}>
						{reminder.description}
					</Text>
				)}

				{reminder.targetText && (
					<View style={styles.targetContainer}>
						<Text style={styles.targetText}>Goal: {reminder.targetText}</Text>
					</View>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 16,
		shadowColor: '#3A5BA0',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
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
		marginBottom: 12
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F6F7FA',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12
	},
	iconText: {
		fontSize: 20
	},
	headerInfo: {
		flex: 1
	},
	categoryName: {
		fontSize: 12,
		color: '#666666',
		fontWeight: '500',
		marginBottom: 4
	},
	scheduleTypeBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10
	},
	scheduleTypeText: {
		fontSize: 10,
		color: '#FFFFFF',
		fontWeight: '600',
		textTransform: 'uppercase'
	},
	timeText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	cardContent: {
		gap: 8
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A',
		lineHeight: 22
	},
	description: {
		fontSize: 14,
		color: '#666666',
		lineHeight: 20
	},
	targetContainer: {
		marginTop: 4
	},
	targetText: {
		fontSize: 12,
		color: '#3A5BA0',
		fontWeight: '500'
	}
});
