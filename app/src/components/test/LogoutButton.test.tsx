import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as logoutRequests from '~/modules/auth/requests/logoutRequests';
import LogoutButton from '../LogoutButton';

vi.mock('~/modules/auth/requests/logoutRequests', () => ({
	logoutRequest: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

afterEach(() => {
	vi.clearAllMocks();
});

describe('LogoutButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <LogoutButton navigateTo="/" />);

		const logoutButton = screen.getByText('Logout');

		expect(logoutButton).toBeInTheDocument();
	});

	it('calls logout request on button click', async () => {
		const logoutSpy = vi.spyOn(logoutRequests, 'logoutRequest');

		render(() => <LogoutButton navigateTo="/" />);

		const logoutButton = screen.getByText('Logout');

		fireEvent.click(logoutButton);

		await waitFor(() => expect(logoutSpy).toHaveBeenCalled());
	});

	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(logoutRequests, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutButton navigateTo="/login" />);

		const logoutButton = screen.getByText('Logout');

		fireEvent.click(logoutButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true }));
	});
});
