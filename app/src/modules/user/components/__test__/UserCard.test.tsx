import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { USERS_PATH, USER_UPDATE_PATH } from '~/constants/paths';
import type { GetUserType } from '../../requests/userGet';
import UserCard from '../UserCard';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('~/constants/roles', () => ({
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

	it('renders correctly with deleted_at', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: '2024-05-10T22:36:52.140901Z',
			updated_at: '2024-05-11T22:36:52.140901Z',
			created_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user as GetUserType} />);

		const name = screen.getByText('Jose');
		const deleted_at = screen.getByText('2024-05-10 5:36 PM');

		expect(deleted_at).toBeInTheDocument();
		expect(name).toBeInTheDocument();
	});

	it('renders correctly without deleted_at', () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: null,
			updated_at: '2024-05-11T22:36:52.140901Z',
			created_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user as GetUserType} />);

		const name = screen.getByText('Jose');
		const items = screen.getAllByRole('listitem');

		expect(name).toBeInTheDocument();
		expect(items.length).eq(2);
	});

	it('calls back correctly', async () => {
		const user = {
			name: 'Jose',
			username: 'jose',
			deleted_at: '2024-05-10T22:36:52.140901Z',
			updated_at: '2024-05-11T22:36:52.140901Z',
			created_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user as GetUserType} />);

		const back = screen.getByText('Volver');
		fireEvent.click(back);

		await waitFor(() => expect(mockNavigate).toBeCalledWith(USERS_PATH));
	});

	it('calls edit correctly', async () => {
		const user = {
			id: '1',
			name: 'Jose',
			username: 'jose',
			deleted_at: '2024-05-10T22:36:52.140901Z',
			updated_at: '2024-05-11T22:36:52.140901Z',
			created_at: '2024-05-12T22:36:52.140901Z',
			role: 'admin',
		};

		render(() => <UserCard user={user as GetUserType} />);

		const edit = screen.getByText('Editar');
		fireEvent.click(edit);

		await waitFor(() => expect(mockNavigate).toBeCalledWith(`${USER_UPDATE_PATH}/1`));
	});
});
