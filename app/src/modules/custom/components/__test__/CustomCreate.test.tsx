import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import * as requests from '../../requests/CustomCreate';
import CustomCreateForm from '../CustomCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('CustomCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <CustomCreateForm refereces={[]} />);

		const clientField = screen.getByText('Cliente');
		const refField = screen.getByText('Referencia');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(clientField).toBeInTheDocument();
		expect(refField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('shows required errors correctly', async () => {
		render(() => <CustomCreateForm refereces={[]} />);

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const clientFieldErr = await screen.findByText('Ingrese el cliente.');
		const refFieldErr = screen.getByText('Seleccione una referencia.');

		expect(clientFieldErr).toBeInTheDocument();
		expect(refFieldErr).toBeInTheDocument();
	});

	it('calls cancel successfully', async () => {
		render(() => <CustomCreateForm refereces={[]} />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});

	it('calls submit with pending values for sizes', async () => {
		render(() => <CustomCreateForm refereces={[{ id: 1, code: '3232', colors: [{ id: 1, color_id: 1 }] }]} />);
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

		const clientField = screen.getByPlaceholderText('Nombre del cliente');
		fireEvent.input(clientField, { target: { value: 'cliente' } });

		const referenceSelect = screen.getByTitle('Ver referencias');

		fireEvent(
			referenceSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(referenceSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listbox = screen.getByRole('listbox');
		const items = within(listbox).getAllByRole('option');

		fireEvent(
			items[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(items[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() =>
			expect(toastMock).toHaveBeenCalledWith('Cada referencia debe tener almenos una talla con un valor mayor a 0.'),
		);
	});

	it('calls submit with error server', async () => {
		render(() => <CustomCreateForm refereces={[{ id: 1, code: '3232', colors: [{ id: 1, color_id: 1 }] }]} />);
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

		const clientField = screen.getByPlaceholderText('Nombre del cliente');
		fireEvent.input(clientField, { target: { value: 'cliente' } });

		const referenceSelect = screen.getByTitle('Ver referencias');

		fireEvent(
			referenceSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(referenceSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listbox = screen.getByRole('listbox');
		const items = within(listbox).getAllByRole('option');

		fireEvent(
			items[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(items[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const inputValuesSize = await screen.findAllByPlaceholderText('12');
		fireEvent.input(inputValuesSize[0], { target: { value: 12 } });

		await waitFor(() => expect(toastMock).toHaveBeenCalledWith('Error al crear el pedido.'));
	});

	it('calls submit succesfully', async () => {
		render(() => <CustomCreateForm refereces={[{ id: 1, code: '3232', colors: [{ id: 1, color_id: 1 }] }]} />);
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createCustomRequest').mockResolvedValue({});

		const clientField = screen.getByPlaceholderText('Nombre del cliente');
		fireEvent.input(clientField, { target: { value: 'cliente' } });

		const referenceSelect = screen.getByTitle('Ver referencias');

		fireEvent(
			referenceSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(referenceSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listbox = screen.getByRole('listbox');
		const items = within(listbox).getAllByRole('option');

		fireEvent(
			items[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(items[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const inputValuesSize = await screen.findAllByPlaceholderText('12');
		fireEvent.input(inputValuesSize[0], { target: { value: 12 } });

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
