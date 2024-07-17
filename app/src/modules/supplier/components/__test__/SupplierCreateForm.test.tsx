import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as requests from '../../requests/supplierCreate';
import SupplierCreateForm from '../SupplierCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('SupplierCreateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <SupplierCreateForm />);
		const nameField = screen.getByPlaceholderText('Proveedor');
		const codeField = screen.getByPlaceholderText('2322');
		const nitField = screen.getByPlaceholderText('111111111');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(nitField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('check change inputs values ', async () => {
		render(() => <SupplierCreateForm />);
		const nameField = screen.getByPlaceholderText('Proveedor');
		const codeField = screen.getByPlaceholderText('2322');
		const nitField = screen.getByPlaceholderText('111111111');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(nitField, { target: { value: '222222222' } });

		expect(nameField).toHaveValue('Negro');
		expect(codeField).toHaveValue(1111);
		expect(nitField).toHaveValue(222222222);
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <SupplierCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const codeError = await screen.findByText('Ingresa el código.');
		const nitField = await screen.findByText('Ingresa el NIT.');

		expect(nameError).toBeInTheDocument();
		expect(codeError).toBeInTheDocument();
		expect(nitField).toBeInTheDocument();
	});

	it('show bad length error for nit', async () => {
		render(() => <SupplierCreateForm />);
		const nitField = screen.getByPlaceholderText('111111111');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(nitField, { target: { value: '22222222' } });
		fireEvent.click(submitButton);

		const hexError = await screen.findByText('El NIT debe ser de 9 dígitos');

		expect(hexError).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		render(() => <SupplierCreateForm />);
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createSupplierRequest').mockResolvedValue({});

		const nameField = screen.getByPlaceholderText('Proveedor');
		const codeField = screen.getByPlaceholderText('2322');
		const nitField = screen.getByPlaceholderText('111111111');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(nitField, { target: { value: '222222222' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
