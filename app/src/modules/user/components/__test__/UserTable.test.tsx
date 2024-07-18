import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetUsersType } from '../../requests/userGet';
import UserTable from '../UserTable';

const mockRole = vi.fn();
vi.mock('../RoleCell', () => ({
	default: () => {
		mockRole();
		return <td>Role</td>;
	},
}));

const mockActions = vi.fn();
vi.mock('../ActionsCell', () => ({
	default: () => {
		mockActions();
		return <td>Actions</td>;
	},
}));

describe('User Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty users', () => {
		render(() => <UserTable users={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron usuarios.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on users', () => {
		const users: GetUsersType = [
			{
				id: '123',
				name: null,
				username: null,
				role: null,
				deleted_at: null,
			},
			{
				username: 'jose',
				id: '',
				name: null,
				role: null,
				deleted_at: null,
			},
		];
		render(() => <UserTable users={users} />);
		const userId = screen.getByText('123');
		const userUsername = screen.getByText('jose');

		expect(userId).toBeInTheDocument();
		expect(userUsername).toBeInTheDocument();
	});
});
