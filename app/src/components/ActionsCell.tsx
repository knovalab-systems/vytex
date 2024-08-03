import { A } from '@solidjs/router';
import { AiFillEdit, AiOutlinePlus } from 'solid-icons/ai';
import { Show } from 'solid-js';
import { Button } from './ui/Button';
import { TableCell } from './ui/Table';

type Action = {
	title: string;
	path: string;
};

function ActionsCell(props: { update?: Action; details?: Action; create?: Action }) {
	return (
		<TableCell>
			<Show when={props.update}>
				<A href={props.update?.path as string} title={props.update?.title}>
					<Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
						<AiFillEdit size={20} />
						Actualizar
					</Button>
				</A>
			</Show>
			<Show when={props.details}>
				<A href={props.details?.path as string} title={props.details?.title}>
					<Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
						<AiOutlinePlus size={20} />
						Detalles
					</Button>
				</A>
			</Show>
			<Show when={props.create}>
				<A href={props.create?.path as string} title={props.create?.title}>
					<Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
						<AiOutlinePlus size={20} />
						Agregar
					</Button>
				</A>
			</Show>
			<Show when={Object.values(props).length === 0}>Acciones</Show>
		</TableCell>
	);
}

export default ActionsCell;
