import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const getCurrentDate = () => {
		const today = new Date();
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		return today.toLocaleDateString('en-US', options);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDate(new Date());
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.welcomeText}>Welcome!</Text>
			<Text style={styles.dateText}>{getCurrentDate()}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 16,
		paddingHorizontal: 4,
		marginBottom: 8
	},
	welcomeText: {
		fontSize: 28,
		fontWeight: '700',
		color: '#3A5BA0',
		marginBottom: 4
	},
	dateText: {
		fontSize: 16,
		color: '#666666',
		fontWeight: '500'
	}
});
