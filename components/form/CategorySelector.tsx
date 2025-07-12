import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryOption } from '@/lib/types';

interface Props {
	categories: CategoryOption[];
	selectedCategory: CategoryOption | null;
	onSelect: (category: CategoryOption | null) => void;
	error?: string;
	placeholder?: string;
}

const { width } = Dimensions.get('window');

export default function CategorySelector({
	categories,
	selectedCategory,
	onSelect,
	error,
	placeholder = 'Select a category'
}: Props) {
	const [isVisible, setIsVisible] = useState(false);

	const handleSelect = (category: CategoryOption | null) => {
		onSelect(category);
		setIsVisible(false);
	};

	return (
		<View style={styles.container}>
			<Pressable
				style={[styles.selector, error && styles.selectorError]}
				onPress={() => setIsVisible(true)}>
				<View style={styles.selectorContent}>
					{selectedCategory ? (
						<View style={styles.selectedCategory}>
							<Ionicons name={selectedCategory.icon as any} size={20} color='#3A5BA0' />
							<Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
						</View>
					) : (
						<Text style={styles.placeholder}>{placeholder}</Text>
					)}
				</View>
				<Ionicons name='chevron-down' size={20} color='#A0A0A0' />
			</Pressable>

			{error && <Text style={styles.errorText}>{error}</Text>}

			<Modal
				visible={isVisible}
				animationType='fade'
				transparent
				onRequestClose={() => setIsVisible(false)}>
				<Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
					<View style={styles.modal}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Select Category</Text>
							<Pressable style={styles.closeButton} onPress={() => setIsVisible(false)}>
								<Ionicons name='close' size={24} color='#666666' />
							</Pressable>
						</View>

						<ScrollView style={styles.categoriesList}>
							<Pressable
								style={[styles.categoryItem, !selectedCategory && styles.categoryItemSelected]}
								onPress={() => handleSelect(null)}>
								<View style={styles.categoryContent}>
									<Ionicons name='remove-circle-outline' size={24} color='#A0A0A0' />
									<Text style={styles.categoryText}>No Category</Text>
								</View>
								{!selectedCategory && <Ionicons name='checkmark' size={20} color='#3A5BA0' />}
							</Pressable>

							{categories.map((category) => (
								<Pressable
									key={category.uuid}
									style={[
										styles.categoryItem,
										selectedCategory?.uuid === category.uuid && styles.categoryItemSelected
									]}
									onPress={() => handleSelect(category)}>
									<View style={styles.categoryContent}>
										<Ionicons name={category.icon as any} size={24} color='#3A5BA0' />
										<Text style={styles.categoryText}>{category.name}</Text>
									</View>
									{selectedCategory?.uuid === category.uuid && (
										<Ionicons name='checkmark' size={20} color='#3A5BA0' />
									)}
								</Pressable>
							))}
						</ScrollView>
					</View>
				</Pressable>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16
	},
	selector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		minHeight: 48
	},
	selectorError: {
		borderColor: '#E53E3E'
	},
	selectorContent: {
		flex: 1
	},
	selectedCategory: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	selectedCategoryText: {
		fontSize: 16,
		color: '#333333',
		fontWeight: '500'
	},
	placeholder: {
		fontSize: 16,
		color: '#A0A0A0'
	},
	errorText: {
		fontSize: 14,
		color: '#E53E3E',
		marginTop: 4,
		marginLeft: 4
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		width: width * 0.85,
		maxHeight: '70%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 5
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0'
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#3A5BA0'
	},
	closeButton: {
		padding: 4
	},
	categoriesList: {
		maxHeight: 300
	},
	categoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F5F5F5'
	},
	categoryItemSelected: {
		backgroundColor: '#F0F4FF'
	},
	categoryContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	categoryText: {
		fontSize: 16,
		color: '#333333',
		fontWeight: '500'
	}
});
