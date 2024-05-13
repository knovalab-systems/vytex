import { USER_STATUS } from '~/utils/constants';
import type { userType } from '../schema/schema';

export const getFilters = (name: string, username: string, status: string) => [
	{
		key: 'name',
		value: name.toLowerCase(),
		filterFunction: (user: userType, value: string) => !value || (user?.name || '').toLowerCase().includes(value),
	},
	{
		key: 'username',
		value: username.toLowerCase(),
		filterFunction: (user: userType, value: string) => !value || (user.username || '').toLowerCase().includes(value),
	},
	{
		key: 'status',
		value: status,
		filterFunction: (user: userType, value: string) =>
			!value ||
			(value === USER_STATUS.inactive
				? user.delete_at !== null
				: value === USER_STATUS.active
					? !user.delete_at
					: true),
	},
];
