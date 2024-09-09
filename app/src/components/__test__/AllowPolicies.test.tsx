import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import AllowPolicies from '../AllowPolicies';

vi.mock('~/lib/queryClient', () => ({
	queryClient: {
		getQueryData: () => ({ role: { policies: [0, 1, 2] } }),
	},
}));

vi.mock('@solidjs/router', () => ({
	Navigate: () => <div>Navigate</div>,
}));

describe('AllowPolicies', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('show children, access allow', () => {
		render(() => (
			<AllowPolicies policies={['ReadUsers']}>
				<div>Children</div>
			</AllowPolicies>
		));

		const children = screen.getByText('Children');

		expect(children).toBeInTheDocument();
	});

	it('calls navigate, access unallow', () => {
		render(() => (
			<AllowPolicies policies={['ReadColors', 'ReadFabrics']}>
				<div>Children</div>
			</AllowPolicies>
		));

		const children = screen.getByText('Navigate');

		expect(children).toBeInTheDocument();
	});
});
