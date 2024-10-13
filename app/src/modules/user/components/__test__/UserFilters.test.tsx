import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import UserFilters from '../UserFilters';

const setFiltersMock = vi.fn();

vi.mock('~/components/FilterButton', () => ({
	default: (props: { children: JSXElement }) => <div>{props.children}</div>,
}));

vi.mock('~/hooks/useRoles', () => ({
	useRoles: () => ({
		getRoles: () => [{ id: 'admin', name: 'Administrador' }],
		getRolesRecord: () => ({ admin: { id: 'admin', name: 'Administrador' } }),
	}),
}));

describe('UserFilters', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <UserFilters filters={{}} setFilters={setFiltersMock} />);

		const nameField = screen.getByText('Nombre');
		const codeField = screen.getByText('Nombre de usuario');
		const rolesField = screen.getByTitle('Ver roles');
		const stateField = screen.getByText('Estado');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(rolesField).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
	});

	const testCasesInputDate = [
		{ placeholder: 'Nombre del usuario', value: '21321', key: 'name' },
		{ placeholder: 'Nombre de usuario del usuario', value: 'nombreinsumo', key: 'username' },
	];

	for (const testCase of testCasesInputDate) {
		it(`calls set filter on submit with date field ${testCase.key}`, async () => {
			render(() => <UserFilters filters={{}} setFilters={setFiltersMock} />);

			const submit = screen.getByText('Aplicar');
			const input = screen.getByPlaceholderText(testCase.placeholder);

			fireEvent.input(input, { target: { value: testCase.value } });
			fireEvent.click(submit);

			await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ [testCase.key]: testCase.value }));
		});
	}

	it('should call set filter on select', async () => {
		render(() => <UserFilters filters={{}} setFilters={setFiltersMock} />);

		const select = screen.getByTitle('Ver roles');
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

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledWith({ roles: ['admin'] }));
	});

	it('should call set filter on change state', async () => {
		render(() => <UserFilters filters={{}} setFilters={setFiltersMock} />);

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
		render(() => <UserFilters filters={{}} setFilters={setFiltersMock} />);

		const submit = screen.getByText('Aplicar');
		const clear = screen.getByText('Limpiar filtros');
		const created = screen.getByPlaceholderText('Nombre del usuario');

		fireEvent.input(created, { target: { value: 'usurio' } });
		fireEvent.click(submit);
		fireEvent.click(clear);

		await waitFor(() => expect(setFiltersMock).toHaveBeenCalledTimes(2));
	});
});
