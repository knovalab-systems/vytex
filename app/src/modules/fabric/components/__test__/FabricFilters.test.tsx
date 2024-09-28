import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { createPointerEvent } from '~/utils/event';
import FabricFilters from '../FabricFilters';

const setFiltersMock = vi.fn();

vi.mock('~/hooks/useColors', () => ({
	useColors: () => ({
		getColors: () => [{ id: 1, name: 'Blanco', hex: '', deleted_at: null }],
		getColorsRecord: () => ({ 1: {} }),
	}),
}));

vi.mock('~/hooks/useSuppliers', () => ({
	useSuppliers: () => ({
		getSuppliersRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
		getSuppliers: () => [{ id: 1 }, { id: 2 }],
	}),
}));

describe('FabricFilters', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const nameField = screen.getByPlaceholderText('Nombre de la tela');
		const codeField = screen.getByPlaceholderText('Código de la tela');
		const statusFilterInput = screen.getByTitle('Ver colores');
		const roleIdFilterInput = screen.getByTitle('Ver proveedores');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(statusFilterInput).toBeInTheDocument();
		expect(roleIdFilterInput).toBeInTheDocument();
	});

	it('should call setfilter on change name', async () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const nameField = screen.getByPlaceholderText('Nombre de la tela');
		fireEvent.input(nameField, { target: { value: 'John' } });

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});

	it('should call set filter on change code', async () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const codeField = screen.getByPlaceholderText('Código de la tela');
		fireEvent.input(codeField, { target: { value: 'John' } });

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});

	it('should call set filter on select color', async () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});

	it('should call set filter on select supplier', async () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const supplierSelect = screen.getByTitle('Ver proveedores');

		fireEvent(
			supplierSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(supplierSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxSupplier = screen.getByRole('listbox');
		const suppliers = within(listboxSupplier).getAllByRole('option');

		fireEvent(
			suppliers[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(suppliers[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});

	it('should call set filter on change state', async () => {
		render(() => <FabricFilters filters={() => ({})} setFilters={setFiltersMock} />);

		const statusSelect = screen.getByText('Selecciona un estado');

		fireEvent(
			statusSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxStatus = screen.getByRole('listbox');
		const status = within(listboxStatus).getAllByRole('option');

		fireEvent(
			status[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});
});
