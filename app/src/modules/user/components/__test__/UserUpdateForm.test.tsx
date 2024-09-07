import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import type { GetUserType } from '../../requests/userGet';
import * as requests from '../../requests/userUpdate';
import UserUpdateForm from '../UserUpdateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('UserUpdateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};

		render(() => <UserUpdateForm user={user as GetUserType} />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByText('Contraseña');
		const roleField = screen.getByText('Rol');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(roleField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user as GetUserType} />);

		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');

		fireEvent.input(nameField, { target: { value: '' } });
		fireEvent.input(usernameField, { target: { value: '' } });

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const errorname = await screen.findByText('Ingresa el nombre.');
		const errorusername = screen.getByText('Ingresa el usuario.');

		expect(errorname).toBeInTheDocument();
		expect(errorusername).toBeInTheDocument();
	});

	it('shows bad length password error', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user as GetUserType} />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('shows bad format password error', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user as GetUserType} />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe contener mayúsculas, minúsculas y números.');
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		const requestMock = vi.spyOn(requests, 'updateUserRequest').mockResolvedValue({
			id: '',
			name: null,
			username: null,
			password: null,
			role: null,
			deleted_at: null,
			created_at: null,
			updated_at: null,
			role_id: null,
		});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user as GetUserType} />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');

		// role
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

		// state

		const statusSelect = screen.getByTitle('Ver estados');

		fireEvent(
			statusSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(roleSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxStatus = screen.getByRole('listbox');
		const status = within(listboxStatus).getAllByRole('option');

		fireEvent(
			status[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: 'Passwd12' } });

		const submitButton = screen.getByText('Actualizar');
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
			textExp: 'Error al actualizar usuario.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const err of requestsErrors) {
		it('calls submit succesfully', async () => {
			const requestMock = vi.spyOn(requests, 'updateUserRequest').mockRejectedValue(err.error);
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
			const user = {
				name: 'Jose',
				username: 'jose',
				deleted_at: 'delete',
			};
			render(() => <UserUpdateForm user={user as GetUserType} />);
			const nameField = screen.getByPlaceholderText('Jose Perez');
			const usernameField = screen.getByPlaceholderText('jperez');
			const passwordField = screen.getByPlaceholderText('********');

			// role
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

			// state

			const statusSelect = screen.getByTitle('Ver estados');

			fireEvent(
				statusSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(roleSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxStatus = screen.getByRole('listbox');
			const status = within(listboxStatus).getAllByRole('option');

			fireEvent(
				status[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent.input(nameField, { target: { value: 'John Doe' } });
			fireEvent.input(usernameField, { target: { value: 'jdoe' } });
			fireEvent.input(passwordField, { target: { value: 'Passwd12' } });

			const submitButton = screen.getByText('Actualizar');
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(err.textExp);
			});
		});
	}

	it('calls cancel successfully', async () => {
		render(() => <UserUpdateForm />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});
});
