import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateForm from '../CreateForm';

vi.mock('~/modules/users/requests/createUserRequests', () => ({
	createUserRequest: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('CreateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <CreateForm />);
		const nameField = screen.getByPlaceholderText(/jose perez/i);
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByText('Contraseña');
		const roleIdFilterInput = screen.getByText('Selecciona un rol');
		const submitButton = screen.getByText('Guardar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(roleIdFilterInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('check change inputs values ', async () => {
		render(() => <CreateForm />);
		const nameField = screen.getByPlaceholderText(/jose perez/i);
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
		render(() => <CreateForm />);
		const submitButton = screen.getByText('Guardar');
		fireEvent.click(submitButton);

		const errorname = await screen.findByText(/Por favor ingresa el nombre./i);
		const errorusername = await screen.findByText(/Por favor ingresa el usuario./i);
		const errorpassword = await screen.findByText(/Por favor ingresa la contraseña./i);

		expect(errorname).toBeInTheDocument();
		expect(errorusername).toBeInTheDocument();
		expect(errorpassword).toBeInTheDocument();
	});

	it('dont show empty fields error message when submit form', async () => {
		render(() => <CreateForm />);
		const nameField = screen.getByPlaceholderText(/jose perez/i);
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');
		const roleIdFilterInput = screen.getByText('Selecciona un rol');
		const submitButton = screen.getByText('Guardar');

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText(/Por favor ingresa el nombre./i)).not.toBeInTheDocument();
			expect(screen.queryByText(/Por favor ingresa el usuario./i)).not.toBeInTheDocument();
			expect(screen.queryByText(/Por favor ingresa la contraseña./i)).not.toBeInTheDocument();
		});
	});

	it('shows bad length password error', async () => {
		render(() => <CreateForm />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Guardar');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});
});
