import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetColorsType } from '../../requests/colorsGetRequests';
import ColorTable from '../ColorTable';

const mockRole = vi.fn();
vi.mock('../RoleCell', () => ({
	default: () => {
		mockRole();
		return <td>Role</td>;
	},
}));

const mockActions = vi.fn();
vi.mock('../ActionsCell', () => ({
	default: () => {
		mockActions();
		return <td>Actions</td>;
	},
}));

describe('Color Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty colors', () => {
		render(() => <ColorTable colors={undefined} />);
		const tableHeader = screen.getByText('No se han encontraron colores.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on colors', () => {
		const users: GetColorsType = [{ id: 123 }, { name: 'blanco' }];
		render(() => <ColorTable colors={users} />);
		const colorId = screen.getByText('123');
		const colorName = screen.getByText('blanco');

		expect(colorId).toBeInTheDocument();
		expect(colorName).toBeInTheDocument();
	});
});
