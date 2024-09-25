import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { DEFAULT_TIME_BY_TASK } from '~/constants/tasks';
import type { TimeByTask } from '~/types/core';
import * as requests from '../../requests/referenceTimesUpdate';
import ReferenceTimesUpdateForm from '../ReferenceTimesUpdateForm';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

describe('ReferenceTimesUpdateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: DEFAULT_TIME_BY_TASK as TimeByTask }} />);
		const title = screen.getByText('Actualizar tiempos de la referencia');
		const stateField = screen.queryByText('segundos');
		const submitButton = screen.getByText('Actualizar');
		const cancelButton = screen.getByText('Cancelar');

		expect(title).toBeInTheDocument();
		expect(stateField).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	const testCasesErrors = [
		{ value: '', error: 'Ingresa un valor.', title: 'shows errors on empty' },
		{ value: 'fwerwe', error: 'Ingresa un valor.', title: 'shows errors on bad type' },
		{ value: 1.232, error: 'Ingresa un número entero.', title: 'shows errors on decimal' },
		{ value: '-23', error: 'Ingresa un valor igual o mayor a 0.', title: 'shows errors on negative number' },
	];

	for (const testCases of testCasesErrors) {
		it(testCases.title, async () => {
			render(() => (
				<ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: DEFAULT_TIME_BY_TASK as TimeByTask }} />
			));
			const submitButton = screen.getByText('Actualizar');
			const inputs = screen.getAllByPlaceholderText('90');

			fireEvent.input(inputs[0], { target: { value: testCases.value } });
			fireEvent.click(submitButton);

			const err = await screen.findByText(testCases.error);
			expect(err).toBeInTheDocument();
		});
	}

	it('calls submit successfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateTimesRefenceRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: DEFAULT_TIME_BY_TASK as TimeByTask }} />);

		const submitButton = screen.getByText('Actualizar');
		const inputs = screen.getAllByPlaceholderText('90');

		fireEvent.input(inputs[0], { target: { value: '12' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalledWith('Tiempos actualizados correctamente');
			expect(navigateMock).toHaveBeenCalled();
		});
	});

	it('calls submit with server error', async () => {
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
		const requestMock = vi.spyOn(requests, 'updateTimesRefenceRequest').mockRejectedValue({});
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: DEFAULT_TIME_BY_TASK as TimeByTask }} />);

		const submitButton = screen.getByText('Actualizar');
		const inputs = screen.getAllByPlaceholderText('90');

		fireEvent.input(inputs[0], { target: { value: '12' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toastMock).toHaveBeenCalledWith('Error al actualizar tiempos.');
			expect(requestMock).toHaveBeenCalled();
		});
	});
});
