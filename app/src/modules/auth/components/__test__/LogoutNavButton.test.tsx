import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as logoutRequest from '../../requests/authRequests';
import LogoutNavButton from '../LogoutNavButton';

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


	it('opens modal on button click', () => {
		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');

		fireEvent.click(logoutButton);

		expect(screen.getByText('Confirmar')).toBeInTheDocument();
	});

	it('calls logout request on modal confirmation', async () => {
		const logoutSpy = vi.spyOn(logoutRequest, 'logoutRequest');

		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		const confirmButton = screen.getByText('Confirmar');
		fireEvent.click(confirmButton);

		await waitFor(() => expect(logoutSpy).toHaveBeenCalled());
	});


	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutNavButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		const confirmButton = screen.getByText('Confirmar');
		fireEvent.click(confirmButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?reason=LOG_OUT'));
	});
});
