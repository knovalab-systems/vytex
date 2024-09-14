import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import CancelButton from '../CancelButton';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

describe('CancelButton', () => {
	it('renders correctly with default label', () => {
		render(() => <CancelButton />);

		const label = screen.getByText('Cancelar');

		expect(label).toBeInTheDocument();
	});

	it('renders correctly with set label', () => {
		render(() => <CancelButton label='Title' />);

		const label = screen.getByText('Title');

		expect(label).toBeInTheDocument();
	});

	it('calls navigate on click', async () => {
		render(() => <CancelButton />);

		const label = screen.getByText('Cancelar');
		fireEvent.click(label);

		await waitFor(() => {
			expect(navigateMock).toBeCalledWith('/');
		});
	});

	it('calls navigate on click with custom TO', async () => {
		render(() => <CancelButton to='/path' />);

		const label = screen.getByText('Cancelar');
		fireEvent.click(label);

		await waitFor(() => {
			expect(navigateMock).toBeCalledWith('/path');
		});
	});
});
