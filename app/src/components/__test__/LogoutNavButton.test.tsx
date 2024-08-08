import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as auth from '~/hooks/useAuth';
import LogoutNavButton from '../LogoutNavButton';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

describe('Logout nav button', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');

		expect(logoutButton).toBeInTheDocument();
	});

	it('logs out succesfully', async () => {
		const logoutMock = vi.fn().mockResolvedValueOnce({});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('Success');

		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			logout: logoutMock,
			authStatus: () => 'authenticated',
			login: () => Promise.resolve(),
		}));

		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutMock).toHaveBeenCalled());
		await waitFor(() => expect(toastMock).toHaveBeenCalled());
		await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login'));
	});

	it('logs out error', async () => {
		const logoutMock = vi.fn().mockRejectedValue({});
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

		vi.spyOn(auth, 'useAuth').mockImplementation(() => ({
			logout: logoutMock,
			authStatus: () => 'authenticated',
			login: () => Promise.resolve(),
		}));

		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutMock).toHaveBeenCalled());
		await waitFor(() => expect(toastMock).toHaveBeenCalled());
		await waitFor(() => expect(navigateMock).not.toHaveBeenCalled());
	});
});
