import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import type { GetFabricType } from '../../requests/fabricGet';
import * as requests from '../../requests/fabricUpdate';
import FabricUpdateForm from '../FabricUpdateForm';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

vi.mock('~/hooks/useColors', () => ({
	useColors: () => ({
		getColors: () => [
			{ id: 1, name: 'Blanco', hex: '', deleted_at: null },
			{ id: 2, name: 'Negro', hex: '', delete_at: null },
		],
		getColorsRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
	}),
}));

vi.mock('~/hooks/useSuppliers', () => ({
	useSuppliers: () => ({
		getSuppliersRecord: () => ({ 1: { id: 1 }, 2: { id: 2 } }),
		getSuppliers: () => [{ id: 1 }, { id: 2 }],
	}),
}));

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

describe('FabricUpdateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => (
			<FabricUpdateForm
				fabric={
					{
						name: 'Fabric 1',
						code: '1',
						cost: 100,
						color_id: 1,
						supplier_id: 1,
						deleted_at: null,
					} as GetFabricType
				}
			/>
		));

		const nameField = screen.getByPlaceholderText('Tela');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		const colorSelect = screen.getByTitle('Ver colores');
		const supplierSelect = screen.getByTitle('Ver proveedores');
		const status = screen.getByText('Activo');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(costField).toBeInTheDocument();
		expect(colorSelect).toBeInTheDocument();
		expect(supplierSelect).toBeInTheDocument();
		expect(status).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('shows overflow error on compositions fields', async () => {
		render(() => (
			<FabricUpdateForm
				fabric={
					{
						name: 'Fabric 1',
						code: '1',
						cost: 100,
						color_id: 1,
						supplier_id: 1,
						deleted_at: null,
					} as GetFabricType
				}
			/>
		));

		const compositionFields = screen.getAllByPlaceholderText('10');
		fireEvent.input(compositionFields[0], { target: { value: 101 } });

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const overflowCompositionFieldErr = await screen.findByText('Ingresa un valor igual o menor 100.');

		expect(overflowCompositionFieldErr).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		render(() => (
			<FabricUpdateForm
				fabric={
					{
						name: 'Fabric 1',
						code: '1',
						cost: 100,
						color_id: 1,
						supplier_id: 1,
						deleted_at: null,
						composition: {
							algod: 10000,
						},
					} as GetFabricType
				}
			/>
		));

		const nameField = screen.getByPlaceholderText('Tela');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		const compositionFields = screen.getAllByPlaceholderText('10');
		fireEvent.input(compositionFields[0], { target: { value: '' } });

		fireEvent.input(nameField, { target: { value: '' } });
		fireEvent.input(codeField, { target: { value: '' } });
		fireEvent.input(costField, { target: { value: '' } });

		// select status

		const statusSelect = screen.getByTitle('Ver estados');

		fireEvent(
			statusSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxStatus = screen.getByRole('listbox');
		const status = within(listboxStatus).getAllByRole('option');

		fireEvent(
			status[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// select color

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const color = within(listboxColor).getAllByRole('option');

		fireEvent(
			color[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(color[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// select supplier
		const supplierSelect = screen.getByTitle('Ver proveedores');

		fireEvent(
			supplierSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(supplierSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxSupplier = screen.getByRole('listbox');
		const supplier = within(listboxSupplier).getAllByRole('option');

		fireEvent(
			supplier[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(supplier[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const codeError = screen.getByText('Ingresa el código.');
		const costError = screen.getByText('Ingresa el costo.');
		const statusError = screen.getByText('Selecciona un estado.');
		const colorError = screen.getByText('Selecciona un color.');
		const supplierError = screen.getByText('Selecciona un proveedor.');
		const compositionsError = screen.getByText('Ingresa un valor.');

		expect(nameError).toBeInTheDocument();
		expect(codeError).toBeInTheDocument();
		expect(costError).toBeInTheDocument();
		expect(statusError).toBeInTheDocument();
		expect(colorError).toBeInTheDocument();
		expect(supplierError).toBeInTheDocument();
		expect(compositionsError).toBeInTheDocument();
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El código de la tela "2322" no está disponible. Intente con otro.',
			error: {
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al actualizar la tela.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const requestError of requestsErrors) {
		it(requestError.title, async () => {
			render(() => (
				<FabricUpdateForm
					fabric={
						{
							name: 'Fabric 1',
							code: '1',
							cost: 100,
							color_id: 1,
							supplier_id: 1,
							deleted_at: null,
						} as GetFabricType
					}
				/>
			));

			const requestMock = vi.spyOn(requests, 'updateFabricRequest').mockRejectedValue(requestError.error);
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

			const nameField = screen.getByPlaceholderText('Tela');
			const codeField = screen.getByPlaceholderText('23231');
			const costField = screen.getByPlaceholderText('12000');
			const colorSelect = screen.getByTitle('Ver colores');
			const supplierSelect = screen.getByTitle('Ver proveedores');
			const statusSelect = screen.getByText('Activo');
			const compositionFields = screen.getAllByPlaceholderText('10');

			fireEvent.input(compositionFields[0], { target: { value: 100 } });
			fireEvent.input(nameField, { target: { value: 'Fabric 2' } });
			fireEvent.input(codeField, { target: { value: 2322 } });
			fireEvent.input(costField, { target: { value: 200 } });

			// select status
			fireEvent(
				statusSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxStatus = screen.getByRole('listbox');
			const status = within(listboxStatus).getAllByRole('option');

			fireEvent(
				status[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent(
				colorSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxColor = screen.getByRole('listbox');
			const colors = within(listboxColor).getAllByRole('option');

			fireEvent(
				colors[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colors[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent(
				colorSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			fireEvent(
				colorSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			// select supplier

			fireEvent(
				supplierSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(supplierSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxSupplier = screen.getByRole('listbox');
			const suppliers = within(listboxSupplier).getAllByRole('option');

			fireEvent(
				suppliers[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(suppliers[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const submitButton = screen.getByText('Actualizar');
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(requestError.textExp);
			});
		});
	}

	it('calls submit successfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateFabricRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		render(() => (
			<FabricUpdateForm
				fabric={
					{
						name: 'Fabric 1',
						code: '1',
						cost: 100,
						color_id: 1,
						supplier_id: 1,
						deleted_at: null,
					} as GetFabricType
				}
			/>
		));

		const nameField = screen.getByPlaceholderText('Tela');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		const colorSelect = screen.getByTitle('Ver colores');
		const supplierSelect = screen.getByTitle('Ver proveedores');
		const statusSelect = screen.getByText('Activo');
		const compositionFields = screen.getAllByPlaceholderText('10');

		fireEvent.input(compositionFields[0], { target: { value: 100 } });
		fireEvent.input(nameField, { target: { value: 'Fabric 2' } });
		fireEvent.input(codeField, { target: { value: 2 } });
		fireEvent.input(costField, { target: { value: 200 } });

		// select status
		fireEvent(
			statusSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxStatus = screen.getByRole('listbox');
		const status = within(listboxStatus).getAllByRole('option');

		fireEvent(
			status[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// select supplier

		fireEvent(
			supplierSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(supplierSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxSupplier = screen.getByRole('listbox');
		const suppliers = within(listboxSupplier).getAllByRole('option');

		fireEvent(
			suppliers[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(suppliers[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
