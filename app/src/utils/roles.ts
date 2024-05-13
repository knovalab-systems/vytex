import { ADMIN_ROLE, NO_ROLE } from './env';

export const roles: Record<string, Record<'name', string>> = {
	[ADMIN_ROLE]: {
		name: 'Administrador',
	},
	[NO_ROLE]: {
		name: 'Sin rol',
	},
};
