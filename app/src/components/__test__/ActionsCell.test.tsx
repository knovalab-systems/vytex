import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import ActionsCell from '../ActionsCell';

const mockA = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: (props: { children: JSXElement }) => {
		mockA();
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
		render(() => <ActionsCell
			update={{ path: '', title: '' }}
			details={{ path: '', title: '' }}
			create={{ path: '', title: '' }}
		/>);


		const updateButton = screen.getByText('Actualizar');
		const detailsButton = screen.getByText('Detalles');
		const createButton = screen.getByText('Agregar');

		expect(updateButton).toBeInTheDocument();
		expect(detailsButton).toBeInTheDocument();
		expect(createButton).toBeInTheDocument();
	});

	it('calls the Updates correclty', () => {
		render(() => <ActionsCell update={{ path: '', title: '' }} details={{ path: '', title: '' }} />);

		const updateButton = screen.getByText('Actualizar');
		fireEvent.click(updateButton);

		expect(mockA).toBeCalled();
	});

	it('calls the Details correclty', () => {
		render(() => <ActionsCell update={{ path: '', title: '' }} details={{ path: '', title: '' }} />);

		const detailsButton = screen.getByText('Detalles');
		fireEvent.click(detailsButton);

		expect(mockA).toBeCalled();
	});

	it('calls the Create correclty', () => {
		render(() => <ActionsCell create={{ path: '', title: '' }} />);

		const createButton = screen.getByText('Agregar');
		fireEvent.click(createButton);

		expect(mockA).toBeCalled();
	});
});
