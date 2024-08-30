import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import * as requests from '../../requests/userCreate';
import UserCreateForm from '../UserCreateForm';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

describe('UserCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <UserCreateForm />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByText('Contraseña');
		const roleField = screen.getByText('Selecciona un rol');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(roleField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <UserCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const usernameError = screen.getByText('Ingresa el usuario.');
		const passwordError = screen.getByText('Ingresa la contraseña.');
		const roleError = screen.getByText('Selecciona un rol.');

		expect(nameError).toBeInTheDocument();
		expect(usernameError).toBeInTheDocument();
		expect(passwordError).toBeInTheDocument();
		expect(roleError).toBeInTheDocument();
	});

	it('shows bad length password error', async () => {
		render(() => <UserCreateForm />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('shows bad format password error', async () => {
		render(() => <UserCreateForm />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe contener mayúsculas, minúsculas y números.');
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		const requestMock = vi.spyOn(requests, 'createUserRequest').mockResolvedValue({
			id: '',
			name: null,
			username: null,
			password: null,
			role: null,
			deleted_at: null,
			created_at: null,
			updated_at: null,
		});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		render(() => <UserCreateForm />);

		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');
		const roleSelect = screen.getByTitle('Ver roles');

		fireEvent(
			roleSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(roleSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxRol = screen.getByRole('listbox');
		const roles = within(listboxRol).getAllByRole('option');

		fireEvent(
			roles[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(roles[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: 'Passwd12' } });

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El nombre de usuario "jdoe" no está disponible. Intente con otro.',
			error: {
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al crear usuario.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const err of requestsErrors) {
		it(err.title, async () => {
			const requestMock = vi.spyOn(requests, 'createUserRequest').mockRejectedValue(err.error);
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
			render(() => <UserCreateForm />);

			const nameField = screen.getByPlaceholderText('Jose Perez');
			const usernameField = screen.getByPlaceholderText('jperez');
			const passwordField = screen.getByPlaceholderText('********');
			const roleSelect = screen.getByTitle('Ver roles');

			fireEvent(
				roleSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(roleSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxRol = screen.getByRole('listbox');
			const roles = within(listboxRol).getAllByRole('option');

			fireEvent(
				roles[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(roles[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent.input(nameField, { target: { value: 'John Doe' } });
			fireEvent.input(usernameField, { target: { value: 'jdoe' } });
			fireEvent.input(passwordField, { target: { value: 'Passwd12' } });

			const submitButton = screen.getByText('Crear');
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(err.textExp);
			});
		});
	}

	it('calls cancel successfully', async () => {
		render(() => <UserCreateForm />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(navigateMock).toHaveBeenCalled();
	});
});
