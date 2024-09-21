import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { useColors } from '~/hooks/useColors';
import { usePolicies } from '~/hooks/usePolicies';
import { useSteps } from '~/hooks/useSteps';
import { parseDateTimeHuman } from '~/lib/parseTime';
import { getStateTask } from '../helpers/getStateTask';
import type { GetTaskType } from '../request/taskControlGet';
import TaskControlActionsCell from './TaskControlActionsCell';

function CorteTable(props: { taskControls: GetTaskType }) {
	const { getTasksRecord } = useSteps();
	const { colorsRecord } = useColors();
	const { hasPolicy } = usePolicies();
	return (
		<TableContainer>
			<Table>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Tarea</TableHead>
						<TableHead>Orden</TableHead>
						<TableHead>Referencia</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Fecha de creación</TableHead>
						<TableHead>Fecha de inicio</TableHead>
						<TableHead>Fecha de rechazo</TableHead>
						<TableHead>Fecha de finalización</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.taskControls?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={8}>No se han encontrado tareas.</TableCell>
						</TableRow>
					</Show>
					<For each={props.taskControls}>
						{taskControl => (
							<TableRow class='bg-white group'>
								<TableCell>{taskControl.id}</TableCell>
								<TableCell class='font-semibold text-base text-gray-600'>
									{getTasksRecord()[taskControl.task_id].name}
								</TableCell>
								<TableCell>{taskControl.order_id}</TableCell>
								<TableCell class='inline-flex gap-2'>
									<div
										class='h-10 w-10 border-2'
										title={colorsRecord()[taskControl?.order?.color_by_reference?.color_id as number]?.name || ''}
										style={{
											background: colorsRecord()[taskControl?.order?.color_by_reference?.color_id as number]?.hex || '',
										}}
									/>
									<div class='my-auto'>{taskControl.order.color_by_reference?.reference?.code}</div>
								</TableCell>
								<TableCell>{getStateTask(taskControl)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.created_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.started_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.rejected_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.finished_at)}</TableCell>
								<Show when={hasPolicy('UpdateCorte')} fallback={<TableCell />}>
									<TaskControlActionsCell
										id={taskControl.id}
										started={Boolean(taskControl.started_at)}
										rejected={Boolean(taskControl.rejected_at)}
										finished={Boolean(taskControl.finished_at)}
									/>
								</Show>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CorteTable;
