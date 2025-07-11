import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HabitParsed } from '@/lib/types';
import HabitCard from './HabitCard';

interface Props {
	habits: HabitParsed[];
	onHabitPress?: (uuid: string) => void;
	onSeeAll?: () => void;
	initialOpen?: boolean;
}

export default function InactiveHabitsDropdown({
	habits,
	onHabitPress,
	onSeeAll,
	initialOpen = false
}: Props) {
	const [isOpen, setIsOpen] = useState(initialOpen);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleSeeAll = () => {
		onSeeAll?.();
	};

	if (habits.length === 0) {
		return null;
	}

	const habitsQty = `${habits.length} habit${habits.length !== 1 ? 's' : ''}`;

	return (
		<View style={styles.container}>
			<Pressable
				style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
				onPress={toggleOpen}>
				<View style={styles.headerLeft}>
					<View style={styles.iconContainer}>
						<FontAwesome5 name='archive' style={styles.categoryIcon} />
					</View>
					<View style={styles.headerTextContainer}>
						<Text style={styles.categoryName}>Inactive Habits</Text>
						<Text style={styles.habitCount}>{habitsQty}</Text>
					</View>
				</View>
				<View style={styles.headerRight}>
					{habits.length >= 3 && (
						<Pressable
							onPress={handleSeeAll}
							style={({ pressed }) => [styles.seeAllButton, pressed && styles.seeAllButtonPressed]}>
							<Text style={styles.seeAllText}>See all</Text>
						</Pressable>
					)}
					<FontAwesome5 name={isOpen ? 'chevron-up' : 'chevron-down'} style={styles.chevronIcon} />
				</View>
			</Pressable>

			{isOpen && (
				<View style={styles.content}>
					{habits.map((habit) => (
						<HabitCard
							key={habit.uuid}
							habit={habit}
							onPress={onHabitPress}
							categoryIcon='archive'
							categoryName='Inactive'
						/>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		backgroundColor: '#FFF5F5',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#FED7D7'
	},
	headerPressed: {
		opacity: 0.8
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12
	},
	categoryIcon: {
		fontSize: 18,
		color: '#E53E3E'
	},
	headerTextContainer: {
		flex: 1
	},
	categoryName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A',
		marginBottom: 2
	},
	habitCount: {
		fontSize: 12,
		color: '#666666',
		fontWeight: '500'
	},
	headerRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	seeAllButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6
	},
	seeAllButtonPressed: {
		backgroundColor: '#FED7D7',
		opacity: 0.8
	},
	seeAllText: {
		fontSize: 12,
		color: '#E53E3E',
		fontWeight: '500'
	},
	chevronIcon: {
		fontSize: 12,
		color: '#666666'
	},
	content: {
		marginTop: 8,
		paddingHorizontal: 4
	}
});
