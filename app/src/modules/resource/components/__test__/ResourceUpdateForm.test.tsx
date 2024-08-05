import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent } from '~/utils/event';
import * as requests from '../../requests/resourceUpdate';
import ResourceUpdateForm from '../ResourceUpdateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('ResourceUpdateForm', () => {
	it('renders correctly', () => {
		render(() => (
			<ResourceUpdateForm
				resource={{
					name: 'Resource 1',
					code: 1,
					cost: 100,
					color: 1,
					supplier: 1,
					deleted_at: null,
				}}
				colors={[
					{ id: 1, name: 'Blanco', hex: '', deleted_at: null },
					{ id: 2, name: 'Rojo', hex: '', deleted_at: null },
				]}
				suppliers={[
					{ id: 1, name: 'Supplier 1', deleted_at: null },
					{ id: 2, name: 'Supplier 2', deleted_at: null },
				]}
			/>
		));

		const nameField = screen.getByPlaceholderText('Nombre del insumo');
		const codeField = screen.getByPlaceholderText('2322');
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

	it('show empty fields error message when submit form', async () => {
		render(() => (
			<ResourceUpdateForm
				resource={{
					name: 'Resource 1',
					code: 1,
					cost: 100,
					color: 1,
					supplier: 1,
					deleted_at: null,
				}}
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: null }]}
				suppliers={[{ id: 1, name: 'Supplier 1', deleted_at: null }]}
			/>
		));

		const nameField = screen.getByPlaceholderText('Nombre del insumo');
		const codeField = screen.getByPlaceholderText('2322');
		const costField = screen.getByPlaceholderText('12000');
		const colorSelect = screen.getByTitle('Ver colores');
		const supplierSelect = screen.getByTitle('Ver proveedores');
		const statusSelect = screen.getByText('Activo');

		fireEvent.input(nameField, { target: { value: '' } });
		fireEvent.input(codeField, { target: { value: '' } });
		fireEvent.input(costField, { target: { value: '' } });

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

		// select all listbox
		const listboxes = screen.getAllByRole('listbox');

		const listboxStatus = listboxes[0];
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

		const listboxColor = listboxes[0];
		const color = within(listboxColor).getAllByRole('option');

		fireEvent(
			color[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
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

		const listboxSupplier = listboxes[0];
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
		const codeError = await screen.findByText('Ingresa el código.');
		const costError = await screen.findByText('Ingresa el costo.');
		const statusError = await screen.findByText('Selecciona un estado.');
		const colorError = await screen.findByText('Selecciona un color.');
		const supplierError = await screen.findByText('Selecciona un proveedor.');

		expect(nameError).toBeInTheDocument();
		expect(codeError).toBeInTheDocument();
		expect(costError).toBeInTheDocument();
		expect(statusError).toBeInTheDocument();
		expect(colorError).toBeInTheDocument();
		expect(supplierError).toBeInTheDocument();
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El código del insumo "2322" no está disponible. Intente con otro.',
			error: {
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al actualizar el insumo.',
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
				<ResourceUpdateForm
					resource={{
						name: 'Resource 1',
						code: 1,
						cost: 100,
						color: 1,
						supplier: 1,
						deleted_at: null,
					}}
					colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: null }]}
					suppliers={[{ id: 1, name: 'Supplier 1', deleted_at: null }]}
				/>
			));

			const requestMock = vi.spyOn(requests, 'updateResourceRequest').mockRejectedValue(requestError.error);
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

			const nameField = screen.getByPlaceholderText('Nombre del insumo');
			const codeField = screen.getByPlaceholderText('2322');
			const costField = screen.getByPlaceholderText('12000');
			const colorSelect = screen.getByTitle('Ver colores');
			const supplierSelect = screen.getByTitle('Ver proveedores');
			const statusSelect = screen.getByText('Activo');

			fireEvent.input(nameField, { target: { value: 'Resource 2' } });
			fireEvent.input(codeField, { target: { value: 2322 } });
			fireEvent.input(costField, { target: { value: 200 } });

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
				colors[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
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
				suppliers[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(suppliers[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

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

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(requestError.textExp);
			});
		});
	}

	it('calls calcel successfully', async () => {
		render(() => (
			<ResourceUpdateForm
				resource={{
					name: 'Resource 1',
					code: 1,
					cost: 100,
					color: 1,
					supplier: 1,
					deleted_at: null,
				}}
				colors={[]}
				suppliers={[]}
			/>
		));

		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});

	it('calls submit successfully', async () => {
		render(() => (
			<ResourceUpdateForm
				resource={{
					name: 'Resource 1',
					code: 1,
					cost: 100,
					color: 1,
					supplier: 1,
					deleted_at: null,
				}}
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: null }]}
				suppliers={[{ id: 1, name: 'Supplier 1', deleted_at: null }]}
			/>
		));

		const requestMock = vi.spyOn(requests, 'updateResourceRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');

		const nameField = screen.getByPlaceholderText('Nombre del insumo');
		const codeField = screen.getByPlaceholderText('2322');
		const costField = screen.getByPlaceholderText('12000');
		const colorSelect = screen.getByTitle('Ver colores');
		const supplierSelect = screen.getByTitle('Ver proveedores');
		const statusSelect = screen.getByText('Activo');

		fireEvent.input(nameField, { target: { value: 'Resource 2' } });
		fireEvent.input(codeField, { target: { value: 2 } });
		fireEvent.input(costField, { target: { value: 200 } });

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
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
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
			suppliers[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(suppliers[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

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

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
