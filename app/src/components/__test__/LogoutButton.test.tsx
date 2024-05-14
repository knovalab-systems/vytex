import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as logoutRequest from '~/modules/auth/requests/authRequests';
import LogoutButton from '../LogoutButton';

vi.mock('~/modules/auth/requests/authRequests', () => ({
	logoutRequest: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('LogoutButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <LogoutButton navigateTo='/' />);

		const logoutButton = screen.getByText('Logout');

		expect(logoutButton).toBeInTheDocument();
	});

	it('calls logout request on button click', async () => {
		const logoutSpy = vi.spyOn(logoutRequest, 'logoutRequest');

		render(() => <LogoutButton navigateTo='/' />);

		const logoutButton = screen.getByText('Logout');

		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutSpy).toHaveBeenCalled());
	});

	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutButton navigateTo='/login' />);

		const logoutButton = screen.getByText('Logout');

		fireEvent.click(logoutButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?reason=LOG_OUT', { replace: true }));
	});
});
