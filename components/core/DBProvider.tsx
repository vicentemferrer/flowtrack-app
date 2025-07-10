import { loadDatabase } from '@/lib/loadDatabase';
import { SQLiteProvider } from 'expo-sqlite';
import { ReactNode, Suspense } from 'react';

type Props = {
	children: ReactNode;
	dbName: string;
};

export default function DBProvider({ children, dbName }: Props) {
	return (
		<Suspense fallback={<></>}>
			<SQLiteProvider databaseName={dbName} onInit={loadDatabase.bind(null, dbName)}>
				{children}
			</SQLiteProvider>
		</Suspense>
	);
}
