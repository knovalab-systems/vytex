import { type CoreSchema, authentication, createVytexClient, rest } from '@vytex/client';
import { API_ENV } from '~/envs/api';

export const client = createVytexClient<CoreSchema>(API_ENV)
	.with(rest({ credentials: 'include' }))
	.with(authentication({ credentials: 'include' }));
