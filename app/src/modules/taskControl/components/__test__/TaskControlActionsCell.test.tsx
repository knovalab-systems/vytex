import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import * as request from '../../request/taskControlUpdate';
import TaskControlActionsCell from '../TaskControlActionsCell';

const refetchQueriesMock = vi.fn();
vi.mock('~/lib/queryClient', () => ({
	queryClient: {
		refetchQueries: () => {
			refetchQueriesMock();
		},
	},
}));

describe('TaskControlActionsCell', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on created', () => {
		render(() => <TaskControlActionsCell id={1} state='created' />);
		const startButton = screen.getByText('Empezar');
		const rejectButton = screen.getByText('Rechazar');
		const finishButton = screen.queryByText('Finalizar');

		expect(startButton).toBeInTheDocument();
		expect(rejectButton).toBeInTheDocument();
		expect(finishButton).not.toBeInTheDocument();
	});

	it('renders correctly on rejected', () => {
		render(() => <TaskControlActionsCell id={1} state='rejected' />);
		const startButton = screen.queryByText('Empezar');
		const rejectButton = screen.queryByText('Rechazar');
		const finishButton = screen.queryByText('Finalizar');

		expect(startButton).not.toBeInTheDocument();
		expect(rejectButton).not.toBeInTheDocument();
		expect(finishButton).not.toBeInTheDocument();
	});

	it('renders correctly on started', () => {
		render(() => <TaskControlActionsCell id={1} state='started' />);
		const startButton = screen.queryByText('Empezar');
		const rejectButton = screen.queryByText('Rechazar');
		const finishButton = screen.getByText('Finalizar');

		expect(startButton).not.toBeInTheDocument();
		expect(rejectButton).not.toBeInTheDocument();
		expect(finishButton).toBeInTheDocument();
	});

	it('renders correctly on finished', () => {
		render(() => <TaskControlActionsCell id={1} state='finished' />);
		const startButton = screen.queryByText('Empezar');
		const rejectButton = screen.queryByText('Rechazar');
		const finishButton = screen.queryByText('Finalizar');

		expect(startButton).not.toBeInTheDocument();
		expect(rejectButton).not.toBeInTheDocument();
		expect(finishButton).not.toBeInTheDocument();
	});

	const buttons = ['Empezar', 'Rechazar'];

	for (const button of buttons) {
		it('calls update request', async () => {
			// @ts-ignore: return value does not matter
			const requestMock = vi.spyOn(request, 'updateTaskControlRequest').mockResolvedValue({});
			const toastMock = vi.spyOn(toast, 'success');
			render(() => <TaskControlActionsCell id={1} state='created' />);
			const action = screen.getByText(button);

			fireEvent.click(action);

			await waitFor(() => {
				expect(requestMock).toBeCalled();
				expect(toastMock).toBeCalled();
				expect(refetchQueriesMock).toBeCalled();
			});
		});
	}

	it('calls update request', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(request, 'updateTaskControlRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success');
		render(() => <TaskControlActionsCell id={1} state='started' />);
		const action = screen.getByText('Finalizar');

		fireEvent.click(action);

		await waitFor(() => {
			expect(requestMock).toBeCalled();
			expect(toastMock).toBeCalled();
			expect(refetchQueriesMock).toBeCalled();
		});
	});

	for (const button of buttons) {
		it('calls update request with error response', async () => {
			const requestMock = vi.spyOn(request, 'updateTaskControlRequest').mockRejectedValue({});
			const toastMock = vi.spyOn(toast, 'error');
			render(() => <TaskControlActionsCell id={1} state='created' />);
			const action = screen.getByText(button);

			fireEvent.click(action);

			await waitFor(() => {
				expect(requestMock).toBeCalled();
				expect(toastMock).toBeCalled();
				expect(refetchQueriesMock).not.toBeCalled();
			});
		});
	}

	it('calls update request  with error response', async () => {
		const requestMock = vi.spyOn(request, 'updateTaskControlRequest').mockRejectedValue({});
		const toastMock = vi.spyOn(toast, 'error');
		render(() => <TaskControlActionsCell id={1} state='started' />);
		const action = screen.getByText('Finalizar');

		fireEvent.click(action);

		await waitFor(() => {
			expect(requestMock).toBeCalled();
			expect(toastMock).toBeCalled();
			expect(refetchQueriesMock).not.toBeCalled();
		});
	});
});
