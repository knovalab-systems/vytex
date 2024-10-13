import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import ResourceFilters from '../ResourceFilters';

const setFiltersMock = vi.fn();

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

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

describe('ResourceFilters', () => {
	installPointerEvent();

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ResourceFilters filters={{}} setFilters={setFiltersMock} />);

		const nameField = screen.getByText('Nombre');
		const codeField = screen.getByText('Código');
		const colorField = screen.getByTitle('Ver colores');
		const supplierField = screen.getByTitle('Ver proveedores');
		const stateField = screen.getByText('Estado');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(colorField).toBeInTheDocument();
		expect(supplierField).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
	});

	const testCasesInputDate = [
		{ placeholder: 'Código del insumo', value: '21321', key: 'code' },
		{ placeholder: 'Nombre del insumo', value: 'nombreinsumo', key: 'name' },
	];

	for (const testCase of testCasesInputDate) {
		it(`calls set filter on submit with date field ${testCase.key}`, async () => {
			render(() => <ResourceFilters filters={{}} setFilters={setFiltersMock} />);

			const submit = screen.getByText('Aplicar');
			const input = screen.getByPlaceholderText(testCase.placeholder);

			fireEvent.input(input, { target: { value: testCase.value } });
			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	const testCasesSelect = [
		{ title: 'Ver colores', value: [1], key: 'colors' },
		{ title: 'Ver proveedores', value: [1], key: 'suppliers' },
	];

	for (const testCase of testCasesSelect) {
		it('should call set filter on select', async () => {
			render(() => <ResourceFilters filters={{}} setFilters={setFiltersMock} />);

			const select = screen.getByTitle(testCase.title);
			const submit = screen.getByText('Aplicar');

			fireEvent(
				select,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(select, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listbox = screen.getByRole('listbox');
			const options = within(listbox).getAllByRole('option');

			fireEvent(
				options[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(options[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	it('should call set filter on change state', async () => {
		render(() => <ResourceFilters filters={{}} setFilters={setFiltersMock} />);

		const statusSelect = screen.getByText('Selecciona un estado');
		const submit = screen.getByText('Aplicar');

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
		fireEvent.click(submit);

		await waitFor(() => expect(setFiltersMock).toBeCalled());
	});

	it('calls set filter on clear', async () => {
		render(() => <ResourceFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const input = screen.getByPlaceholderText('Nombre del insumo');

		fireEvent.input(input, { target: { value: 'insumo' } });
		fireEvent.click(submit);
		fireEvent.click(clear);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledTimes(2));
	});
});
