import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent } from '~/utils/event';
import * as requests from '../../requests/colorUpdate';
import ColorUpdateForm from '../ColorUpdateForm';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

const refetchMock = vi.fn();
vi.mock('~/hooks/useColors', () => ({
	refetchColors: () => refetchMock(),
}));

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

describe('ColorUpdateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ColorUpdateForm />);
		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const stateField = screen.getByTitle('Ver estados');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(hexField).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('renders correctly on initial values', () => {
		render(() => (
			<ColorUpdateForm
				color={{
					id: 1,
					name: 'Negro',
					code: '3232',
					hex: '#000000',
					deleted_at: null,
					updated_at: null,
					created_at: null,
				}}
			/>
		));
		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const stateField = screen.getByTitle('Ver estados');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(nameField).toBeInTheDocument();
		expect(codeField).toBeInTheDocument();
		expect(hexField).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('show empty fields error message when submit form', async () => {
		render(() => (
			<ColorUpdateForm
				color={{
					id: 1,
					name: 'Negro',
					code: '3232',
					hex: '#000000',
					deleted_at: null,
					updated_at: null,
					created_at: null,
				}}
			/>
		));

		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');

		fireEvent.input(nameField, { target: { value: '' } });
		fireEvent.input(codeField, { target: { value: '' } });
		fireEvent.input(hexField, { target: { value: '' } });

		// status
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

		const submitButton = screen.getByText('Actualizar');
		fireEvent.click(submitButton);

		const nameError = await screen.findByText('Ingresa el nombre.');
		const codeError = await screen.findByText('Ingresa el código.');
		const hexError = await screen.findByText('Ingresa un valor válido de hexadecimal.');
		const statuError = await screen.findByText('Selecciona un estado.');

		expect(nameError).toBeInTheDocument();
		expect(codeError).toBeInTheDocument();
		expect(hexError).toBeInTheDocument();
		expect(statuError).toBeInTheDocument();
	});

	it('show bad length error for hex color', async () => {
		render(() => <ColorUpdateForm />);
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(hexField, { target: { value: '0000000' } });
		fireEvent.click(submitButton);

		const hexError = await screen.findByText('Ingresa solo 3 o 6 valores.');

		expect(hexError).toBeInTheDocument();
	});

	it('show bad format error for hex color', async () => {
		render(() => <ColorUpdateForm />);
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(hexField, { target: { value: '000000)' } });
		fireEvent.click(submitButton);

		const hexError = await screen.findByText('Ingresa un valor válido de hexadecimal.');

		expect(hexError).toBeInTheDocument();
	});

	it('calls submit succesfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateColorRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		render(() => (
			<ColorUpdateForm
				color={{
					id: 1,
					name: 'Negro',
					code: '3232',
					hex: '#000000',
					deleted_at: null,
					updated_at: null,
					created_at: null,
				}}
			/>
		));

		const nameField = screen.getByPlaceholderText('Blanco');
		const codeField = screen.getByPlaceholderText('2322');
		const hexField = screen.getByPlaceholderText('FFFFFF');
		const submitButton = screen.getByText('Actualizar');

		fireEvent.input(nameField, { target: { value: 'Negro' } });
		fireEvent.input(codeField, { target: { value: '1111' } });
		fireEvent.input(hexField, { target: { value: '000000' } });

		// status
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
			status[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(refetchMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalled();
		});
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El código "1111" no está disponible. Intente con otro.',
			error: {
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al actualizar color.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const err of requestsErrors) {
		it(err.title, async () => {
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
			const requestMock = vi.spyOn(requests, 'updateColorRequest').mockRejectedValue(err.error);
			render(() => (
				<ColorUpdateForm
					color={{
						id: 1,
						name: 'Negro',
						code: '3232',
						hex: '#000000',
						deleted_at: null,
						updated_at: null,
						created_at: null,
					}}
				/>
			));

			const nameField = screen.getByPlaceholderText('Blanco');
			const codeField = screen.getByPlaceholderText('2322');
			const hexField = screen.getByPlaceholderText('FFFFFF');
			const submitButton = screen.getByText('Actualizar');

			fireEvent.input(nameField, { target: { value: 'Negro' } });
			fireEvent.input(codeField, { target: { value: '1111' } });
			fireEvent.input(hexField, { target: { value: '000000' } });
			fireEvent.click(submitButton);

			// status
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
				status[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(err.textExp);
				expect(refetchMock).not.toHaveBeenCalled();
				expect(navigateMock).not.toHaveBeenCalled();
			});
		});
	}
});
