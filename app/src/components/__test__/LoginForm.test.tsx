import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import * as auth from '~/hooks/useAuth';
import LoginForm from '../LoginForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('LoginForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		expect(usernameField).toBeInTheDocument();
		expect(passwordField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).not.toBeDisabled();
	});

	it('shows error on request', async () => {
		const toastSpy = vi.spyOn(toast, 'error');
		const loginMock = vi.fn().mockRejectedValueOnce({});
		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			login: loginMock,
			authStatus: () => 'unauthenticated',
			logout: () => Promise.resolve(),
		}));

		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordInput = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: 'pperez' } });
		fireEvent.input(passwordInput, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		await waitFor(() => {
			expect(toastSpy).toHaveBeenCalledWith('Revisa tu usuario y contraseña');
		});
	});

	it('logins succesfully', async () => {
		const loginMock = vi.fn().mockResolvedValueOnce({});
		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			login: loginMock,
			authStatus: () => 'unauthenticated',
			logout: () => Promise.resolve(),
		}));
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: 'pperez' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		await waitFor(() => expect(loginMock).toHaveBeenCalledWith('pperez', '12345678'));
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
	});

	it('shows empty fields error', async () => {
		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			login: () => Promise.resolve(),
			authStatus: () => 'unauthenticated',
			logout: () => Promise.resolve(),
		}));
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: '' } });
		fireEvent.input(passwordField, { target: { value: '' } });
		fireEvent.click(submitButton);
		const errorusernameField = await screen.findByText('Ingresa el usuario.');
		const errorPasswordField = await screen.findByText('Ingresa la contraseña.');
		expect(errorusernameField).toBeInTheDocument();
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('shows bad length password error', async () => {
		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			login: () => Promise.resolve(),
			authStatus: () => 'unauthenticated',
			logout: () => Promise.resolve(),
		}));
		render(() => <LoginForm />);
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});
});
