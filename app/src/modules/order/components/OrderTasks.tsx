import { useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
import LitsTile from '~/components/LitsTile';
import { Button } from '~/components/ui/Button';
import { ORDERS_PATH } from '~/constants/paths';
import { useSteps } from '~/hooks/useSteps';
import { useTaskControlStatus } from '~/hooks/useTaskControlStatus';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetTasksByOrder } from '../request/orderGet';

function OrderTasks(props: { tasks: GetTasksByOrder }) {
	const navigate = useNavigate();
	const { getTasksRecord } = useSteps();
	const { getTaskControlStatusRecord } = useTaskControlStatus();

	const filteredTasks = () =>
		props.tasks.reduce(
			(p: { rejected: OrderTask[]; unrejected: OrderTask[] }, v) => {
				const t: OrderTask = {
					id: v.id,
					previous: v.previous_id,
					next: v.next_id,
					name: getTasksRecord()[v.task_id].name,
					state: getTaskControlStatusRecord()[v.task_control_state_id].name,
					created_date: parseDateTimeHuman(v.created_at),
					started_date: parseDateTimeHuman(v.started_at),
					finished_date: parseDateTimeHuman(v.finished_at) || 'Sin finalizar',
					rejected_date: parseDateTimeHuman(v.rejected_at),
				};
				if (v.rejected_at) {
					p.rejected.push(t);
				} else {
					p.unrejected.push(t);
				}
				return p;
			},
			{ rejected: [], unrejected: [] },
		);

	const tasks = () =>
		filteredTasks().unrejected.map(e => {
			const rejected = filteredTasks().rejected.filter(r => r.previous === e.id);
			if (rejected.length > 0) {
				e.rejected = rejected;
			}
			return e;
		});

	const handleBack = () => navigate(ORDERS_PATH);

	return (
		<div class='overflow-auto m-auto'>
			<div class='m-4 p-8 space-y-4 bg-white border-gray-100 shadow-md rounded-md border'>
				<h1 class='text-2xl font-bold text-center mb-4'>Tareas de la orden</h1>
				<div class='flex flex-col gap-4 overflow-auto'>
					<Show when={tasks.length === 0}>No hay tareas asociadas a la orden</Show>
					<For each={tasks()}>
						{task => (
							<div class='flex gap-2 w-full'>
								<OrderTask task={task} />
								<Show when={task.rejected}>
									<h3 class='text-center my-auto font-semibold text-md text-red-800'>Tareas rechazadas:</h3>
									<For each={task.rejected}>{rejected => <OrderTask task={rejected} />}</For>
								</Show>
							</div>
						)}
					</For>
				</div>
			</div>
			<div class='flex m-4 justify-between'>
				<Button onClick={handleBack} type='button' variant='secondary'>
					Volver
				</Button>
			</div>
		</div>
	);
}

type OrderTask = {
	id: number;
	name: string;
	state: string;
	created_date: string;
	started_date: string;
	finished_date: string;
	rejected_date: string;
	previous: number | null;
	next: number | null;
	rejected?: OrderTask[];
};

function OrderTask(props: { task: OrderTask }) {
	return (
		<div class='min-w-96 w-full whitespace-nowrap border grid-rows-3 grid grid-cols-2 gap-2 rounded-lg shadow-lg shadow-purple-100 border-gray-700 p-2 border-t-2 border-l-2'>
			<LitsTile title={props.task.id.toString()} support='Identificador' />
			<LitsTile title={props.task.name} support='Tarea' />
			<LitsTile title={props.task.state} support='Estado' />
			<LitsTile title={props.task.created_date} support='Fecha de creación' />
			<Show
				when={props.task.rejected_date === ''}
				fallback={<LitsTile title={props.task.rejected_date} support='Fecha de rechazo' />}
			>
				<LitsTile title={props.task.started_date} support='Fecha de inicio' />
				<LitsTile title={props.task.finished_date} support='Fecha de finalización' />
			</Show>
		</div>
	);
}

export default OrderTasks;
