import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import * as usePolicies from '~/hooks/usePolicies';
import CreateButton from '../CreateButton';

const hasPolicyMock = vi.fn();
const AMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: (props: { href: string; children: JSXElement }) => {
		AMock(props.href);
		return <div>{props.children}</div>;
	},
}));

describe('CreateButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with default label', () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: () => [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});
		render(() => <CreateButton to='/' policy='CreateColors' />);

		const label = screen.getByText('Nuevo');

		expect(label).toBeInTheDocument();
	});

	it('renders correctly with set label', () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: () => [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});
		render(() => <CreateButton to='/' label='Title' policy='CreateColors' />);

		const label = screen.getByText('Title');

		expect(label).toBeInTheDocument();
	});

	it('renders correctly when no has policy', () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: () => [],
			hasPolicy: () => {
				hasPolicyMock();
				return false;
			},
		});
		render(() => <CreateButton to='/' policy='CreateColors' />);

		const label = screen.queryByText('Nuevo');

		expect(label).not.toBeInTheDocument();
	});

	it('calls navigate on click', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: () => [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});
		render(() => <CreateButton to='/' policy='CreateColors' />);

		const label = screen.getByText('Nuevo');
		fireEvent.click(label);

		await waitFor(() => {
			expect(AMock).toBeCalledWith('/');
		});
	});
});
