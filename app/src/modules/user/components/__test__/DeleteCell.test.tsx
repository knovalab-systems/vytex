import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import * as request from '../../requests/userUpdate';
import DeletedAtCell from '../DeletedAtCell';

const hasPolicyMock = vi.fn();

vi.mock('~/hooks/usePolicies', () => ({
	usePolicies: () => ({
		hasPolicy: () => true,
	}),
}));

const statusTestCases = [
	{ delete_at: null, text: 'Activo' },
	{ delete_at: 'admin', text: 'Inactivo' },
];

describe('DeleteCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
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
			role_id: null,
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
			role_id: null,
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

	for (const testCase of statusTestCases) {
		it('renders correctly without policy ', async () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return false;
				},
			});
			render(() => <DeletedAtCell deleted_at={testCase.delete_at} userId='1' />);

			const stateLabel = screen.getByText(testCase.text);
			const checkButton = screen.queryByRole('switch');
			expect(stateLabel).toBeInTheDocument();
			expect(checkButton).not.toBeInTheDocument();

			await waitFor(() => {
				expect(hasPolicyMock).toBeCalled();
			});
		});
	}

	for (const testCase of statusTestCases) {
		it('renders correctly with policy ', async () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return true;
				},
			});
			render(() => <DeletedAtCell deleted_at={testCase.delete_at} userId='1' />);

			const stateLabel = screen.getByText(testCase.text);
			const checkButton = screen.queryByRole('switch');
			expect(stateLabel).toBeInTheDocument();
			expect(checkButton).toBeInTheDocument();

			await waitFor(() => {
				expect(hasPolicyMock).toBeCalled();
			});
		});
	}
});
