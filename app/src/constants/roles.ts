import { ADMIN_ROLE, DESIGNER_ROLE, NO_ROLE } from '~/envs/roles';
import { adminPermissions, designerRolePermissions, noRolePermissions } from '../constants/permissions';

export interface RoleItem {
	label: string;
	key: string;
	type: RoleType;
}

export const roles: Record<string, RoleItem> = {
	[ADMIN_ROLE]: {
		label: 'Administrador',
		key: ADMIN_ROLE,
		type: 'admin',
	},
	[DESIGNER_ROLE]: {
		label: 'Diseñadora',
		key: DESIGNER_ROLE,
		type: 'designer',
	},
	[NO_ROLE]: {
		label: 'Sin rol',
		key: NO_ROLE,
		type: 'norole',
	},
};

export const roleList: RoleItem[] = Object.values(roles);

export const rolePermissions: Record<string, Record<string, string | boolean>> = {
	[ADMIN_ROLE]: adminPermissions,
	[NO_ROLE]: noRolePermissions,
	[DESIGNER_ROLE]: designerRolePermissions,
};

export type AdminRole = 'admin';
export type NoRole = 'norole';
export type DesignerRole = 'designer';
export type RoleType = AdminRole | NoRole | DesignerRole;
