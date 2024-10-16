import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import type { Steps, Tasks } from '~/hooks/useSteps';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import TaskControlFilters from '../TaskControlFilters';

const setFiltersMock = vi.fn();

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

vi.mock('~/hooks/useTaskControlStatus', () => ({
	useTaskControlStatus: () => ({
		getTaskControlStatus: () => [
			{ id: 1, name: 'Uno' },
			{ id: 2, name: 'Dos' },
		],
		getTaskControlStatusRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
	}),
}));

vi.mock('~/hooks/useSteps', () => ({
	useSteps: () => ({
		getTasksRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
	}),
}));

const tasks: Tasks = [{ id: 1, value: 'trazar', name: 'Traza', step_id: 1, step: {} as Steps[number] }];

describe('ResourceFilters', () => {
	installPointerEvent();

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <TaskControlFilters filters={{}} setFilters={setFiltersMock} tasks={tasks} />);

		const nameField = screen.getByText('Identificador');
		const codeField = screen.getByText('Orden');
		const colorField = screen.getByTitle('Ver tareas');
		const supplierField = screen.getByTitle('Ver estados');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(colorField).toBeInTheDocument();
		expect(supplierField).toBeInTheDocument();
	});

	const testCasesInputDate = [
		{ placeholder: 'Identificador de la tarea', value: 21321, key: 'id' },
		{ placeholder: 'Orden de la tarea', value: 231231, key: 'order' },
	];

	for (const testCase of testCasesInputDate) {
		it(`calls set filter on submit with date field ${testCase.key}`, async () => {
			render(() => <TaskControlFilters filters={{}} setFilters={setFiltersMock} tasks={tasks} />);

			const submit = screen.getByText('Aplicar');
			const input = screen.getByPlaceholderText(testCase.placeholder);

			fireEvent.input(input, { target: { value: testCase.value } });
			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	const testCasesSelect = [
		{ title: 'Ver tareas', value: [1], key: 'tasks' },
		{ title: 'Ver estados', value: [1], key: 'status' },
	];

	for (const testCase of testCasesSelect) {
		it('should call set filter on select', async () => {
			render(() => <TaskControlFilters filters={{}} setFilters={setFiltersMock} tasks={tasks} />);

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

	it('calls set filter on clear', async () => {
		render(() => <TaskControlFilters filters={{}} setFilters={setFiltersMock} tasks={tasks} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const input = screen.getByPlaceholderText('Identificador de la tarea');

		fireEvent.input(input, { target: { value: 32423 } });
		fireEvent.click(submit);
		fireEvent.click(clear);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledTimes(2));
	});
});
