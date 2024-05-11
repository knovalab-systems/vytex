import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogoutNavButton from '../LogoutNavButton';
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import * as logoutRequest from '../../requests/authRequests';

vi.mock('../../requests/authRequests', () => ({
	logoutRequest: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
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

	it('calls logout request on button click', async () => {
		const logoutSpy = vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValue();
		render(() => <LogoutNavButton />);
		const logoutButton = screen.getByText('Cerrar sesión');

		fireEvent.click(logoutButton);
		await waitFor(() => expect(logoutSpy).toHaveBeenCalled());
	});

	it('redirects to login path on successful logout', async () => {
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValue();
		render(() => <LogoutNavButton />);
		const logoutButton = screen.getByText('Cerrar sesión');

		fireEvent.click(logoutButton);
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?reason=LOG_OUT'));
	});
});
