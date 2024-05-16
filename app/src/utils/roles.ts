import { ADMIN_ROLE, NO_ROLE } from './env';

export const roles: Record<string, RoleItems> = {
	[ADMIN_ROLE]: {
		name: 'Administrador',
		role: ADMIN_ROLE,
	},
	[NO_ROLE]: {
		name: 'Sin rol',
		role: NO_ROLE,
	},
};

export interface RoleItems {
	name: string;
	role: string;
}

export const listRole: RoleItems[] = [
	{
		name: 'Administrador',
		role: ADMIN_ROLE,
	},
	{
		name: 'Sin rol',
		role: NO_ROLE,
	},
];
