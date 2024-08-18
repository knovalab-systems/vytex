import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
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
		const nameField = screen.getByPlaceholderText('Nombre del proveedor');
		const brandField = screen.getByPlaceholderText('Marca del proveedor');
		const codeField = screen.getByPlaceholderText('2322');
		const nitField = screen.getByPlaceholderText('111111111');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(brandField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(nitField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <SupplierCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const brandError = await screen.findByText('Ingresa la marca.');
		const codeError = await screen.findByText('Ingresa el código.');
		const nitField = await screen.findByText('Ingresa el NIT.');

		expect(nameError).toBeInTheDocument();
		expect(brandError).toBeInTheDocument();
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
		const requestMock = vi.spyOn(requests, 'createSupplierRequest').mockResolvedValue({
			id: 0,
			name: null,
			deleted_at: null,
			created_at: null,
			updated_at: null,
			code: null,
			nit: null,
			brand: null,
		});

		const nameField = screen.getByPlaceholderText('Nombre del proveedor');
		const brandField = screen.getByPlaceholderText('Marca del proveedor');
		const codeField = screen.getByPlaceholderText('2322');
		const nitField = screen.getByPlaceholderText('111111111');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(brandField, { target: { value: 'Marca' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(nitField, { target: { value: '222222222' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El código "1111" no está disponible. Intente con otro.',
			error: {
				errors: {
					detail: 'Supplier code already exists',
				},
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with nit exists',
			textExp: 'El NIT "222222222" no está disponible. Intente con otro.',
			error: {
				errors: {
					detail: 'Supplier NIT already exists',
				},
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with code n nit exists',
			textExp: 'El NIT "222222222" y el código "1111" no están disponibles. Intente con otros.',
			error: {
				errors: {
					detail: 'Any other',
				},
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al crear proveedor.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const err of requestsErrors) {
		it(err.title, async () => {
			render(() => <SupplierCreateForm />);
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
			const requestMock = vi.spyOn(requests, 'createSupplierRequest').mockRejectedValue(err.error);

			const nameField = screen.getByPlaceholderText('Nombre del proveedor');
			const brandField = screen.getByPlaceholderText('Marca del proveedor');
			const codeField = screen.getByPlaceholderText('2322');
			const nitField = screen.getByPlaceholderText('111111111');
			const submitButton = screen.getByText('Crear');

			fireEvent.input(nameField, { target: { value: 'Negro' } });
			fireEvent.input(brandField, { target: { value: 'Marca' } });
			fireEvent.input(codeField, { target: { value: '1111' } });
			fireEvent.input(nitField, { target: { value: '222222222' } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(err.textExp);
			});
		});
	}

	it('calls cancel successfully', async () => {
		render(() => <SupplierCreateForm />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		expect(mockNavigate).toHaveBeenCalled();
	});
});
