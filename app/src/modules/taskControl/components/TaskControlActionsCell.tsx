import { A } from '@solidjs/router';
import type { TaskControlStateValue } from '@vytex/client';
import { CgNotes } from 'solid-icons/cg';
import { Match, Switch, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { TASKS_PATH } from '~/constants/paths';
import { queryClient } from '~/lib/queryClient';
import type { TaskControl } from '~/types/core';
import { getTaskControlsQueryKey } from '../request/taskControlGet';
import { updateTaskControlRequest } from '../request/taskControlUpdate';

function TaskControlActionsCell(props: { id: number; refId: number; step: string; state: TaskControlStateValue }) {
	const [disabled, setDisabled] = createSignal(false);
	console.log(props.step);


	const updateTask = async (taskControl: Partial<TaskControl>) => {
		setDisabled(true);
		return updateTaskControlRequest(props.id, taskControl)
			.then(() => {
				toast.success('Tarea actualizada con éxito.');
				queryClient.refetchQueries({ queryKey: [getTaskControlsQueryKey], type: 'active', exact: false });
			})
			.catch(() => toast.error('Error al actualizar la tarea.'))
			.finally(() => setDisabled(false));
	};

	return (
		<TableCell>
			<Switch>
				<Match when={props.state === 'started'}>
					<div class='inline-flex gap-2'>
						<Button
							disabled={disabled()}
							onclick={() => updateTask({ finished_at: new Date().toISOString() })}
							variant='action'
						>
							Finalizar
						</Button>
						<A href={`${TASKS_PATH}/${props.step}/${props.refId}`} title='Detalles'>
							<Button variant='action' class='inline-flex gap-2'>
								<CgNotes size={20} />
								Detalles
							</Button>
						</A>
					</div>
				</Match>
				<Match when={props.state === 'created'}>
					<div class='inline-flex gap-2'>
						<Button
							disabled={disabled()}
							onclick={() => updateTask({ started_at: new Date().toISOString() })}
							variant='action'
						>
							Empezar
						</Button>
						<Button
							disabled={disabled()}
							onclick={() => updateTask({ rejected_at: new Date().toISOString() })}
							variant='destructive'
						>
							Rechazar
						</Button>
						<A href={`${TASKS_PATH}/${props.step}/${props.refId}`} title='Detalles'>
							<Button variant='action' class='inline-flex gap-2'>
								<CgNotes size={20} />
								Detalles
							</Button>
						</A>
					</div>
				</Match>
			</Switch>
		</TableCell>
	);
}

export default TaskControlActionsCell;
