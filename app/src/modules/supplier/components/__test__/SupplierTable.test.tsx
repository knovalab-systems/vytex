import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetSuppliersType } from '../../requests/supplierGet';
import SupplierTable from '../SupplierTable';

describe('SupplierTable', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty suppliers', () => {
		render(() => <SupplierTable suppliers={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron proveedores.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on suppliers', () => {
		const suppliers: GetSuppliersType = [
			{
				id: 123,
				nit: null,
				name: null,
				deleted_at: null,
				code: null,
			},
			{
				name: 'blanco',
				id: 0,
				nit: null,
				deleted_at: null,
				code: null,
			},
		];
		render(() => <SupplierTable suppliers={suppliers} />);
		const supplierId = screen.getByText('123');
		const supplierName = screen.getByText('blanco');

		expect(supplierId).toBeInTheDocument();
		expect(supplierName).toBeInTheDocument();
	});
});
