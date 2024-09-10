import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetResourcesType } from '../../requests/resourceGet';
import ResourceTable from '../ResourceTable';

vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length > 0 ? 'WithActions' : 'WithOutActions'}</td>;
	},
}));

const hasPolicyMock = vi.fn();

describe('Resources Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty resources', () => {
		render(() => <ResourceTable resources={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado insumos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on resources without update policy', async () => {

		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return false;
			},
		});

		const resources: GetResourcesType = [
			{
				id: 123,
				name: 'Insumo 1',
				cost: 1000,
				code: 'RESOURCE001',
				color_id: 1,
				deleted_at: null,
				supplier_id: null,
			},
		];

		render(() => <ResourceTable resources={resources} />);
		const resourcesId = screen.getByText('123');
		const resourceCode = screen.getByText('RESOURCE001')
		const resourceName = screen.getByText('Insumo 1');
		const resourceCost = screen.getByText('$1000')
		const resourceStatus = screen.getByText('Activo');
		const resourceActions = screen.getByText('WithOutActions');


		expect(resourcesId).toBeInTheDocument();
		expect(resourceCode).toBeInTheDocument();
		expect(resourceName).toBeInTheDocument();
		expect(resourceCost).toBeInTheDocument();
		expect(resourceStatus).toBeInTheDocument();
		expect(resourceActions).toBeInTheDocument();

		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});

	it('renders correctly on resources with update policy', async () => {
		vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
			policies: [],
			hasPolicy: () => {
				hasPolicyMock();
				return true;
			},
		});

		const resources: GetResourcesType = [
			{
				id: 123,
				name: 'Insumo 1',
				cost: 1000,
				code: 'RESOURCE001',
				color_id: 1,
				deleted_at: null,
				supplier_id: null,
			},
		];

		render(() => <ResourceTable resources={resources} />);
		const resourcesId = screen.getByText('123');
		const resourceCode = screen.getByText('RESOURCE001')
		const resourceName = screen.getByText('Insumo 1');
		const resourceCost = screen.getByText('$1000')
		const resourceStatus = screen.getByText('Activo');
		const resourceActions = screen.getByText('WithActions');

		expect(resourcesId).toBeInTheDocument();
		expect(resourceCode).toBeInTheDocument();
		expect(resourceName).toBeInTheDocument();
		expect(resourceCost).toBeInTheDocument();
		expect(resourceStatus).toBeInTheDocument();
		expect(resourceActions).toBeInTheDocument();

		await waitFor(() => {
			expect(hasPolicyMock).toBeCalled();
		});
	});
});