import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import type { GetCustomType } from '~/modules/custom/requests/CustomGet';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import * as requests from '../../request/OrderCreate';
import OrderCreateForm from '../OrderCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('OrderCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <OrderCreateForm references={[]} custom={[] as unknown as GetCustomType} />);

		const refField = screen.getByText('Referencia');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(refField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('shows required errors correctly', async () => {
		render(() => <OrderCreateForm references={[]} custom={[] as unknown as GetCustomType} />);

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			const refFieldErr = screen.getByText(/Seleccione una referencia./);
			expect(refFieldErr).toBeInTheDocument();
		});
	});

	it('calls cancel successfully', async () => {
		render(() => <OrderCreateForm references={[]} custom={[] as unknown as GetCustomType} />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});

	it('calls submit with pending values for sizes', async () => {
		render(() => (
			<OrderCreateForm
				references={[
					{
						id: 1,
						code: '3232',
						colors: [
							{
								id: 1,
								color_id: 1,
							},
						],
					},
				]}
				custom={[] as unknown as GetCustomType}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

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
			expect(toastMock).toHaveBeenCalledWith('Cada referencia debe tener al menos una talla con un valor mayor a 0.'),
		);
	});

	it('calls submit with error server', async () => {
		render(() => (
			<OrderCreateForm
				references={[
					{
						id: 1,
						code: '3232',
						colors: [
							{
								id: 1,
								color_id: 1,
							},
						],
					},
				]}
				custom={[] as unknown as GetCustomType}
			/>
		));
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

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

		await waitFor(() => expect(toastMock).toHaveBeenCalledWith('Error al crear la orden.'));
	});

	it('calls submit succesfully', async () => {
		render(() => (
			<OrderCreateForm
				references={[
					{
						id: 1,
						code: '3232',
						colors: [
							{
								id: 1,
								color_id: 1,
							},
						],
					},
				]}
				custom={[{ id: 1 }] as unknown as GetCustomType}
			/>
		));

		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createOrderRequest').mockResolvedValue({
			status: null,
			custom: null,
			id: 0,
			created_at: null,
			finished_at: null,
			canceled_at: null,
			created_by: null,
			canceled_by: null,
			color_by_reference_id: null,
			custom_id: null,
			color_by_reference: null,
			create_user: null,
			cancel_user: null,
			'2XS': null,
			XS: null,
			S: null,
			M: null,
			L: null,
			XL: null,
			'2XL': null,
			'3XL': null,
			'4XL': null,
			'5XL': null,
			'6XL': null,
			'7XL': null,
			'8XL': null,
		});

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
