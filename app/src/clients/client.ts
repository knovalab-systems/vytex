import { authentication, createVytexClient, rest } from '@vytex/client';

export const client = createVytexClient('http://localhost:8080/api/v1')
	.with(rest({ credentials: 'include' }))
	.with(authentication('cookie', { credentials: 'include' }));
