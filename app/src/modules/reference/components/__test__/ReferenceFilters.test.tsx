import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import ReferenceFilters from '../ReferenceFilters';

const setFiltersMock = vi.fn();

vi.mock('~/hooks/useColors', () => ({
	useColors: () => ({
		getColors: () => [{ id: 1, name: 'Blanco', hex: '', deleted_at: null }],
		getColorsRecord: () => ({ 1: {} }),
	}),
}));

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

describe('ReferenceFilters', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ReferenceFilters filters={{}} setFilters={setFiltersMock} />);

		const codeField = screen.getByPlaceholderText('Código de la referencia');
		const colorField = screen.getByTitle('Ver colores');
		const stateField = screen.getByText('Estado');

		expect(codeField).toBeInTheDocument();
		expect(colorField).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
	});

	const testCasesInput = [{ placeholder: 'Código de la referencia', value: '21321', key: 'code' }];

	for (const testCase of testCasesInput) {
		it(`calls set filter on submit with date field ${testCase.key}`, async () => {
			render(() => <ReferenceFilters filters={{}} setFilters={setFiltersMock} />);

			const submit = screen.getByText('Aplicar');
			const input = screen.getByPlaceholderText(testCase.placeholder);

			fireEvent.input(input, { target: { value: testCase.value } });
			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	const testCasesSelect = [{ title: 'Ver colores', value: [1], key: 'colors' }];

	for (const testCase of testCasesSelect) {
		it('should call set filter on select', async () => {
			render(() => <ReferenceFilters filters={{}} setFilters={setFiltersMock} />);

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
		render(() => <ReferenceFilters filters={{}} setFilters={setFiltersMock} />);

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
		render(() => <ReferenceFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const input = screen.getByPlaceholderText('Código de la referencia');

		fireEvent.input(input, { target: { value: 3231 } });
		fireEvent.click(submit);
		fireEvent.click(clear);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledTimes(2));
	});
});
