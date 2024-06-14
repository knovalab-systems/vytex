import { ADMIN_ROLE, DESIGNER_ROLE, NO_ROLE } from './env';
import { designerRolePermissions, adminPermissions, noRolePermissions } from './permissions';

export interface RoleItems {
	label: string;
	key: string;
}

export const roles: Record<string, RoleItems> = {
	[ADMIN_ROLE]: {
		label: 'Administrador',
		key: ADMIN_ROLE,
	},
	[DESIGNER_ROLE]: {
		label: 'Diseñadora',
		key: DESIGNER_ROLE,
	},
	[NO_ROLE]: {
		label: 'Sin rol',
		key: NO_ROLE,
	},
};

export const roleList: RoleItems[] = Object.values(roles);

export const rolePermissions: Record<string, Record<string, string | boolean>> = {
	[ADMIN_ROLE]: adminPermissions,
	[NO_ROLE]: noRolePermissions,
	[DESIGNER_ROLE]: designerRolePermissions,
};
