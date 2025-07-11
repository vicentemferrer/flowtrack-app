import { StyleSheet, Text, View } from 'react-native';

export default function TracksScreen() {
	return (
		<View style={styles.container}>
			<Text>Tracks</Text>
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
