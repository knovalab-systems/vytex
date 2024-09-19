import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import RoleCell from '../RoleCell';

window.scrollTo = vi.fn(() => {});
const hasPolicyMock = vi.fn();

vi.mock('~/hooks/usePolicies', () => ({
	usePolicies: () => ({
		hasPolicy: () => true,
	}),
}));

vi.mock('~/hooks/useRoles', () => ({
	useRoles: () => ({
		roles: () => [{ id: 'admin', name: 'Administrador' }],
		rolesRecord: () => ({ admin: { id: 'admin', name: 'Administrador' } }),
	}),
}));

describe('RoleCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly dialog', () => {
		render(() => <RoleCell roleId='admin' userId='1' />);

		const triggerButton = screen.getByTitle('Actualizar rol');
		fireEvent.click(triggerButton);

		const dialgoTitle = screen.getByText('Actualizar rol');

		expect(dialgoTitle).toBeInTheDocument();
	});

	it('renders correctly after close dialog', () => {
		render(() => <RoleCell roleId='admin' userId='1' />);

		const roleNameBefore = screen.getByText('Administrador'); //  there is only one
		expect(roleNameBefore).toBeInTheDocument();

		const triggerButton = screen.getByTitle('Actualizar rol');
		fireEvent.click(triggerButton);

		const roleNameInDialog = screen.getAllByText('Administrador'); // getByText error, there is more than one by select
		expect(roleNameInDialog.length).greaterThan(0);

		const closeButton = screen.getByText('Cancelar');
		fireEvent.click(closeButton);

		const roleNameAfter = screen.getByText('Administrador');
		expect(roleNameAfter).toBeInTheDocument(); // there is only one again
	});

	it('renders correctly after save', () => {
		render(() => <RoleCell roleId='admin' userId='1' />);

		const roleNameBefore = screen.getByText('Administrador'); //  there is only one
		expect(roleNameBefore).toBeInTheDocument();

		const triggerButton = screen.getByTitle('Actualizar rol');
		fireEvent.click(triggerButton);

		const roleNameInDialog = screen.getAllByText('Administrador'); // getByText error there is more than one by select
		expect(roleNameInDialog.length).greaterThan(0);

		const saveButton = screen.getByText('Guardar');
		fireEvent.click(saveButton);

		const roleNameAfter = screen.getByText('Administrador');
		expect(roleNameAfter).toBeInTheDocument(); // there is only one again
	});

	it('renders correctly without update users policy', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return false;
			},
		});
		render(() => <RoleCell roleId='admin' userId='1' />);

		const triggerButton = screen.queryByTitle('Actualizar rol');

		expect(triggerButton).not.toBeInTheDocument();

		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});

	it('renders correctly with update users policy', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});
		render(() => <RoleCell roleId='admin' userId='1' />);

		const roleName = screen.getByText('Administrador');
		const triggerButton = screen.getByRole('button');

		expect(triggerButton).toBeInTheDocument();
		expect(roleName).toBeInTheDocument();
		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});
});
