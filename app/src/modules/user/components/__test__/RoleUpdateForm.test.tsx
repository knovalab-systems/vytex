import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROLES_PATH } from '~/constants/paths';
import * as requests from '../../requests/roleUpdate';
import RoleUpdateForm from '../RoleUpdateForm';

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

	it('renders correctly without code', () => {
		render(() => <RoleUpdateForm role={{ name: '', code: null, policies: [], id: '1123' }} />);
		const nameField = screen.getByPlaceholderText('Nombre del rol');
		const policiesLabel = screen.getByText('Funciones');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(policiesLabel).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('renders correctly with code', async () => {
		render(() => <RoleUpdateForm role={{ name: '', code: 'admin', policies: [], id: '1123' }} />);
		const nameField = screen.getByPlaceholderText('Nombre del rol');
		const policiesLabel = screen.getByText('Funciones');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(policiesLabel).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();

		await waitFor(() => {
			expect(navigateMock).toBeCalledWith(ROLES_PATH);
		});
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <RoleUpdateForm role={{ name: 'jose', code: null, policies: [], id: '1123' }} />);

		const nameField = screen.getByPlaceholderText('Nombre del rol');
		fireEvent.input(nameField, { target: { value: '' } });

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const policiesError = screen.getByText('Marca al menos una función.');

		expect(nameError).toBeInTheDocument();
		expect(policiesError).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateRoleRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success');
		render(() => <RoleUpdateForm role={{ name: 'jose', code: null, policies: [], id: '1123' }} />);

		const nameField = screen.getByPlaceholderText('Nombre del rol');
		fireEvent.input(nameField, { target: { value: 'Role' } });

		const roleField = screen.getByPlaceholderText('Ver usuarios');
		fireEvent.click(roleField);

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalled();
			expect(refetchMock).toHaveBeenCalled();
		});
	});

	it('calls submit with no change policies', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateRoleRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'error');
		render(() => (
			<RoleUpdateForm
				role={{ name: 'jose', code: null, policies: ['ReadColors', 'ReadUsers', 'ReadCustoms'], id: '1123' }}
			/>
		));

		const submitButton = screen.getByText('Actualizar');

		const readColorsField = screen.getByPlaceholderText('Ver colores');

		const readCustomsField = screen.getByPlaceholderText('Ver pedidos');

		const readUsersField = screen.getByPlaceholderText('Ver usuarios');

		await Promise.all([
			[fireEvent.click(readColorsField), fireEvent.click(readCustomsField), fireEvent.click(readUsersField)],
		]);

		await Promise.all([
			[fireEvent.click(readColorsField), fireEvent.click(readCustomsField), fireEvent.click(readUsersField)],
		]);
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).not.toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(navigateMock).not.toHaveBeenCalled();
			expect(refetchMock).not.toHaveBeenCalled();
		});
	});

	it('calls submit with server error', async () => {
		// @ts-ignore: no need return value
		const requestMock = vi.spyOn(requests, 'updateRoleRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success');
		render(() => <RoleUpdateForm role={{ name: 'jose', code: null, policies: [], id: '1123' }} />);

		const nameField = screen.getByPlaceholderText('Nombre del rol');
		fireEvent.input(nameField, { target: { value: 'Role' } });

		const roleField = screen.getByPlaceholderText('Ver usuarios');
		fireEvent.click(roleField);

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalled();
			expect(refetchMock).toHaveBeenCalled();
		});
	});
});
