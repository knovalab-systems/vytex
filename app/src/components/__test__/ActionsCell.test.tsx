import { fireEvent, render, screen } from '@solidjs/testing-library';
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
		render(() => <ActionsCell />);

		const emptyTitle = screen.getByText('Acciones');

		expect(emptyTitle).toBeInTheDocument();
	});

	it('renders correctly on update n details n create', () => {
		render(() => (
			<ActionsCell
				update={{ path: '', title: '' }}
				details={{ path: '', title: '' }}
				create={{ path: '', title: '' }}
			/>
		));

		const updateButton = screen.getByText('Actualizar');
		const detailsButton = screen.getByText('Detalles');
		const createButton = screen.getByText('Agregar');

		expect(updateButton).toBeInTheDocument();
		expect(detailsButton).toBeInTheDocument();
		expect(createButton).toBeInTheDocument();
	});

	it('calls the Updates correctly', () => {
		render(() => <ActionsCell update={{ path: '', title: '' }} />);

		const updateButton = screen.getByText('Actualizar');
		fireEvent.click(updateButton);

		expect(actionMock).toBeCalled();
	});

	it('calls the Details correctly', () => {
		render(() => <ActionsCell details={{ path: '', title: '' }} />);

		const detailsButton = screen.getByText('Detalles');
		fireEvent.click(detailsButton);

		expect(actionMock).toBeCalled();
	});

	it('calls the Create correctly', () => {
		render(() => <ActionsCell create={{ path: '', title: '' }} />);

		const createButton = screen.getByText('Agregar');
		fireEvent.click(createButton);

		expect(actionMock).toBeCalled();
	});
});
