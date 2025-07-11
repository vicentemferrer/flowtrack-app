import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
	return (
		<View style={styles.container}>
			<Text>Settings</Text>
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
