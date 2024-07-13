import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetSuppliersType } from '../../requests/supplierGet';
import SupplierTable from '../SupplierTable';

describe('Color Table', () => {
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
			},
			{
				name: 'blanco',
				id: 0,
				nit: null,
				deleted_at: null,
			},
		];
		render(() => <SupplierTable suppliers={suppliers} />);
		const colorId = screen.getByText('123');
		const colorName = screen.getByText('blanco');

		expect(colorId).toBeInTheDocument();
		expect(colorName).toBeInTheDocument();
	});
});
