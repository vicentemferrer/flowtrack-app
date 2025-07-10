import { DatabaseDebugger } from '@/components/DatabaseDebugger';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
	return (
		<View style={styles.container}>
			<DatabaseDebugger />
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
