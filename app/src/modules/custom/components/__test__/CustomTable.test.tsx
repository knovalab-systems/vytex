import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetCustomsType } from '../../requests/CustomGet';
import CustomTable from '../CustomTable';

const hasPolicyMock = vi.fn();
vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length}</td>;
	},
}));

describe('Custom Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty customs', () => {
		render(() => <CustomTable customs={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado pedidos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on customs', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				finished_at: null,
				canceled_at: null,
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];
		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 05:36 PM');
		const actionsCell = screen.getByText('1');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
		expect(actionsCell).toBeInTheDocument();
	});

	for (const testCase of [
		{ value: false, expect: 1, cancel: null, finish: null },
		{ value: true, expect: 2, cancel: null, finish: null },
		{ value: true, expect: 1, cancel: '2024-05-12T22:36:52.140901Z', finish: null },
		{ value: true, expect: 1, cancel: null, finish: '2024-05-12T22:36:52.140901Z' },
	]) {
		it('renders action cell with creation conditions', () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return testCase.value;
				},
			});
			const customs: GetCustomsType = [
				{
					id: 123,
					client: 'pepe',
					created_at: '2024-05-12T22:36:52.140901Z',
					finished_at: testCase.finish,
					canceled_at: testCase.cancel,
					created_by: null,
					canceled_by: null,
					create_user: null,
					cancel_user: null,
					orders: null,
				},
			];

			render(() => <CustomTable customs={customs} />);
			const actionsCell = screen.getByText(testCase.expect);

			expect(actionsCell).toBeInTheDocument();
		});
	}
});
