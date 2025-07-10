import DBProvider from '@/components/core/DBProvider';
import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<DBProvider dbName='flowtrack.db'>
			<Stack>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			</Stack>
		</DBProvider>
	);
}
