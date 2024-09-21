import { getLocalTimeZone, now } from '@internationalized/date';
import { Match, Switch, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { queryClient } from '~/lib/queryClient';
import type { TaskControl } from '~/types/core';
import { getTaskControlsQueryKey } from '../request/taskControlGet';
import { updateTaskControlRequest } from '../request/taskControlUpdate';

function TaskControlActionsCell(props: { id: number; started: boolean; rejected: boolean; finished: boolean }) {
	const [disabled, setDisabled] = createSignal(false);

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
				<Match when={props.started && !props.rejected && !props.finished}>
					<Button
						disabled={disabled()}
						onclick={() => updateTask({ finished_at: now(getLocalTimeZone()).toAbsoluteString() })}
						variant='action'
					>
						Finalizar
					</Button>
				</Match>
				<Match when={!props.started && !props.rejected && !props.finished}>
					<div class='inline-flex gap-2'>
						<Button
							disabled={disabled()}
							onclick={() => updateTask({ started_at: now(getLocalTimeZone()).toAbsoluteString() })}
							variant='action'
						>
							Empezar
						</Button>
						<Button
							disabled={disabled()}
							onclick={() => updateTask({ rejected_at: now(getLocalTimeZone()).toAbsoluteString() })}
							variant='destructive'
						>
							Rechazar
						</Button>
					</div>
				</Match>
			</Switch>
		</TableCell>
	);
}

export default TaskControlActionsCell;
