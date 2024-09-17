import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { useSteps } from '~/hooks/useSteps';
import { parseDateTimeHuman } from '~/lib/parseTime';
import { getStateTask } from '../helpers/getStateTask';
import type { GetTaskType } from '../request/taskControlGet';

function CorteTable(props: { taskControls: GetTaskType }) {
	const { getTasksRecord } = useSteps();
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Tarea</TableHead>
						<TableHead>Orden</TableHead>
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
								<TableCell>{getTasksRecord()[taskControl.task_id].name}</TableCell>
								<TableCell>{taskControl.order_id}</TableCell>
								<TableCell>{getStateTask(taskControl)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.created_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.started_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.rejected_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(taskControl.finished_at)}</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CorteTable;
