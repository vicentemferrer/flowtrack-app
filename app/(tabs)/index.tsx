import InsetView from '@/components/core/InsetView';

import Header from '@/components/Header';
import RemindersList from '@/components/RemiderList';

export default function Index() {
	return (
		<InsetView>
			<Header />
			<RemindersList />
		</InsetView>
	);
}
