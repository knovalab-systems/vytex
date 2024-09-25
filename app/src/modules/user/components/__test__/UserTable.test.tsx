import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetUsersType } from '../../requests/userGet';
import UserTable from '../UserTable';

const mockRole = vi.fn();
vi.mock('../RoleCell', () => ({
	default: () => {
		mockRole();
		return <td>Role</td>;
	},
}));

const hasPolicyMock = vi.fn();
vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length}</td>;
	},
}));

describe('User Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty users', () => {
		render(() => <UserTable users={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado usuarios.');

		expect(tableHeader).toBeInTheDocument();
	});

	for (const testCase of [
		{ value: true, expect: 2 },
		{ value: false, expect: 1 },
	]) {
		it('renders correctly on users', async () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return testCase.value;
				},
			});
			const users: GetUsersType = [
				{
					id: '123',
					name: null,
					username: null,
					role_id: null,
					deleted_at: null,
				},
				{
					username: 'jose',
					id: '',
					name: null,
					role_id: null,
					deleted_at: null,
				},
			];
			render(() => <UserTable users={users} />);
			const userId = screen.getByText('123');
			const userUsername = screen.getByText('jose');
			const userActions = screen.getAllByText(testCase.expect);

			expect(userId).toBeInTheDocument();
			expect(userUsername).toBeInTheDocument();
			expect(userActions).length(2);

			await waitFor(() => {
				expect(hasPolicyMock).toBeCalled();
			});
		});
	}
});
