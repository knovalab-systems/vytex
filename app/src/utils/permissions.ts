export const permissions = {
	readUsers: {
		key: 'readUsers',
		value: 'Ver usuarios',
	},
	updateUser: {
		key: 'updateUser',
		value: 'Actualizar usuarios',
	},
	readRoles: {
		key: 'readRoles',
		value: 'Ver roles',
	},
};

const handlerProxyPermissions = {
	get: (target: Record<string, string | boolean>, name: string) => (Object.hasOwn(target, name) ? target[name] : false),
};

export const adminPermissions = new Proxy(
	{
		[permissions.readUsers.key]: true,
		[permissions.updateUser.key]: true,
		[permissions.readRoles.key]: true,
	},
	handlerProxyPermissions,
);

export const noRolePermissions = new Proxy(
	{ [permissions.readUsers.key]: 'Solo el mismo usuario' },
	handlerProxyPermissions,
);
