import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as authRequests from '~/modules/auth/requests/authRequests';
import LoginForm from '../LoginForm';

vi.mock('~/modules/auth/requests/authRequests', () => ({
	loginRequest: vi.fn(),
}));

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

	it('calls login request on form submission with correct data', async () => {
		const loginInSpy = vi.spyOn(authRequests, 'loginRequest');
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordInput = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: 'pperez' } });
		fireEvent.input(passwordInput, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		expect(usernameField).toHaveValue('pperez');
		expect(passwordInput).toHaveValue('12345678');

		await waitFor(() => expect(loginInSpy).toHaveBeenCalledWith('pperez', '12345678'));
	});

	it('validates form fields data', async () => {
		vi.spyOn(authRequests, 'loginRequest').mockRejectedValueOnce({
			access_token: '',
			refresh_token: '',
			expires: 0,
			expires_at: 0,
		});
		const toastSpy = vi.spyOn(toast, 'error');
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

	it('redirects to home on successful login', async () => {
		vi.spyOn(authRequests, 'loginRequest').mockResolvedValueOnce({
			access_token: '',
			refresh_token: '',
			expires: 0,
			expires_at: 0,
		});
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: 'pperez' } });
		fireEvent.input(passwordField, { target: { value: '12345678' } });
		fireEvent.click(submitButton);
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
	});

	it('shows empty fields error', async () => {
		render(() => <LoginForm />);
		const usernameField = screen.getByPlaceholderText('jose23');
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(usernameField, { target: { value: '' } });
		fireEvent.input(passwordField, { target: { value: '' } });
		fireEvent.click(submitButton);
		const errorusernameField = await screen.findByText('Por favor ingresa el usuario.');
		const errorPasswordField = await screen.findByText('Por favor ingresa la contraseña.');
		expect(errorusernameField).toBeInTheDocument();
		expect(errorPasswordField).toBeInTheDocument();
	});

	it('shows bad length password error', async () => {
		render(() => <LoginForm />);
		const passwordField = screen.getByPlaceholderText('*********');
		const submitButton = screen.getByText('Iniciar sesión');

		fireEvent.input(passwordField, { target: { value: '1' } });
		fireEvent.click(submitButton);
		const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
		expect(errorPasswordField).toBeInTheDocument();
	});
});
