import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import * as requests from '../../requests/resourceCreate';
import ResourceCreateForm from '../ResourceCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

vi.mock('~/hooks/useColors', () => ({
	useColors: () => ({
		getColors: () => [{ id: 1, name: 'Blanco', hex: '', deleted_at: null }],
		getColorsRecord: () => ({ 1: {} }),
	}),
}));

describe('ResourceCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ResourceCreateForm suppliers={[]} />);
		const nameField = screen.getByPlaceholderText('Insumo');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		const colorSelect = screen.getByTitle('Ver colores');
		const supplierSelect = screen.getByTitle('Ver proveedores');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(costField).toBeInTheDocument();
		expect(colorSelect).toBeInTheDocument();
		expect(supplierSelect).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('shows required errors correctly', async () => {
		render(() => <ResourceCreateForm suppliers={[]} />);

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const codeFieldErr = await screen.findByText('Ingresa el código.');
		const costFieldErr = await screen.findByText('Ingresa el costo.');
		const nameFieldErr = await screen.findByText('Ingresa el nombre.');
		const colorSelectErr = screen.getByText('Selecciona un color.');
		const supplierSelectErr = screen.getByText('Selecciona un proveedor.');

		expect(codeFieldErr).toBeInTheDocument();
		expect(costFieldErr).toBeInTheDocument();
		expect(nameFieldErr).toBeInTheDocument();
		expect(colorSelectErr).toBeInTheDocument();
		expect(supplierSelectErr).toBeInTheDocument();
	});

	it('calls submit successfully', async () => {
		render(() => (
			<ResourceCreateForm
				suppliers={[
					{
						id: 1,
						name: 'Proveedor',
						deleted_at: null,
					},
				]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createResourceRequest').mockResolvedValue({
			code: null,
			id: 0,
			name: null,
			deleted_at: null,
			created_at: null,
			cost: null,
			color_id: null,
			color: {
				id: 0,
				name: null,
				code: null,
				hex: null,
				deleted_at: null,
				created_at: null,
				updated_at: null,
			},
			supplier_id: null,
			supplier: {
				id: 0,
				nit: null,
				name: null,
				brand: null,
				code: null,
				deleted_at: null,
				updated_at: null,
				created_at: null,
			},
		});

		const nameField = screen.getByPlaceholderText('Insumo');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		fireEvent.input(nameField, { target: { value: 'Insumo' } });
		fireEvent.input(codeField, { target: { value: 23231 } });
		fireEvent.input(costField, { target: { value: 12000 } });

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

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});

	it('calls submit error, code exists', async () => {
		render(() => (
			<ResourceCreateForm
				suppliers={[
					{
						id: 1,
						name: 'Proveedor',
						deleted_at: null,
					},
				]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
		const requestMock = vi.spyOn(requests, 'createResourceRequest').mockRejectedValue({
			message: 'Error',
			response: {
				status: 409,
			},
		});

		const nameField = screen.getByPlaceholderText('Insumo');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		fireEvent.input(nameField, { target: { value: 'Insumo' } });
		fireEvent.input(codeField, { target: { value: 23231 } });
		fireEvent.input(costField, { target: { value: 12000 } });

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

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalledWith('El código del insumo "23231" no está disponible. Intente con otro.');
		});
	});

	it('calls submit error, server error', async () => {
		render(() => (
			<ResourceCreateForm
				suppliers={[
					{
						id: 1,
						name: 'Proveedor',
						deleted_at: null,
					},
				]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
		const requestMock = vi.spyOn(requests, 'createResourceRequest').mockRejectedValue({
			message: 'Error',
			response: {
				status: 400,
			},
		});

		const nameField = screen.getByPlaceholderText('Insumo');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		fireEvent.input(nameField, { target: { value: 'Insumo' } });
		fireEvent.input(codeField, { target: { value: 23231 } });
		fireEvent.input(costField, { target: { value: 12000 } });

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

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalledWith('Error al crear insumo');
		});
	});
});
