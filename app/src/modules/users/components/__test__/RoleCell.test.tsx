import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RoleCell from '../RoleCell';

window.scrollTo = vi.fn(() => {});

vi.mock('~/utils/roles', () => ({
	roles: {
		admin: {
			name: 'Administrador',
			role: 'admin',
		},
		none: {
			name: 'Sin rol',
			role: 'none',
		},
	},
	listRole: [
		{
			name: 'Administrador',
			role: 'admin',
		},
		{
			name: 'Sin rol',
			role: 'none',
		},
	],
}));

describe('RoleCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <RoleCell roleValue='admin' id='1' />);

		const roleName = screen.getByText('Administrador');
		const triggerButton = screen.getByRole('button');

		expect(triggerButton).toBeInTheDocument();
		expect(roleName).toBeInTheDocument();
	});

	it('renders correctly dialog', () => {
		render(() => <RoleCell roleValue='admin' id='1' />);

		const triggerButton = screen.getByRole('button');
		fireEvent.click(triggerButton);

		const dialgoTitle = screen.getByText('Actualizar rol');

		expect(dialgoTitle).toBeInTheDocument();
	});

	it('renders correctly after close dialog', () => {
		render(() => <RoleCell roleValue='admin' id='1' />);

		const triggerButton = screen.getByRole('button');
		fireEvent.click(triggerButton);

		const closeButton = screen.getByText('Cancelar');
		fireEvent.click(closeButton);

		const roleName = screen.getByText('Administrador');

		expect(roleName).toBeInTheDocument();
	});

	it('renders correctly after save with same role', () => {
		render(() => <RoleCell roleValue='admin' id='1' />);

		const triggerButton = screen.getByRole('button');
		fireEvent.click(triggerButton);

		const saveButton = screen.getByText('Guardar');
		fireEvent.click(saveButton);

		const roleName = screen.getByText('Administrador');
		expect(roleName).toBeInTheDocument();
	});
});
