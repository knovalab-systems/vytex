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

export const MESSAGES = {
	logout: {
		title: 'Cerrar sesión',
		description: '¿Estás seguro que deseas cerrar sesión?',
		confirm: 'Sessión cerrada correctamente',
		error: 'Error al cerrar sesión',
	},
	session: {
		expired: 'Tu sesión ha expirado, por favor vuelve a iniciar sesión',
		successful: 'Sesión iniciada correctamente',
		error: 'Error al iniciar sesión, por favor intenta de nuevo',
	},
	auth: {
		error: 'Revisa tu usuario y contraseña',
		password: 'La contraseña debe tener al menos 8 caracteres',
	},
};
