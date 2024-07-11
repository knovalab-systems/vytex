import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetFabricsType } from '../../request/fabricsGetRequests';
import FabricTable from '../FabricTable';

describe('Fabric Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty fabrics', () => {
		render(() => <FabricTable fabrics={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron telas.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on fabrics', () => {
		const fabrics: GetFabricsType = [
			{
				id: 123,
				key: 'uniqueKey123',
				cost: 1000,
				name: 'Algodon',
				code: 'ALG001',
				color_id: 1,
				deleted_at: null,
			},
		];

		render(() => <FabricTable fabrics={fabrics} />);
		const fabricId = screen.getByText('123');
		const fabricKey = screen.getByText('uniqueKey123');
		const fabricName = screen.getByText('Algodon');
		const fabricCost = screen.getByText('$1000');
		const fabricStatus = screen.getByText('Activo');

		expect(fabricId).toBeInTheDocument();
		expect(fabricKey).toBeInTheDocument();
		expect(fabricName).toBeInTheDocument();
		expect(fabricCost).toBeInTheDocument();
		expect(fabricStatus).toBeInTheDocument();
	});
});
