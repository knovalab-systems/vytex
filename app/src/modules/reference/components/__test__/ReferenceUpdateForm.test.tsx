import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { MIN_NUM_VALUE, REQ_NUM_VALUE_MSG } from '~/constants/commonErrMsgs';
import { TASKS } from '~/constants/tasks';
import type { TimeByTask } from '~/types/core';
import * as requests from '../../requests/referenceTimesUpdate';
import ReferenceTimesUpdateForm from '../ReferenceTimesUpdateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

const defaultTimes = {
	id: 1,
	...TASKS.reduce((p: Record<string, number>, v) => {
		p[v] = 0;
		return p;
	}, {}),
};

describe('ReferenceTimesUpdateForm', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: defaultTimes as TimeByTask }} />);
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
		{ value: '', error: REQ_NUM_VALUE_MSG, title: 'shows errors on empty' },
		{ value: 'fwerwe', error: REQ_NUM_VALUE_MSG, title: 'shows errors on bad type' },
		{ value: 1.232, error: 'Ingresa un número entero.', title: 'shows errors on decimal' },
		{ value: '-23', error: MIN_NUM_VALUE, title: 'shows errors on negative number' },
	];

	for (const testCases of testCasesErrors) {
		it(testCases.title, async () => {
			render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: defaultTimes as TimeByTask }} />);
			const submitButton = screen.getByText('Actualizar');
			const inputs = screen.getAllByPlaceholderText('90');

			fireEvent.input(inputs[0], { target: { value: testCases.value } });
			fireEvent.click(submitButton);

			const err = await screen.findByText(testCases.error);
			expect(err).toBeInTheDocument();
		});
	}

	it('calls submit successfully', async () => {
		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'updateTimesRefenceRequest').mockResolvedValue({
			code: null,
			id: 0,
			deleted_at: null,
			created_at: null,
			front: null,
			front_image: null,
			back: null,
			back_image: null,
			created_by: null,
			user: null,
			time_by_task_id: null,
			time_by_task: null,
			colors: null,
			colors_count: 0,
		});
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: defaultTimes as TimeByTask }} />);

		const submitButton = screen.getByText('Actualizar');
		const inputs = screen.getAllByPlaceholderText('90');

		fireEvent.input(inputs[0], { target: { value: '12' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(mockNavigate).toHaveBeenCalled();
		});
	});

	it('calls submit with server error', async () => {
		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
		const requestMock = vi.spyOn(requests, 'updateTimesRefenceRequest').mockRejectedValue({});
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: defaultTimes as TimeByTask }} />);

		const submitButton = screen.getByText('Actualizar');
		const inputs = screen.getAllByPlaceholderText('90');

		fireEvent.input(inputs[0], { target: { value: '12' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toastMock).toHaveBeenCalled();
			expect(requestMock).toHaveBeenCalled();
		});
	});

	it('calls cancel successfully', async () => {
		render(() => <ReferenceTimesUpdateForm reference={{ id: 1, time_by_task: defaultTimes as TimeByTask }} />);
		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalled();
		});
	});
});
