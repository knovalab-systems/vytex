import { ADMIN_ROLE, NO_ROLE } from './env';

export const QUERY_LIMIT = 20;

export const USER_STATUS = {
	active: 'true',
	inactive: 'false',
};

export const USER_STATUS_OPTIONS = [
	{ label: 'Activo', value: USER_STATUS.active },
	{ label: 'Inactivo', value: USER_STATUS.inactive },
];

export const USER_ROLES_OPTIONS = [
	{ label: 'Administrador', value: ADMIN_ROLE },
	{ label: 'Sin rol', value: NO_ROLE },
];
