import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserCard from '../UserCard';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('~/utils/roles', () => ({
	roles: {
		admin: {
			label: 'Administrador',
			key: 'admin',
		},
		none: {
			label: 'Sin rol',
			key: 'none',
		},
	},
}));

describe('UserCard', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with delete_at', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			delete_at: '2024-05-10T22:36:52.140901Z',
			update_at: '2024-05-11T22:36:52.140901Z',
			create_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user} />);

		const name = screen.getByText('Jose');
		const delete_at = screen.getByText('2024-05-10 5:36 PM');

		expect(delete_at).toBeInTheDocument();
		expect(name).toBeInTheDocument();
	});

	it('renders correctly without delete_at', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			delete_at: null,
			update_at: '2024-05-11T22:36:52.140901Z',
			create_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user} />);

		const name = screen.getByText('Jose');
		const items = screen.getAllByRole('listitem');

		expect(name).toBeInTheDocument();
		expect(items.length).eq(2);
	});

	it('calls back correctly', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			delete_at: '2024-05-10T22:36:52.140901Z',
			update_at: '2024-05-11T22:36:52.140901Z',
			create_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user} />);

		const back = screen.getByText('Volver');

		expect(back).toBeInTheDocument();
	});

	it('calls edit correctly', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			delete_at: '2024-05-10T22:36:52.140901Z',
			update_at: '2024-05-11T22:36:52.140901Z',
			create_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user} />);

		const edit = screen.getByText('Editar');

		expect(edit).toBeInTheDocument();
	});
});
