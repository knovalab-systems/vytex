import { authentication, createVytexClient, rest } from '@vytex/client';
import { API_ENV } from '~/envs/api';

export const client = createVytexClient(API_ENV)
	.with(rest({ credentials: 'include' }))
	.with(authentication({ credentials: 'include' }));
