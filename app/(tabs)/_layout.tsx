import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false
				// tabBarActiveTintColor: '#ffd33d',
				// tabBarStyle: {
				// 	backgroundColor: '#25292e'
				// }
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
					)
				}}
			/>
		</Tabs>
	);
}
