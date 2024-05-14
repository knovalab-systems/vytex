import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as logoutRequest from '~/modules/auth/requests/authRequests';
import LogoutButton from '../LogoutButton';

vi.mock('~/modules/auth/requests/logoutRequests', () => ({
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
		render(() => <LogoutButton />);

		const logoutButton = screen.getByText('Cerrar sesión');

		expect(logoutButton).toBeInTheDocument();
	});


	it('opens modal on button click', () => {
		render(() => <LogoutButton />);

		const logoutButton = screen.getByText('Cerrar sesión');

		fireEvent.click(logoutButton);

		expect(screen.getByText('Confirmar')).toBeInTheDocument();
	});

	it('calls logout request on modal confirmation', async () => {
		const logoutSpy = vi.spyOn(logoutRequest, 'logoutRequest');

		render(() => <LogoutButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		const confirmButton = screen.getByText('Confirmar');
		fireEvent.click(confirmButton);

		await waitFor(() => expect(logoutSpy).toHaveBeenCalled());
	});


	it('redirects to provided path on successful logout', async () => {
		vi.spyOn(logoutRequest, 'logoutRequest').mockResolvedValueOnce();

		render(() => <LogoutButton />);

		const logoutButton = screen.getByText('Cerrar sesión');
		fireEvent.click(logoutButton);

		const confirmButton = screen.getByText('Confirmar');
		fireEvent.click(confirmButton);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?reason=LOG_OUT'));
	});
});
