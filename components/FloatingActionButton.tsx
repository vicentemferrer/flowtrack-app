import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, RelativePathString } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
	href: string;
	onPress?: () => void;
}

export default function FloatingActionButton({ href, onPress }: Props) {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { bottom: 88 + insets.bottom + 16 }]}>
			<Link href={href as RelativePathString} asChild>
				<Pressable
					style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
					onPress={onPress}>
					<Ionicons name='add' size={24} color='#FFFFFF' />
				</Pressable>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		right: 20,
		zIndex: 1000
	},
	button: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#3A5BA0',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#3A5BA0',
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8
	},
	buttonPressed: {
		backgroundColor: '#2A4A90',
		transform: [{ scale: 0.95 }]
	}
});
