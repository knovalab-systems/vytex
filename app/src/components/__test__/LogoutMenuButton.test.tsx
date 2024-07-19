import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as auth from '~/hooks/useAuth';
import LogoutMenuButton from '../LogoutMenuButton';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('Logout nav button', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <LogoutMenuButton />);

		const logoutButton = screen.getByText('Cerrar sesión');

		expect(logoutButton).toBeInTheDocument();
	});

	it('logs out on button click', async () => {
		const logoutMock = vi.fn().mockResolvedValueOnce({});
		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			logout: logoutMock,
			authStatus: () => 'authenticated',
			login: () => Promise.resolve(),
		}));

		render(() => <LogoutMenuButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutMock).toHaveBeenCalled());
	});

	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(auth, 'useAuth').mockReturnValue({
			logout: () => Promise.resolve(),
			authStatus: () => 'authenticated',
			login: () => Promise.resolve(),
		});

		render(() => <LogoutMenuButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
	});
});
