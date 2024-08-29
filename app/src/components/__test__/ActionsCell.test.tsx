import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import ActionsCell from '../ActionsCell';

const actionMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: (props: { children: JSXElement }) => {
		actionMock();
		return <button type='button'>{props.children}</button>;
	},
}));

describe('ActionsCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty', () => {
		render(() => <ActionsCell actions={[]} />);

		const emptyTitle = screen.getByText('Acciones');

		expect(emptyTitle).toBeInTheDocument();
	});

	it('renders correctly on actions', () => {
		render(() => (
			<ActionsCell
				actions={[
					{
						path: '/',
						title: 'Agregar',
						label: 'Agregar',
						icon: 'create',
					},
					{
						path: '/',
						title: 'Detalles',
						label: 'Detalles',
						icon: 'details',
					},
					{
						path: '/',
						title: 'Actualizar',
						label: 'Actualizar',
						icon: 'update',
					},
				]}
			/>
		));

		const updateButton = screen.getByText('Actualizar');
		const detailsButton = screen.getByText('Detalles');
		const createButton = screen.getByText('Agregar');

		expect(updateButton).toBeInTheDocument();
		expect(detailsButton).toBeInTheDocument();
		expect(createButton).toBeInTheDocument();
	});

	it('calls the Updates correctly', async () => {
		render(() => (
			<ActionsCell
				actions={[
					{
						path: '/',
						title: 'Agregar',
						label: 'Agregar',
						icon: 'create',
					},
					{
						path: '/',
						title: 'Detalles',
						label: 'Detalles',
						icon: 'details',
					},
					{
						path: '/',
						title: 'Actualizar',
						label: 'Actualizar',
						icon: 'update',
					},
				]}
			/>
		));

		const updateButton = screen.getByText('Actualizar');
		const detailsButton = screen.getByText('Detalles');
		const createButton = screen.getByText('Agregar');
		fireEvent.click(updateButton);
		fireEvent.click(detailsButton);
		fireEvent.click(createButton);

		await waitFor(() => {
			expect(actionMock).toBeCalledTimes(3);
		});
	});
});
