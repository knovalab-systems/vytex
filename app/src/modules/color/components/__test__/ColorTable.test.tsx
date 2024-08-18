import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetColorsType } from '../../requests/colorGet';
import ColorTable from '../ColorTable';

vi.mock('~/components/ActionsCell', () => ({
	default: () => {
		return <td>Actions</td>;
	},
}));

describe('Color Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty colors', () => {
		render(() => <ColorTable colors={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado colores.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on colors', () => {
		const colors: GetColorsType = [
			{
				id: 123,
				code: null,
				name: null,
				hex: null,
				deleted_at: null,
				created_at: null,
				updated_at: null,
			},
			{
				name: 'blanco',
				code: null,
				id: 0,
				hex: null,
				deleted_at: null,
				created_at: null,
				updated_at: null,
			},
		];
		render(() => <ColorTable colors={colors} />);
		const colorId = screen.getByText('123');
		const colorName = screen.getByText('blanco');

		expect(colorId).toBeInTheDocument();
		expect(colorName).toBeInTheDocument();
	});
});
