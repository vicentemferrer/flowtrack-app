import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { openDatabaseAsync } from 'expo-sqlite';

import { createIndexes, createTables, createViews } from '@/lib/dbScaffold';
import { errorHandlerAsync } from './errorHandler';

const DB_ASSETS = {
	'flowtrack.db': require('../assets/flowtrack.db')
} as const;

export async function loadDatabase(dbName: string) {
	const isDev = !!__DEV__;

	const targetPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

	const fileInfo = await FileSystem.getInfoAsync(targetPath);

	if (!fileInfo.exists && isDev) {
		await errorHandlerAsync(loadInDevelopment.bind(null, dbName, targetPath), 'Error in DB copy');
	} else {
		console.log('✔️ Database already created.');
		await errorHandlerAsync(loadInProduction.bind(null, dbName), 'Error in DB scaffold');
	}
}

async function loadInDevelopment(dbName: string, targetPath: string) {
	const assetModule = DB_ASSETS[dbName as keyof typeof DB_ASSETS];

	if (!assetModule) {
		throw new Error(
			`Database ${dbName} not found. Available databases: ${Object.keys(DB_ASSETS).join(', ')}`
		);
	}

	const asset = Asset.fromModule(assetModule);

	await asset.downloadAsync();

	await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
		intermediates: true
	});

	await FileSystem.copyAsync({
		from: asset.localUri!,
		to: targetPath
	});

	console.log('📦 Database copied to:', targetPath);
}

async function loadInProduction(dbName: string) {
	const db = await openDatabaseAsync(dbName);

	await createTables(db);

	await createIndexes(db);

	await createViews(db);
}
