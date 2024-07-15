import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserCreateForm from '../UserCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('UserCreateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <UserCreateForm />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByText('Contraseña');
		const roleIdFilterInput = screen.getByText('Selecciona un rol');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(roleIdFilterInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('check change inputs values ', async () => {
		render(() => <UserCreateForm />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');
		const roleIdFilterInput = screen.getByText('Selecciona un rol');

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });

		expect(nameField).toHaveValue('John Doe');
		expect(usernameField).toHaveValue('jdoe');
		expect(passwordField).toHaveValue('12345678');
		expect(roleIdFilterInput).toHaveValue('admin');
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <UserCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const errorname = await screen.findByText('Ingresa el nombre.');
		const errorusername = await screen.findByText('Ingresa el usuario.');
		const errorpassword = await screen.findByText('Ingresa la contraseña.');

		expect(errorname).toBeInTheDocument();
		expect(errorusername).toBeInTheDocument();
		expect(errorpassword).toBeInTheDocument();
	});

	it('dont show empty fields error message when submit form', async () => {
		render(() => <UserCreateForm />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');
		const roleIdFilterInput = screen.getByText('Selecciona un rol');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText('Ingresa el nombre.')).not.toBeInTheDocument();
			expect(screen.queryByText('Ingresa el usuario./')).not.toBeInTheDocument();
			expect(screen.queryByText('Ingresa la contraseña./')).not.toBeInTheDocument();
		});
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
});
