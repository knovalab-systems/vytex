import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { ADMIN_ROLE } from '~/envs/roles';
import AllowRoles from '../AllowRoles';

vi.mock('~/lib/queryClient', () => ({
	queryClient: {
		getQueryData: () => ({ role: ADMIN_ROLE }),
	},
}));

vi.mock('@solidjs/router', () => ({
	Navigate: () => <div>Navigate</div>,
}));

describe('ActionsCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('show children, access allow ', () => {
		render(() => (
			<AllowRoles roles={['admin']}>
				<div>Children</div>
			</AllowRoles>
		));

		const children = screen.getByText('Children');

		expect(children).toBeInTheDocument();
	});

	it('calls navigate, access no unallow ', () => {
		render(() => (
			<AllowRoles roles={['designer', 'norole']}>
				<div>Children</div>
			</AllowRoles>
		));

		const children = screen.getByText('Navigate');

		expect(children).toBeInTheDocument();
	});
});
