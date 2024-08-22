import { A } from '@solidjs/router';
import { AiFillEdit, AiOutlinePlus } from 'solid-icons/ai';
import { Show } from 'solid-js';
import { cn } from '~/lib/utils';
import { Button } from './ui/Button';
import { TableCell } from './ui/Table';

type Action = {
	title: string;
	path: string;
};

const baseClass = 'inline-flex gap-2 p-2 min-w-16';

function ActionsCell(props: { update?: Action; details?: Action; create?: Action }) {
	return (
		<TableCell>
			<div class='flex gap-1'>
				<Show when={props.update}>
					<A href={props.update?.path as string} title={props.update?.title}>
						<Button variant='action' class={cn(baseClass)}>
							<AiFillEdit size={20} />
							Actualizar
						</Button>
					</A>
				</Show>
				<Show when={props.details}>
					<A href={props.details?.path as string} title={props.details?.title}>
						<Button variant='action' class={cn(baseClass)}>
							<AiOutlinePlus size={20} />
							Detalles
						</Button>
					</A>
				</Show>
				<Show when={props.create}>
					<A href={props.create?.path as string} title={props.create?.title}>
						<Button variant='action' class={cn(baseClass)}>
							<AiOutlinePlus size={20} />
							Agregar
						</Button>
					</A>
				</Show>
				<Show when={Object.values(props).length === 0}>Acciones</Show>
			</div>
		</TableCell>
	);
}

export default ActionsCell;
