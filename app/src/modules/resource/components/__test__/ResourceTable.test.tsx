import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetResourcesType } from '../../requests/resourcesGetRequests';
import ResourceTable from '../ResourceTable';

describe('Color Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty resources', () => {
		render(() => <ResourceTable resources={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron insumos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on resources', () => {
		const resources: GetResourcesType = [{ id: 123 }, { name: 'Insumo 1' }];
		render(() => <ResourceTable resources={resources} />);
		const resourcesId = screen.getByText('123');
		const resourceName = screen.getByText('Insumo 1');

		expect(resourcesId).toBeInTheDocument();
		expect(resourceName).toBeInTheDocument();
	});
});
