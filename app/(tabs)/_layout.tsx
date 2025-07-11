import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#3A5BA0',
				tabBarInactiveTintColor: '#A0A0A0',
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					borderTopWidth: 1,
					borderTopColor: '#F0F0F0',
					height: 88,
					paddingTop: 8,
					paddingBottom: 24,
					shadowColor: '#3A5BA0',
					shadowOffset: {
						width: 0,
						height: -2
					},
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 5
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: '500',
					marginTop: 4
				},
				tabBarItemStyle: {
					paddingVertical: 4
				}
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
					)
				}}
			/>

			<Tabs.Screen
				name='habits'
				options={{
					title: 'My Habits',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'}
							color={color}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name='tracks'
				options={{
					title: 'Stats',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />
					)
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
					)
				}}
			/>
		</Tabs>
	);
}
