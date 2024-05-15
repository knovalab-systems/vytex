import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetUsersType } from '../../requests/userRequests';
import UserTable from '../UserTable';

describe('User Table', () => {
	it('renders correctly on empty users', () => {
		render(() => <UserTable users={undefined} />);
		const tableHeader = screen.getByText('ID');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on no empty users', () => {
		const users: GetUsersType = [{ id: 123 }, { username: 'jose' }];
		render(() => <UserTable users={users} />);
		const userId = screen.getByText('123');
		const userUsername = screen.getByText('jose');

		expect(userId).toBeInTheDocument();
		expect(userUsername).toBeInTheDocument();
	});
});
