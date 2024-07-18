import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import UserUpdateForm from '../UserUpdateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('UserUpdateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};

		render(() => <UserUpdateForm user={user} />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByText('Contraseña');
		const roleIdFilterInput = screen.getByText('Rol');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(roleIdFilterInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('check change inputs values ', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user} />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });

		expect(nameField).toHaveValue('John Doe');
		expect(usernameField).toHaveValue('jdoe');
		expect(passwordField).toHaveValue('12345678');
	});

	it('show empty fields error message when submit form', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user} />);

		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');

		fireEvent.input(nameField, { target: { value: '' } });
		fireEvent.input(usernameField, { target: { value: '' } });

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const errorname = await screen.findByText('Ingresa el nombre.');
		const errorusername = await screen.findByText('Ingresa el usuario.');

		expect(errorname).toBeInTheDocument();
		expect(errorusername).toBeInTheDocument();
	});

	it('dont show empty fields error message when submit form', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user} />);
		const nameField = screen.getByPlaceholderText('Jose Perez');
		const usernameField = screen.getByPlaceholderText('jperez');
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(nameField, { target: { value: 'John Doe' } });
		fireEvent.input(usernameField, { target: { value: 'jdoe' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText('Ingresa el nombre.')).not.toBeInTheDocument();
			expect(screen.queryByText('Ingresa el usuario.')).not.toBeInTheDocument();
			expect(screen.queryByText('La contraseña debe ser de mínimo 8 caracteres.')).not.toBeInTheDocument();
		});
	});

	it('shows bad length password error', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: 'delete',
		};
		render(() => <UserUpdateForm user={user} />);
		const passwordField = screen.getByPlaceholderText('********');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('calls cancel successfully', async () => {
		render(() => <UserUpdateForm />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});
});
