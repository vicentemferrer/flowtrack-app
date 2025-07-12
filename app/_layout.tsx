import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DBProvider from '@/components/core/DBProvider';

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<DBProvider dbName='flowtrack.db'>
				<Stack>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen
						name='create-habit'
						options={{
							presentation: 'modal',
							headerShown: false
						}}
					/>
				</Stack>
			</DBProvider>
		</SafeAreaProvider>
	);
}
