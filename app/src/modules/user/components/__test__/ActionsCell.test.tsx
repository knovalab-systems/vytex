import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

	it('renders correctly', () => {
		render(() => <ActionsCell userId='1' />);

		const updateButton = screen.getByText('Actualizar');
		const detailsButton = screen.getByText('Detalles');

		expect(updateButton).toBeInTheDocument();
		expect(detailsButton).toBeInTheDocument();
	});

	it('calls the Updates correclty', () => {
		render(() => <ActionsCell userId='1' />);

		const updateButton = screen.getByText('Actualizar');
		fireEvent.click(updateButton);

		expect(mockA).toBeCalled();
	});

	it('calls the Details correclty', () => {
		render(() => <ActionsCell userId='1' />);

		const detailsButton = screen.getByText('Detalles');
		fireEvent.click(detailsButton);

		expect(mockA).toBeCalled();
	});
});
