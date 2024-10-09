import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import FilterButton from '../FilterButton';

const onChangeMock = vi.fn();

describe('CreateButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <FilterButton />);

		const label = screen.getByText('Filtros');
		const icon = screen.getByText('Inactivo');

		expect(label).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
	});

	it('renders correctly on open popover', async () => {
		render(() => <FilterButton />);

		const label = screen.getByText('Filtros');
		fireEvent.click(label);

		const popover = await screen.findByRole('dialog');

		expect(label).toBeInTheDocument();
		expect(popover).toBeInTheDocument();
	});

	it('renders correctly on active', () => {
		render(() => <FilterButton active />);

		const label = screen.getByText('Filtros');
		const icon = screen.getByText('Activo');

		expect(label).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
	});

	it('renders correctly on open', () => {
		render(() => <FilterButton open />);

		const label = screen.getByText('Filtros');
		const icon = screen.getByText('Inactivo');
		const popover = screen.getByRole('dialog');

		expect(label).toBeInTheDocument();
		expect(popover).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
	});

	it('calls correclty on change', async () => {
		render(() => <FilterButton onOpenChange={() => onChangeMock()} />);

		const label = screen.getByText('Filtros');
		fireEvent.click(label);

		const popover = await screen.findByRole('dialog');

		expect(label).toBeInTheDocument();
		expect(popover).toBeInTheDocument();

		waitFor(() => expect(onChangeMock).toBeCalled());
	});
});
