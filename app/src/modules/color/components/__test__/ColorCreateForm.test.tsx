import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as requests from '../../requests/colorCreate';
import ColorCreateForm from '../ColorCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('ColorCreateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ColorCreateForm />);
		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Crear');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(hexField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('check change inputs values ', async () => {
		render(() => <ColorCreateForm />);
		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(hexField, { target: { value: '000000' } });

		expect(nameField).toHaveValue('Negro');
		expect(codeField).toHaveValue('1111');
		expect(hexField).toHaveValue('000000');
	});

	it('show empty fields error message when submit form', async () => {
		render(() => <ColorCreateForm />);
		const submitButton = screen.getByText('Crear');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const codeError = await screen.findByText('Ingresa el código.');
		const hexError = await screen.findByText('Ingresa un valor válido de hexadecimal.');

		expect(nameError).toBeInTheDocument();
		expect(codeError).toBeInTheDocument();
		expect(hexError).toBeInTheDocument();
	});

	it('show bad length error for hex color', async () => {
		render(() => <ColorCreateForm />);
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(hexField, { target: { value: '0000000' } });
		fireEvent.click(submitButton);

		const hexError = await screen.findByText('Ingresa solo 3 o 6 valores.');

		expect(hexError).toBeInTheDocument();
	});

	it('show bad format error for hex color', async () => {
		render(() => <ColorCreateForm />);
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(hexField, { target: { value: '000000)' } });
		fireEvent.click(submitButton);

		const hexError = await screen.findByText('Ingresa un valor válido de hexadecimal.');

		expect(hexError).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		render(() => <ColorCreateForm />);
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createColorRequest').mockResolvedValue({});

		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Crear');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(hexField, { target: { value: '000000' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});
});
