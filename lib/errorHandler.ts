export function errorHandlerSync(fn: () => any, message: string | null = null) {
	try {
		const results = fn();
		return results;
	} catch (err) {
		if (err instanceof Error) {
			const advice = message ?? 'Error';

			console.error(`${advice}: ${err.message}\nCause: ${err.cause ?? 'UNKNOWN'}`);
		}
	}
}

export async function errorHandlerAsync(fn: () => any, message: string | null = null) {
	try {
		const results = await fn();
		return results;
	} catch (err) {
		if (err instanceof Error) {
			const advice = message ?? 'Error';

			console.error(`${advice}: ${err.message}\nCause: ${err.cause ?? 'UNKNOWN'}`);
		}
	}
}
