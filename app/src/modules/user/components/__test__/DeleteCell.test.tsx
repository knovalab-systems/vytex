import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as request from '../../requests/userUpdate';
import DeletedAtCell from '../DeletedAtCell';

describe('DeleteCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with  active state', () => {
		render(() => <DeletedAtCell deleted_at={null} userId='1' />);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('renders correctly with no active state', () => {
		render(() => <DeletedAtCell deleted_at={'admin'} userId='1' />);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('changes active to no active', () => {
		render(() => <DeletedAtCell deleted_at={null} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockResolvedValueOnce({
			id: '',
			name: null,
			username: null,
			password: null,
			role: null,
			deleted_at: null,
			created_at: null,
			updated_at: null,
		});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('changes no active to active', () => {
		render(() => <DeletedAtCell deleted_at={'admin'} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockResolvedValueOnce({
			id: '',
			name: null,
			username: null,
			password: null,
			role: null,
			deleted_at: null,
			created_at: null,
			updated_at: null,
		});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('fails active to no active', () => {
		render(() => <DeletedAtCell deleted_at={'admin'} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockRejectedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Activo');
		expect(statusLabel).toBeInTheDocument();
	});

	it('fails no active to active', () => {
		render(() => <DeletedAtCell deleted_at={null} userId='1' />);
		vi.spyOn(request, 'updateUserRequest').mockRejectedValueOnce({});

		const checkButton = screen.getByRole('switch');
		fireEvent.click(checkButton);

		const statusLabel = screen.getByText('Inactivo');
		expect(statusLabel).toBeInTheDocument();
	});
});
