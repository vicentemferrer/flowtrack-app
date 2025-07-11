import { StyleSheet, Text, View } from 'react-native';

export default function HabitsScreen() {
	return (
		<View style={styles.container}>
			<Text>Habits</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 50,
		backgroundColor: '#fff'
	}
});
