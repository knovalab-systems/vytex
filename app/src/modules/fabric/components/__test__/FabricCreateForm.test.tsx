import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FabricCreateForm from '../FabricCreateForm';
import toast from 'solid-toast';
import * as requests from '../../requests/fabricCreate';
import { createPointerEvent, installPointerEvent } from '~/utils/event';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('FabricCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <FabricCreateForm colors={[]} suppliers={[]} />);
		const nameField = screen.getByPlaceholderText('Tela');
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
		render(() => <FabricCreateForm colors={[]} suppliers={[]} />);

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

	it('shows overflow error on compositions fields', async () => {
		render(() => <FabricCreateForm colors={[]} suppliers={[]} />);

		const compositionFields = screen.getAllByPlaceholderText('10');
		fireEvent.input(compositionFields[0], { target: { value: 101 } });

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const overflowCompositionFieldErr = await screen.findByText('Ingresa un valor igual o menor 100.');

		expect(overflowCompositionFieldErr).toBeInTheDocument();
	});

	it('calls submit with compositions errow, different to 100', async () => {
		render(() => (
			<FabricCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: null }]}
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

		const nameField = screen.getByPlaceholderText('Tela');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		fireEvent.input(nameField, { target: { value: 'tela' } });
		fireEvent.input(codeField, { target: { value: 1232 } });
		fireEvent.input(costField, { target: { value: 1232 } });

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

		const compositionFields = screen.getAllByPlaceholderText('10');
		fireEvent.input(compositionFields[0], { target: { value: 51 } });
		fireEvent.input(compositionFields[1], { target: { value: 50 } });

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);
		await waitFor(() => expect(toastMock).toHaveBeenCalled());
	});

	it('calls submit succesfully', async () => {
		render(() => (
			<FabricCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: null }]}
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
		const requestMock = vi.spyOn(requests, 'createFabricRequest').mockResolvedValue({});

		const nameField = screen.getByPlaceholderText('Tela');
		const codeField = screen.getByPlaceholderText('23231');
		const costField = screen.getByPlaceholderText('12000');
		fireEvent.input(nameField, { target: { value: 'tela' } });
		fireEvent.input(codeField, { target: { value: 1232 } });
		fireEvent.input(costField, { target: { value: 1232 } });

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

		const compositionFields = screen.getAllByPlaceholderText('10');
		fireEvent.input(compositionFields[0], { target: { value: 50 } });
		fireEvent.input(compositionFields[1], { target: { value: 50 } });

		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
