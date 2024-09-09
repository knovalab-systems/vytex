import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetFabricsType } from '../../requests/fabricGet';
import FabricTable from '../FabricTable';

vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length > 0 ? 'WithActions' : 'WithOutActions'}</td>;
	},
}));
const hasPolicyMock = vi.fn();

describe('Fabric Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty fabrics', () => {
		render(() => <FabricTable fabrics={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado telas.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on fabrics without update policy', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return false;
			},
		});
		const fabrics: GetFabricsType = [
			{
				id: 123,
				cost: 1000,
				name: 'Algodon',
				code: 'ALG001',
				color_id: 1,
				deleted_at: null,
				supplier_id: null,
			},
		];

		render(() => <FabricTable fabrics={fabrics} />);
		const fabricId = screen.getByText('123');
		const fabricName = screen.getByText('Algodon');
		const fabricCost = screen.getByText('$1000');
		const fabricStatus = screen.getByText('Activo');
		const fabricActions = screen.getByText('WithOutActions');

		expect(fabricId).toBeInTheDocument();
		expect(fabricName).toBeInTheDocument();
		expect(fabricCost).toBeInTheDocument();
		expect(fabricStatus).toBeInTheDocument();
		expect(fabricActions).toBeInTheDocument();

		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});

	it('renders correctly on fabrics with update policy', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});
		const fabrics: GetFabricsType = [
			{
				id: 123,
				cost: 1000,
				name: 'Algodon',
				code: 'ALG001',
				color_id: 1,
				deleted_at: null,
				supplier_id: null,
			},
		];

		render(() => <FabricTable fabrics={fabrics} />);
		const fabricId = screen.getByText('123');
		const fabricName = screen.getByText('Algodon');
		const fabricCost = screen.getByText('$1000');
		const fabricStatus = screen.getByText('Activo');
		const fabricActions = screen.getByText('WithActions');

		expect(fabricId).toBeInTheDocument();
		expect(fabricName).toBeInTheDocument();
		expect(fabricCost).toBeInTheDocument();
		expect(fabricStatus).toBeInTheDocument();
		expect(fabricActions).toBeInTheDocument();

		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});
});
