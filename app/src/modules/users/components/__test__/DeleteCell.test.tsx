import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as request from '../../requests/userUpdateRequests';
import DeleteAtCell from '../DeleteAtCell';

describe('DeleteCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with  active state', () => {
		render(() => <DeleteAtCell delete_at={null} userId='1' />);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('renders correctly with no active state', () => {
		render(() => <DeleteAtCell delete_at={'admin'} userId='1' />);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('changes active to no active', () => {
		render(() => <DeleteAtCell delete_at={null} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockResolvedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('changes no active to active', () => {
		render(() => <DeleteAtCell delete_at={'admin'} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockResolvedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('fails active to no active', () => {
		render(() => <DeleteAtCell delete_at={'admin'} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockRejectedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('fails no active to active', () => {
		render(() => <DeleteAtCell delete_at={null} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockRejectedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});
});
