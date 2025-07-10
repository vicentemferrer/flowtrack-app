export function errorHandlerSync(fn: () => any, message: string | null = null) {
	try {
		fn();
	} catch (err) {
		if (err instanceof Error) {
			const advice = message ?? 'Error';

			console.error(`${advice}: ${err.message}\nCause: ${err.cause ?? 'UNKNOWN'}`);
		}
	}
}

export async function errorHandlerAsync(fn: () => any, message: string | null = null) {
	try {
		await fn();
	} catch (err) {
		if (err instanceof Error) {
			const advice = message ?? 'Error';

			console.error(`${advice}: ${err.message}\nCause: ${err.cause ?? 'UNKNOWN'}`);
		}
	}
}
