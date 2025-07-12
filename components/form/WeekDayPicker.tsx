import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
	selectedDays: number[];
	onDaysChange: (days: number[]) => void;
	style?: any;
}

const DAYS = [
	{ key: 1, label: 'M', name: 'Monday' },
	{ key: 2, label: 'T', name: 'Tuesday' },
	{ key: 3, label: 'W', name: 'Wednesday' },
	{ key: 4, label: 'T', name: 'Thursday' },
	{ key: 5, label: 'F', name: 'Friday' },
	{ key: 6, label: 'S', name: 'Saturday' },
	{ key: 7, label: 'S', name: 'Sunday' }
];

export default function WeekDayPicker({ selectedDays, onDaysChange, style }: Props) {
	const toggleDay = (dayKey: number) => {
		const newDays = selectedDays.includes(dayKey)
			? selectedDays.filter((day) => day !== dayKey)
			: [...selectedDays, dayKey].sort((a, b) => a - b);

		onDaysChange(newDays);
	};

	return (
		<View style={[styles.container, style]}>
			{DAYS.map((day) => (
				<Pressable
					key={day.key}
					style={[styles.dayButton, selectedDays.includes(day.key) && styles.selectedDayButton]}
					onPress={() => toggleDay(day.key)}
					accessibilityLabel={`Toggle ${day.name}`}
					accessibilityRole='button'>
					<Text style={[styles.dayText, selectedDays.includes(day.key) && styles.selectedDayText]}>
						{day.label}
					</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		paddingVertical: 8
	},
	dayButton: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: '#F5F5F5',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 4
	},
	selectedDayButton: {
		backgroundColor: '#3A5BA0'
	},
	dayText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#666666'
	},
	selectedDayText: {
		color: '#FFFFFF'
	}
});
