import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import OrderFilters from '../OrderFilters';

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

vi.mock('~/hooks/useOrderStatus', () => ({
	useOrderStatus: () => ({
		getOrderStatus: () => [
			{ id: 1, name: 'Uno' },
			{ id: 2, name: 'Dos' },
		],
		getOrderStatusRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
	}),
}));

const setFiltersMock = vi.fn();

describe('OrderStartCard', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <OrderFilters filters={{}} setFilters={setFiltersMock} />);

		const status = screen.getByText('Estado');
		const created = screen.getByText('Fecha de creación');
		const started = screen.getByText('Fecha de inicio');
		const finished = screen.getByText('Fecha de finalización');
		const canceled = screen.getByText('Fecha de cancelación');

		expect(status).toBeInTheDocument();
		expect(created).toBeInTheDocument();
		expect(started).toBeInTheDocument();
		expect(finished).toBeInTheDocument();
		expect(canceled).toBeInTheDocument();
	});

	const testCasesInputDate = [
		{ placeholder: 'Fecha de creación', value: '2024-10-10', key: 'createdDate' },
		{ placeholder: 'Fecha de inicio', value: '2024-10-10', key: 'startedDate' },
		{ placeholder: 'Fecha de finalización', value: '2024-10-10', key: 'finishedDate' },
		{ placeholder: 'Fecha de cancelación', value: '2024-10-10', key: 'canceledDate' },
	];

	for (const testCase of testCasesInputDate) {
		it(`calls set filter on submit with date field ${testCase.key}`, async () => {
			render(() => <OrderFilters filters={{}} setFilters={setFiltersMock} />);

			const submit = screen.getByText('Aplicar');
			const dateInput = screen.getByPlaceholderText(testCase.placeholder);

			fireEvent.input(dateInput, { target: { value: testCase.value } });
			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	it('calls set filter on submit with date state field', async () => {
		render(() => <OrderFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');

		// select status

		const statusSelect = screen.getByTitle('Ver estados');

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
			status[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();
		fireEvent.click(submit);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ status: [1] }));
	});

	it('calls set filter on clear', async () => {
		render(() => <OrderFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const created = screen.getByPlaceholderText('Fecha de creación');

		fireEvent.input(created, { target: { value: '2024-10-10' } });
		fireEvent.click(submit);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ createdDate: '2024-10-10' }));

		fireEvent.click(clear);
		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({}));
	});
});
