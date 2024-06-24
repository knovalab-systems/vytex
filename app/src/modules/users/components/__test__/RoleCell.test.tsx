import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installPointerEvent } from '~/utils/event';
import RoleCell from '../RoleCell';

window.scrollTo = vi.fn(() => {});

vi.mock('~/utils/roles', () => ({
	roles: {
		admin: {
			label: 'Administrador',
			key: 'admin',
		},
		none: {
			label: 'Sin rol',
			key: 'none',
		},
	},
	roleList: [
		{
			label: 'Administrador',
			key: 'admin',
		},
		{
			label: 'Sin rol',
			key: 'none',
		},
	],
}));

describe('RoleCell', () => {
	installPointerEvent();

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <RoleCell roleValue='admin' userId='1' />);

		const roleName = screen.getByText('Administrador');
		const triggerButton = screen.getByRole('button');

		expect(triggerButton).toBeInTheDocument();
		expect(roleName).toBeInTheDocument();
	});

	it('renders correctly dialog', () => {
		render(() => <RoleCell roleValue='admin' userId='1' />);

		const triggerButton = screen.getByTitle('Actualizar rol');
		fireEvent.click(triggerButton);

		const dialgoTitle = screen.getByText('Actualizar rol');

		expect(dialgoTitle).toBeInTheDocument();
	});

	it('renders correctly after close dialog', () => {
		render(() => <RoleCell roleValue='admin' userId='1' />);

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
		render(() => <RoleCell roleValue='admin' userId='1' />);

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
});
