import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetUsersType } from '../../requests/getUserRequests';
import * as RoleCell from '../RoleCell';
import UserTable from '../UserTable';

const mockRole = vi.fn();
vi.mock('../RoleCell', () => ({
	default: () => {
		mockRole();
		return <td>Role</td>;
	},
}));

describe('User Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty users', () => {
		render(() => <UserTable users={undefined} />);
		const tableHeader = screen.getByText('ID');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on users', () => {
		vi.spyOn(RoleCell, 'default');
		const users: GetUsersType = [{ id: 123 }, { username: 'jose' }];
		render(() => <UserTable users={users} />);
		const userId = screen.getByText('123');
		const userUsername = screen.getByText('jose');

		expect(userId).toBeInTheDocument();
		expect(userUsername).toBeInTheDocument();
	});
});
