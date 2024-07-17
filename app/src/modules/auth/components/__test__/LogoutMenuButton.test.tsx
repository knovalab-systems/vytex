import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as logoutRequest from '../../requests/auth';
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
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutMenuButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutRequest.logoutRequest).toHaveBeenCalled());
	});

	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutMenuButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?reason=LOG_OUT'));
	});
});
