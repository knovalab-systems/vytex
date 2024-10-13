import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import RoleFilters from '../RoleFilters';

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

const setFiltersMock = vi.fn();

describe('OrderFilters', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <RoleFilters filters={{}} setFilters={setFiltersMock} />);

		const name = screen.getByText('Nombre del rol');
		const origin = screen.getByText('Origen');

		expect(name).toBeInTheDocument();
		expect(origin).toBeInTheDocument();
	});

	it('calls set filter on submit with name field ', async () => {
		render(() => <RoleFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const nameInput = screen.getByPlaceholderText('Nombre del rol');

		fireEvent.input(nameInput, { target: { value: 'role' } });
		fireEvent.click(submit);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ name: 'role' }));
	});

	it('calls set filter on submit with date state field', async () => {
		render(() => <RoleFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');

		// select status

		const originSelect = screen.getByTitle('Ver origenes');

		fireEvent(
			originSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(originSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
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

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ origin: 'Personalizado' }));
	});

	it('calls set filter on clear', async () => {
		render(() => <RoleFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const nameInput = screen.getByPlaceholderText('Nombre del rol');

		fireEvent.input(nameInput, { target: { value: 'Role' } });
		fireEvent.click(submit);
		fireEvent.click(clear);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledTimes(2));
	});
});
