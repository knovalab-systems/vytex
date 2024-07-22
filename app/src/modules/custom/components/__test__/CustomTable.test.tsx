import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetCustomsType } from '../../requests/CustomGet';
import CustomTable from '../CustomTable';

describe('Color Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty customs', () => {
		render(() => <CustomTable customs={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron pedidos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on customs', () => {
		const customs: GetCustomsType = [{ id: 123 }, { client: 'blanco' }, { created_at: '2024-05-12T22:36:52.140901Z' }];
		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('blanco');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
	});
});
