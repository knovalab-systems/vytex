import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetResourcesType } from '../../requests/resourceGet';
import ResourceTable from '../ResourceTable';

vi.mock('~/components/ActionsCell', () => ({
	default: () => {
		return <td>Actions</td>;
	},
}));

describe('Resources Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty resources', () => {
		render(() => <ResourceTable resources={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado insumos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on resources', () => {
		const resources: GetResourcesType = [
			{
				id: 123,
				cost: null,
				name: null,
				code: null,
				color_id: null,
				deleted_at: null,
				supplier_id: null,
			},
			{
				name: 'Insumo 1',
				id: 0,
				cost: null,
				code: null,
				color_id: null,
				deleted_at: null,
				supplier_id: null,
			},
		];
		render(() => <ResourceTable resources={resources} />);
		const resourcesId = screen.getByText('123');
		const resourceName = screen.getByText('Insumo 1');

		expect(resourcesId).toBeInTheDocument();
		expect(resourceName).toBeInTheDocument();
	});
});
