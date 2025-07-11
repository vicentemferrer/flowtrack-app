import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	children: ReactNode;
};

export default function InsetView({ children }: Props) {
	const insets = useSafeAreaInsets();

	return <View style={[styles.container, { paddingTop: insets.top + 20 }]}>{children}</View>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff'
	}
});
