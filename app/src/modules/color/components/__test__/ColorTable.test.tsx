import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetColorsType } from '../../requests/colorsGetRequests';
import ColorTable from '../ColorTable';

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
		const colors: GetColorsType = [{ id: 123 }, { name: 'blanco' }];
		render(() => <ColorTable colors={colors} />);
		const colorId = screen.getByText('123');
		const colorName = screen.getByText('blanco');

		expect(colorId).toBeInTheDocument();
		expect(colorName).toBeInTheDocument();
	});
});
