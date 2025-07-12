import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import InsetView from '@/components/core/InsetView';
import CategorySelector from '@/components/form/CategorySelector';
import WeekDayPicker from '@/components/form/WeekDayPicker';
import useHabitCreation from '@/hooks/useHabitCreation';
import { ActiveDays, HabitFormData } from '@/lib/types';

export default function CreateHabitScreen() {
	const { categories, creating, error, createHabit, validateForm } = useHabitCreation();

	const insets = useSafeAreaInsets();

	const [formData, setFormData] = useState<HabitFormData>({
		title: '',
		description: null,
		target_value: null,
		target_unit: null,
		active_days: [1, 2, 3, 4, 5, 6, 7],
		reminder_time: null,
		due_date: null,
		category_uuid: null
	});

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Format date for display
	const formatDate = (dateString: string | null) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	// Format time for display
	const formatTime = (timeString: string | null) => {
		if (!timeString) return null;
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	};

	const handleInputChange = (field: keyof HabitFormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		if (formErrors[field]) {
			setFormErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const handleActiveDaysChange = (days: number[]) => {
		handleInputChange('active_days', days as ActiveDays);
	};

	const handleTimeChange = (event: any, selectedDate?: Date) => {
		setShowTimePicker(false);
		if (selectedDate) {
			const hours = selectedDate.getHours().toString().padStart(2, '0');
			const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
			const timeString = `${hours}:${minutes}`;
			handleInputChange('reminder_time', timeString);
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			const year = selectedDate.getFullYear();
			const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
			const day = selectedDate.getDate().toString().padStart(2, '0');
			const dateString = `${year}-${month}-${day}`;
			handleInputChange('due_date', dateString);
		}
	};

	const handleSubmit = async () => {
		// Validate form
		const errors = validateForm(formData);
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors as Record<string, string>);
			return;
		}

		// Create habit
		const success = await createHabit(formData);
		if (success) {
			Alert.alert('Success', 'Habit created successfully!', [
				{
					text: 'OK',
					onPress: () => router.back()
				}
			]);
		} else if (error) {
			Alert.alert('Error', error);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	// Get current time for time picker
	const getCurrentTime = () => {
		const now = new Date();
		if (formData.reminder_time) {
			const [hours, minutes] = formData.reminder_time.split(':');
			now.setHours(parseInt(hours, 10), parseInt(minutes, 10));
		}
		return now;
	};

	// Get current date for date picker
	const getCurrentDate = () => {
		const now = new Date();
		if (formData.due_date) {
			return new Date(formData.due_date);
		}
		return now;
	};

	// Get minimum date (today)
	const getMinimumDate = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return today;
	};

	return (
		<InsetView customStyles={{ paddingBottom: insets.bottom }}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable style={styles.cancelButton} onPress={handleCancel}>
						<Ionicons name='close' size={24} color='#666666' />
					</Pressable>
					<Text style={styles.title}>Create Habit</Text>
					<Pressable
						style={[styles.saveButton, creating && styles.saveButtonDisabled]}
						onPress={handleSubmit}
						disabled={creating}>
						<Text style={[styles.saveButtonText, creating && styles.saveButtonTextDisabled]}>
							{creating ? 'Creating...' : 'Save'}
						</Text>
					</Pressable>
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{/* Title */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Title *</Text>
						<TextInput
							style={[styles.textInput, formErrors.title && styles.inputError]}
							placeholder='Enter habit title'
							value={formData.title}
							onChangeText={(text) => handleInputChange('title', text)}
							maxLength={100}
						/>
						{formErrors.title && <Text style={styles.errorText}>{formErrors.title}</Text>}
					</View>

					{/* Description */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							style={[styles.textInput, styles.multilineInput]}
							placeholder='Enter habit description (optional)'
							value={formData.description || ''}
							onChangeText={(text) => handleInputChange('description', text || null)}
							multiline
							numberOfLines={3}
							maxLength={500}
						/>
					</View>

					{/* Category */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Category</Text>
						<CategorySelector
							categories={categories}
							selectedCategory={categories.find((c) => c.uuid === formData.category_uuid) || null}
							onSelect={(category) => handleInputChange('category_uuid', category?.uuid || null)}
							placeholder='Select a category (optional)'
							error={formErrors.category_uuid}
						/>
					</View>

					{/* Target Value and Unit */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Target (optional)</Text>
						<View style={styles.targetContainer}>
							<TextInput
								style={[
									styles.textInput,
									styles.targetValueInput,
									formErrors.target_value && styles.inputError
								]}
								placeholder='Amount'
								value={formData.target_value?.toString() || ''}
								onChangeText={(text) => {
									const numValue = text ? parseInt(text, 10) : null;
									handleInputChange('target_value', numValue);
								}}
								keyboardType='numeric'
							/>
							<TextInput
								style={[
									styles.textInput,
									styles.targetUnitInput,
									formErrors.target_unit && styles.inputError
								]}
								placeholder='Unit'
								value={formData.target_unit || ''}
								onChangeText={(text) => handleInputChange('target_unit', text || null)}
								maxLength={20}
							/>
						</View>
						{formErrors.target_value && (
							<Text style={styles.errorText}>{formErrors.target_value}</Text>
						)}
						{formErrors.target_unit && (
							<Text style={styles.errorText}>{formErrors.target_unit}</Text>
						)}
					</View>

					{/* Active Days */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Active Days</Text>
						<View style={styles.weekDayContainer}>
							<WeekDayPicker
								selectedDays={formData.active_days}
								onDaysChange={handleActiveDaysChange}
							/>
						</View>
					</View>

					{/* Reminder Time */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Reminder Time</Text>
						<Pressable style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
							<Text
								style={[styles.timeButtonText, !formData.reminder_time && styles.placeholderText]}>
								{formData.reminder_time
									? formatTime(formData.reminder_time)
									: 'Set reminder time (optional)'}
							</Text>
							<Ionicons name='time-outline' size={20} color='#A0A0A0' />
						</Pressable>
						{formData.reminder_time && (
							<Pressable
								style={styles.clearButton}
								onPress={() => handleInputChange('reminder_time', null)}>
								<Text style={styles.clearButtonText}>Clear reminder</Text>
							</Pressable>
						)}
					</View>

					{/* Due Date */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Due Date</Text>
						<Pressable
							style={[styles.timeButton, formErrors.due_date && styles.inputError]}
							onPress={() => setShowDatePicker(true)}>
							<Text style={[styles.timeButtonText, !formData.due_date && styles.placeholderText]}>
								{formData.due_date ? formatDate(formData.due_date) : 'Set due date (optional)'}
							</Text>
							<Ionicons name='calendar-outline' size={20} color='#A0A0A0' />
						</Pressable>
						{formErrors.due_date && <Text style={styles.errorText}>{formErrors.due_date}</Text>}
						{formData.due_date && (
							<Pressable
								style={styles.clearButton}
								onPress={() => handleInputChange('due_date', null)}>
								<Text style={styles.clearButtonText}>Clear due date</Text>
							</Pressable>
						)}
					</View>
				</ScrollView>

				{/* Time Picker */}
				{showTimePicker && (
					<DateTimePicker
						value={getCurrentTime()}
						mode='time'
						is24Hour={false}
						onChange={handleTimeChange}
					/>
				)}

				{/* Date Picker */}
				{showDatePicker && (
					<DateTimePicker
						value={getCurrentDate()}
						mode='date'
						minimumDate={getMinimumDate()}
						onChange={handleDateChange}
					/>
				)}
			</KeyboardAvoidingView>
		</InsetView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0'
	},
	cancelButton: {
		padding: 8,
		borderRadius: 8
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#3A5BA0',
		borderRadius: 8
	},
	saveButtonDisabled: {
		backgroundColor: '#A0A0A0'
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600'
	},
	saveButtonTextDisabled: {
		color: '#E0E0E0'
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 20
	},
	inputGroup: {
		marginBottom: 24
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 8
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		backgroundColor: '#FFFFFF',
		color: '#333333'
	},
	multilineInput: {
		height: 80,
		textAlignVertical: 'top'
	},
	inputError: {
		borderColor: '#E53E3E'
	},
	errorText: {
		fontSize: 14,
		color: '#E53E3E',
		marginTop: 4
	},
	targetContainer: {
		flexDirection: 'row',
		gap: 12
	},
	targetValueInput: {
		flex: 1
	},
	targetUnitInput: {
		flex: 1
	},
	weekDayContainer: {
		alignItems: 'center',
		paddingVertical: 8
	},
	timeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		backgroundColor: '#FFFFFF'
	},
	timeButtonText: {
		fontSize: 16,
		color: '#333333'
	},
	placeholderText: {
		color: '#A0A0A0'
	},
	clearButton: {
		marginTop: 8,
		alignSelf: 'flex-start'
	},
	clearButtonText: {
		fontSize: 14,
		color: '#E53E3E',
		fontWeight: '500'
	}
});
