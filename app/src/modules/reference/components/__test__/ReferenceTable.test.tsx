import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetReferenceType } from '../../requests/referenceGet';
import ReferenceTable from '../ReferenceTable';

const hasPolicyMock = vi.fn();
vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length}</td>;
	},
}));

describe('Reference Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty references', () => {
		render(() => <ReferenceTable references={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado referencias.');

		expect(tableHeader).toBeInTheDocument();
	});

	for (const testCase of [
		{ value: true, expect: 2 },
		{ value: false, expect: 1 },
	]) {
		it('renders correctly on references', async () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return testCase.value;
				},
			});
			const references: GetReferenceType = [
				{
					id: 123,
					code: 'REF001',
					deleted_at: null,
				},
			];

			render(() => <ReferenceTable references={references} />);
			const referenceId = screen.getByText('123');
			const referenceCode = screen.getByText('REF001');
			const referenceStatus = screen.getByText('Activo');
			const referenceActions = screen.getByText(testCase.expect);

			expect(referenceId).toBeInTheDocument();
			expect(referenceCode).toBeInTheDocument();
			expect(referenceStatus).toBeInTheDocument();
			expect(referenceActions).toBeInTheDocument();
			await waitFor(() => {
				expect(hasPolicyMock).toBeCalled();
			});
		});
	}
});
