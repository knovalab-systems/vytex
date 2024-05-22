import { ADMIN_ROLE, NO_ROLE } from './env';
import { adminPermissions, noRolePermissions } from './permissions';

export interface RoleItems {
	name: string;
	role: string;
}

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

export const roleList: RoleItems[] = [
	{
		name: 'Administrador',
		role: ADMIN_ROLE,
	},
	{
		name: 'Sin rol',
		role: NO_ROLE,
	},
];

export const rolePermissions: Record<string, Record<string, string | boolean>> = {
	[ADMIN_ROLE]: adminPermissions,
	[NO_ROLE]: noRolePermissions,
};
