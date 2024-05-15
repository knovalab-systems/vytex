export const QUERY_LIMIT = 20;

export const USER_STATUS = {
	active: 'activo',
	inactive: 'inactivo',
};

export const USER_ROLE = {
	1: 'Admin',
	2: 'Operario',
	3: 'Invitado',
	4: 'Desarrollador',
};

export const USER_STATUS_OPTIONS = [
	{ label: 'Activo', value: USER_STATUS.active },
	{ label: 'Inactivo', value: USER_STATUS.inactive },
];

export const USER_ROLES_OPTIONS = [
	{ label: 'Administrador', value: 1 },
	{ label: 'Operario', value: 2 },
	{ label: 'Invitado', value: 3 },
	{ label: 'Desarrollador', value: 4 },
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
