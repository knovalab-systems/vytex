import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ActionsCell from '../ActionsCell';

const mockA = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: () => {
		mockA();
		return <button type='button'>Actualizar</button>;
	},
}));

describe('ActionsCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ActionsCell userId='1' />);

		const roleName = screen.getByText('Actualizar');
		const triggerButton = screen.getByRole('button');

		expect(triggerButton).toBeInTheDocument();
		expect(roleName).toBeInTheDocument();
	});

	it('calls the A correclty', () => {
		render(() => <ActionsCell userId='1' />);

		const triggerButton = screen.getByRole('button');
		fireEvent.click(triggerButton);

		expect(mockA).toBeCalled();
	});
});
