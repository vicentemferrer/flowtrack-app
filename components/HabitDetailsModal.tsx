import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HabitWithCategoryParsed } from '@/lib/types';

interface Props {
	habit: HabitWithCategoryParsed | null;
	visible: boolean;
	onClose: () => void;
	onEdit: (habitUuid: string) => void;
	onDelete: (habitUuid: string) => void;
}

const { width } = Dimensions.get('window');

export default function HabitDetailsModal({ habit, visible, onClose, onEdit, onDelete }: Props) {
	if (!habit) return null;

	const formatActiveDays = (activeDays: number[]): string => {
		const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		return activeDays.map((day) => dayNames[day - 1]).join(', ');
	};

	const formatDate = (dateString: string | null): string => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatCreatedAt = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	return (
		<Modal visible={visible} animationType='fade' transparent onRequestClose={onClose}>
			<Pressable style={styles.overlay} onPress={onClose}>
				<View style={styles.modal}>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.headerLeft}>
							<View style={styles.iconContainer}>
								<FontAwesome5 name={habit.category?.icon || 'circle'} size={20} color='#3A5BA0' />
							</View>
							<View>
								<Text style={styles.categoryName}>{habit.category?.name || 'Uncategorized'}</Text>
								<Text style={styles.createdAt}>Created {formatCreatedAt(habit.created_at)}</Text>
							</View>
						</View>
						<Pressable style={styles.closeButton} onPress={onClose}>
							<FontAwesome5 name='times' size={24} color='#666666' />
						</Pressable>
					</View>

					{/* Content */}
					<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
						{/* Title */}
						<View style={styles.section}>
							<Text style={styles.title}>{habit.title}</Text>
							{habit.description && <Text style={styles.description}>{habit.description}</Text>}
						</View>

						{/* Schedule */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Schedule</Text>
							<View style={styles.scheduleContainer}>
								<View style={styles.scheduleItem}>
									<FontAwesome5 name='calendar-alt' size={16} color='#3A5BA0' />
									<Text style={styles.scheduleText}>{formatActiveDays(habit.active_days)}</Text>
								</View>
								{habit.reminder_time && (
									<View style={styles.scheduleItem}>
										<FontAwesome5 name='clock' size={16} color='#3A5BA0' />
										<Text style={styles.scheduleText}>{habit.reminder_time}</Text>
									</View>
								)}
							</View>
						</View>

						{/* Target */}
						{habit.target_value && habit.target_unit && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Target</Text>
								<View style={styles.targetContainer}>
									<FontAwesome5 name='bullseye' size={16} color='#7FB069' />
									<Text style={styles.targetText}>
										{habit.target_value} {habit.target_unit}
									</Text>
								</View>
							</View>
						)}

						{/* Due Date */}
						{habit.due_date && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Due Date</Text>
								<View style={styles.dueDateContainer}>
									<FontAwesome5 name='calendar-check' size={16} color='#FF6B6B' />
									<Text style={styles.dueDateText}>{formatDate(habit.due_date)}</Text>
								</View>
							</View>
						)}

						{/* Status */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Status</Text>
							<View style={styles.statusContainer}>
								<View
									style={[
										styles.statusBadge,
										habit.is_active
											? styles.statusActiveBackground
											: styles.statusInactiveBackground
									]}>
									<Text
										style={[
											styles.statusText,
											habit.is_active ? styles.statusActiveText : styles.statusInactiveText
										]}>
										{habit.is_active ? 'Active' : 'Inactive'}
									</Text>
								</View>
							</View>
						</View>
					</ScrollView>

					{/* Action Buttons */}
					<View style={styles.actions}>
						<Pressable
							style={({ pressed }) => [
								styles.actionButton,
								styles.editButton,
								pressed && styles.actionButtonPressed
							]}
							onPress={() => onEdit(habit.uuid)}>
							<FontAwesome5 name='edit' size={16} color='#3A5BA0' />
							<Text style={styles.editButtonText}>Edit Habit</Text>
						</Pressable>

						<Pressable
							style={({ pressed }) => [
								styles.actionButton,
								styles.deleteButton,
								pressed && styles.actionButtonPressed
							]}
							onPress={() => onDelete(habit.uuid)}>
							<FontAwesome5 name='trash-alt' size={16} color='#E53E3E' />
							<Text style={styles.deleteButtonText}>Delete Habit</Text>
						</Pressable>
					</View>
				</View>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	modal: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		width: width * 0.9,
		maxHeight: '85%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 8,
		overflow: 'hidden'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0'
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
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
	categoryName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#3A5BA0',
		marginBottom: 2
	},
	createdAt: {
		fontSize: 12,
		color: '#666666',
		fontWeight: '400'
	},
	closeButton: {
		padding: 8,
		marginLeft: 12
	},
	content: {
		maxHeight: 400,
		paddingHorizontal: 20
	},
	section: {
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F8F8F8'
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1A1A1A',
		marginBottom: 8,
		lineHeight: 26
	},
	description: {
		fontSize: 14,
		color: '#666666',
		lineHeight: 20
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#3A5BA0',
		marginBottom: 12
	},
	scheduleContainer: {
		gap: 8
	},
	scheduleItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	scheduleText: {
		fontSize: 14,
		color: '#333333',
		fontWeight: '500'
	},
	targetContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	targetText: {
		fontSize: 14,
		color: '#333333',
		fontWeight: '500'
	},
	dueDateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	dueDateText: {
		fontSize: 14,
		color: '#333333',
		fontWeight: '500'
	},
	statusContainer: {
		flexDirection: 'row'
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		alignSelf: 'flex-start'
	},
	statusActiveBackground: {
		backgroundColor: '#E8F5E8'
	},
	statusInactiveBackground: {
		backgroundColor: '#FFF0F0'
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600'
	},
	statusActiveText: {
		color: '#7FB069'
	},
	statusInactiveText: {
		color: '#E53E3E'
	},
	actions: {
		flexDirection: 'row',
		padding: 20,
		gap: 12,
		borderTopWidth: 1,
		borderTopColor: '#F0F0F0'
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		gap: 8
	},
	actionButtonPressed: {
		opacity: 0.8,
		transform: [{ scale: 0.98 }]
	},
	editButton: {
		backgroundColor: '#F0F4FF',
		borderWidth: 1,
		borderColor: '#3A5BA0'
	},
	editButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	deleteButton: {
		backgroundColor: '#FFF0F0',
		borderWidth: 1,
		borderColor: '#E53E3E'
	},
	deleteButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#E53E3E'
	}
});
