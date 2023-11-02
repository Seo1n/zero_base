import { QueryClient } from 'react-query';

function queryErrorHandler(error: unknown): void {
	const title =
		error instanceof Error ? error.message : 'error connecting to server';
	// eslint-disable-next-line no-alert
	alert(title);
}

export function generateQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				onError: queryErrorHandler,
				staleTime: 600000, // 10 minutes
				cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false
			},
			mutations: {
				onError: queryErrorHandler
			}
		}
	});
}

export const queryClient = generateQueryClient();
