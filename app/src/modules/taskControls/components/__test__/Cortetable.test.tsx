import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import CorteTable from '../CorteTable';

vi.mock('~/hooks/useSteps', () => ({
	useSteps: () => ({ getTasksRecord: () => ({ 1: { name: 'Tarea 0' }, 2: { name: 'Tarea 0' } }) }),
}));

describe('CorteTable', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty taskcontrols', () => {
		render(() => <CorteTable taskControls={[]} />);
		const tableHeader = screen.getByText('No se han encontrado tareas.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on taskcontrols', () => {
		render(() => (
			<CorteTable
				taskControls={[
					{
						id: 200,
						created_at: '2024-06-11T22:36:52.140901Z',
						started_at: '',
						finished_at: '',
						rejected_at: '',
						task_id: 1,
						order_id: 2,
					},
					{
						id: 0,
						created_at: '',
						started_at: '2024-06-14T22:36:52.140901Z',
						finished_at: '',
						rejected_at: '',
						task_id: 1,
						order_id: 3,
					},
					{
						id: 0,
						created_at: '',
						started_at: '',
						finished_at: '2024-06-13T22:36:52.140901Z',
						rejected_at: '',
						task_id: 1,
						order_id: 4,
					},
					{
						id: 0,
						created_at: '',
						started_at: '',
						finished_at: '',
						rejected_at: '2024-06-12T22:36:52.140901Z',
						task_id: 1,
						order_id: 5,
					},
				]}
			/>
		));

		const taskControlid = screen.getByText('200');
		const orderId = screen.getByText('5');
		const stateCreated = screen.getByText('Creada');
		const stateStarted = screen.getByText('Iniciada');
		const stateRejected = screen.getByText('Rechazada');
		const stateFinished = screen.getByText('Terminada');

		const finishedAt = screen.getByText('2024-06-13 5:36 PM');
		const rejectedAt = screen.getByText('2024-06-12 5:36 PM');
		const startedAt = screen.getByText('2024-06-14 5:36 PM');
		const createdAt = screen.getByText('2024-06-11 5:36 PM');

		expect(taskControlid).toBeInTheDocument();
		expect(orderId).toBeInTheDocument();
		expect(stateCreated).toBeInTheDocument();
		expect(stateStarted).toBeInTheDocument();
		expect(stateRejected).toBeInTheDocument();
		expect(stateFinished).toBeInTheDocument();

		expect(finishedAt).toBeInTheDocument();
		expect(rejectedAt).toBeInTheDocument();
		expect(startedAt).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
});
