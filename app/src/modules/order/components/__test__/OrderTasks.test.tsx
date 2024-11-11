import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { ORDERS_PATH } from '~/constants/paths';
import type { GetTasksByOrder } from '../../request/orderGet';
import OrderTasks from '../OrderTasks';

const AMock = vi.fn();
const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
	A: (props: { href: string }) => {
		AMock();
		return <div>{props.href}</div>;
	},
}));

vi.mock('~/hooks/useSteps', () => ({
	useSteps: () => ({ getTasksRecord: () => ({ 1: { name: 'Tarea 0' }, 2: { name: 'Tarea 0' } }) }),
}));

vi.mock('~/hooks/useTaskControlStatus', () => ({
	useTaskControlStatus: () => ({
		getTaskControlStatusRecord: () => ({
			1: { name: 'Creada' },
			2: { name: 'Iniciada' },
			3: { name: 'Terminada' },
			4: { name: 'Rechazada' },
		}),
	}),
}));

describe('OrderTasks', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly ', () => {
		const tasks: GetTasksByOrder = [
			{
				id: 1,
				created_at: '2024-07-11T22:36:52.140901Z',
				started_at: '2024-07-12T22:36:52.140901Z',
				finished_at: '',
				rejected_at: '',
				task_control_state_id: 2,
				task_id: 1,
				next_id: null,
				previous_id: null,
			},
			{
				id: 2,
				created_at: '',
				started_at: '',
				finished_at: '',
				rejected_at: '2024-07-13T22:36:52.140901Z',
				task_control_state_id: 4,
				task_id: 2,
				next_id: null,
				previous_id: 1,
			},
		];
		render(() => <OrderTasks tasks={tasks} />);

		const title = screen.getByText('Tareas de la orden');
		const firstId = screen.getByText('1');
		const secondId = screen.getByText('2');
		const createDate = screen.getByText('2024-07-11 05:36 PM');
		const startDate = screen.getByText('2024-07-12 05:36 PM');
		const rejectDate = screen.getByText('2024-07-13 05:36 PM');
		const rejectTitle = screen.getAllByText('Fecha de rechazo');
		const rejectState = screen.getByText('Rechazada');
		const startState = screen.getByText('Iniciada');

		expect(title).toBeInTheDocument();
		expect(firstId).toBeInTheDocument();
		expect(secondId).toBeInTheDocument();
		expect(createDate).toBeInTheDocument();
		expect(startDate).toBeInTheDocument();
		expect(rejectDate).toBeInTheDocument();
		expect(rejectState).toBeInTheDocument();
		expect(startState).toBeInTheDocument();
		expect(rejectTitle).length(1);
	});

	it('renders correctly on empty tasks', () => {
		const tasks: GetTasksByOrder = [];
		render(() => <OrderTasks tasks={tasks} />);

		const text = screen.getByText('No hay tareas asociadas a la orden');
		expect(text).toBeInTheDocument();
	});

	it('calls back correctly', async () => {
		const tasks: GetTasksByOrder = [];
		render(() => <OrderTasks tasks={tasks} />);

		const back = screen.getByText('Volver');
		fireEvent.click(back);

		await waitFor(() => expect(navigateMock).toBeCalledWith(ORDERS_PATH));
	});
});
