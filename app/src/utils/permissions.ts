export const permissions = {
	readUsers: {
		key: 'readUsers',
		label: 'Ver usuarios',
	},
	createUser: {
		key: 'createUser',
		label: 'Crear usuarios',
	},
	updateUser: {
		key: 'updateUser',
		label: 'Actualizar usuarios',
	},
	readRoles: {
		key: 'readRoles',
		label: 'Ver roles',
	},
};

const handlerProxyPermissions = {
	get: (target: Record<string, string | boolean>, name: string) => (Object.hasOwn(target, name) ? target[name] : false),
};

export const adminPermissions = new Proxy(
	{
		[permissions.readUsers.key]: true,
		[permissions.createUser.key]: true,
		[permissions.updateUser.key]: true,
		[permissions.readRoles.key]: true,
	},
	handlerProxyPermissions,
);

export const noRolePermissions = new Proxy(
	{ [permissions.readUsers.key]: 'Solo el mismo usuario' },
	handlerProxyPermissions,
);
