import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import RoleTable from '../RoleTable';

describe('Role Table', () => {
	it('renders correctly on empty roles', () => {
		render(() => <RoleTable roles={[]} rolePermmissions={{}} permissions={[]} />);
		const tableHeader = screen.getByText('Función');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on roles', () => {
		const roles = [
			{
				label: 'Administrador',
				key: 'admin',
			},
			{
				label: 'Sin rol',
				key: 'no',
			},
		];

		const handlerProxyPermissions = {
			get: (target: Record<string, string | boolean>, name: string) =>
				Object.hasOwn(target, name) ? target[name] : false,
		};

		const adminPermissions = new Proxy(
			{
				read: true,
				create: true,
				update: true,
			},
			handlerProxyPermissions,
		);

		const noRolePermissions = new Proxy({ read: 'Solo el mismo usuario' }, handlerProxyPermissions);

		const rolePermissions: Record<string, Record<string, string | boolean>> = {
			admin: adminPermissions,
			no: noRolePermissions,
		};

		const permissions = [
			{
				key: 'read',
				label: 'Ver usuarios',
			},
			{
				key: 'create',
				label: 'Crear usuarios',
			},
			{
				key: 'update',
				label: 'Actualizar usuarios',
			},
		];

		render(() => <RoleTable roles={roles} rolePermmissions={rolePermissions} permissions={permissions} />);
		const textPermission = screen.getByText('Solo el mismo usuario');
		const truePermission = screen.getAllByText('Sí');
		const falsePermission = screen.getAllByText('No');

		expect(textPermission).toBeInTheDocument();
		expect(truePermission).not.toBeNull();
		expect(falsePermission).not.toBeNull();
	});
});
