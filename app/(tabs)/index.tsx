import { StyleSheet, View } from 'react-native';

import Header from '@/components/Header';
import RemindersList from '@/components/RemiderList';

export default function Index() {
	return (
		<View style={styles.container}>
			<Header />
			<RemindersList />
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
