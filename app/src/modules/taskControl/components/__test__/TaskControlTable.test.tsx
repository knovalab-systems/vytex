import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import TaskControlTable from '../TaskControlTable';

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

describe('TaskControlTable', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty taskcontrols', () => {
		render(() => <TaskControlTable taskControls={[]} />);
		const tableHeader = screen.getByText('No se han encontrado tareas.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on taskcontrols', () => {
		render(() => (
			<TaskControlTable
				taskControls={[
					{
						id: 200,
						created_at: '2024-06-11T22:36:52.140901Z',
						started_at: '',
						finished_at: '',
						rejected_at: '',
						task_id: 1,
						order_id: 2,
						order: { color_by_reference: { color_id: 1, reference: { code: '1' } } },
						task_control_state_id: 1,
					},
					{
						id: 0,
						created_at: '',
						started_at: '2024-06-14T22:36:52.140901Z',
						finished_at: '',
						rejected_at: '',
						task_id: 1,
						order_id: 3,
						order: { color_by_reference: { color_id: 1, reference: { code: '1' } } },
						task_control_state_id: 2,
					},
					{
						id: 0,
						created_at: '',
						started_at: '',
						finished_at: '2024-06-13T22:36:52.140901Z',
						rejected_at: '',
						task_id: 1,
						order_id: 4,
						order: { color_by_reference: { color_id: 1, reference: { code: '1' } } },
						task_control_state_id: 3,
					},
					{
						id: 0,
						created_at: '',
						started_at: '',
						finished_at: '',
						rejected_at: '2024-06-12T22:36:52.140901Z',
						task_id: 1,
						order_id: 5,
						order: { color_by_reference: { color_id: 1, reference: { code: '1' } } },
						task_control_state_id: 4,
					},
				]}
			/>
		));

		const refTitle = screen.getByText('Referencia');
		const ordenTitle = screen.getByText('Orden');
		const IDTitle = screen.getByText('ID');
		const taskTitle = screen.getByText('Tarea');
		const stateTitle = screen.getByText('Estado');
		const createdTitle = screen.getByText('Fecha de creación');
		const startedTitle = screen.getByText('Fecha de inicio');
		const ejectedTitle = screen.getByText('Fecha de rechazo');
		const finishedTitle = screen.getByText('Fecha de finalización');
		const actionsTitle = screen.getByText('Acciones');

		const taskControlid = screen.getByText('200');
		const orderId = screen.getByText('5');
		const stateCreated = screen.getByText('Creada');
		const stateStarted = screen.getByText('Iniciada');
		const stateRejected = screen.getByText('Rechazada');
		const stateFinished = screen.getByText('Terminada');
		const refValue = screen.getAllByText('1');

		const finishedAt = screen.getByText('2024-06-13 05:36 PM');
		const rejectedAt = screen.getByText('2024-06-12 05:36 PM');
		const startedAt = screen.getByText('2024-06-14 05:36 PM');
		const createdAt = screen.getByText('2024-06-11 05:36 PM');

		expect(refTitle).toBeInTheDocument();
		expect(ordenTitle).toBeInTheDocument();
		expect(IDTitle).toBeInTheDocument();
		expect(taskTitle).toBeInTheDocument();
		expect(stateTitle).toBeInTheDocument();
		expect(createdTitle).toBeInTheDocument();
		expect(startedTitle).toBeInTheDocument();
		expect(ejectedTitle).toBeInTheDocument();
		expect(finishedTitle).toBeInTheDocument();
		expect(actionsTitle).toBeInTheDocument();

		expect(taskControlid).toBeInTheDocument();
		expect(orderId).toBeInTheDocument();
		expect(stateCreated).toBeInTheDocument();
		expect(stateStarted).toBeInTheDocument();
		expect(stateRejected).toBeInTheDocument();
		expect(stateFinished).toBeInTheDocument();
		expect(refValue).length(4);

		expect(finishedAt).toBeInTheDocument();
		expect(rejectedAt).toBeInTheDocument();
		expect(startedAt).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
});
