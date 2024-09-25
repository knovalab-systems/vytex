import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as requests from '../../requests/roleCreate';
import RoleCreateForm from '../RoleCreateForm';

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

const refetchMock = vi.fn();
vi.mock('~/hooks/useRoles', () => ({
	refetchRoles: () => refetchMock(),
}));

describe('UserCreateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <RoleCreateForm />);
		const nameField = screen.getByPlaceholderText('Nombre del rol');
		const policiesLabel = screen.getByText('Funciones');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(policiesLabel).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <RoleCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const policiesError = screen.getByText('Marca al menos una función.');

		expect(nameError).toBeInTheDocument();
		expect(policiesError).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'createRoleRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success');
		render(() => <RoleCreateForm />);

		const nameField = screen.getByPlaceholderText('Nombre del rol');
		fireEvent.input(nameField, { target: { value: 'Role' } });

		const roleField = screen.getByPlaceholderText('Ver usuarios');
		fireEvent.click(roleField);

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalled();
			expect(refetchMock).toHaveBeenCalled();
		});
	});

	it('calls submit with error', async () => {
		// @ts-ignore: no need return value
		const requestMock = vi.spyOn(requests, 'createRoleRequest').mockRejectedValue({});
		const toastMock = vi.spyOn(toast, 'error');
		render(() => <RoleCreateForm />);

		const nameField = screen.getByPlaceholderText('Nombre del rol');
		fireEvent.input(nameField, { target: { value: 'Role' } });

		const roleField = screen.getByPlaceholderText('Ver usuarios');
		fireEvent.click(roleField);

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(navigateMock).not.toHaveBeenCalled();
			expect(refetchMock).not.toHaveBeenCalled();
		});
	});
});
