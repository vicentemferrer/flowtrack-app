import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import CategoryDropdown from '@/components/CategoryDropdown';
import InsetView from '@/components/core/InsetView';
import InactiveHabitsDropdown from '@/components/InactiveHabitsDropdown';
import useHabits from '@/hooks/useHabits';

export default function HabitsScreen() {
	const { habitsByCategory, inactiveHabits, loading, error, refreshHabits } = useHabits();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshHabits();
		setRefreshing(false);
	};

	const handleHabitPress = (uuid: string) => {
		// TODO: Implementar navegación al detalle del hábito
		console.log('Habit pressed:', uuid);
	};

	const handleCategorySeeAll = (categoryUuid: string) => {
		// TODO: Implementar filtros para mostrar todos los hábitos de la categoría
		console.log('Category see all:', categoryUuid);
	};

	const handleInactiveSeeAll = () => {
		// TODO: Implementar filtros para mostrar todos los hábitos inactivos
		console.log('Inactive see all');
	};

	if (error) {
		return (
			<InsetView>
				<View style={styles.centerContainer}>
					<Text style={styles.errorText}>Error: {error}</Text>
				</View>
			</InsetView>
		);
	}

	return (
		<InsetView>
			<View style={styles.header}>
				<Text style={styles.title}>My Habits</Text>
				<Text style={styles.subtitle}>Organize your daily routines</Text>
			</View>

			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
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
				showsVerticalScrollIndicator={false}>
				{loading && habitsByCategory.length === 0 ? (
					<View style={styles.centerContainer}>
						<Text style={styles.loadingText}>Loading habits...</Text>
					</View>
				) : (
					<>
						{habitsByCategory.length === 0 ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyIcon}>📝</Text>
								<Text style={styles.emptyTitle}>No habits yet</Text>
								<Text style={styles.emptySubtitle}>Create your first habit to get started</Text>
							</View>
						) : (
							<>
								{habitsByCategory.map((categoryData) => (
									<CategoryDropdown
										key={categoryData.category.uuid}
										category={categoryData.category}
										habits={categoryData.habits}
										onHabitPress={handleHabitPress}
										onSeeAll={handleCategorySeeAll}
										initialOpen={true}
									/>
								))}

								<InactiveHabitsDropdown
									habits={inactiveHabits}
									onHabitPress={handleHabitPress}
									onSeeAll={handleInactiveSeeAll}
									initialOpen={false}
								/>
							</>
						)}
					</>
				)}
			</ScrollView>
		</InsetView>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 16
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#3A5BA0',
		marginBottom: 4
	},
	subtitle: {
		fontSize: 14,
		color: '#666666',
		fontWeight: '500'
	},
	content: {
		flex: 1
	},
	contentContainer: {
		paddingHorizontal: 16,
		paddingBottom: 100
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 40
	},
	loadingText: {
		fontSize: 16,
		color: '#666666',
		fontWeight: '500'
	},
	errorText: {
		fontSize: 16,
		color: '#E53E3E',
		fontWeight: '500',
		textAlign: 'center'
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 60,
		paddingHorizontal: 20
	},
	emptyIcon: {
		fontSize: 64,
		marginBottom: 16
	},
	emptyTitle: {
		fontSize: 20,
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
