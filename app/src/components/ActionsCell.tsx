import { A } from '@solidjs/router';
import { AiFillEdit, AiOutlinePlus } from 'solid-icons/ai';
import { CgNotes } from 'solid-icons/cg';
import { IoPlay } from 'solid-icons/io';
import { For, type JSXElement, Show } from 'solid-js';
import { cn } from '~/lib/utils';
import type { Action, Icons } from '~/types/actionsCell';
import { Button } from './ui/Button';
import { TableCell } from './ui/Table';

const baseClass = 'inline-flex gap-2 p-2 pr-3 min-w-16';

function ActionsCell(props: { actions: Action[] }) {
	const icons: Record<Icons, () => JSXElement> = {
		update: () => <AiFillEdit size={20} />,
		details: () => <CgNotes size={20} />,
		create: () => <AiOutlinePlus size={20} />,
		start: () => <IoPlay size={20} />,
	};

	return (
		<TableCell>
			<div class='flex gap-1'>
				<For each={props.actions}>
					{a => (
						<A href={a.path} title={a.title}>
							<Button variant='action' class={cn(baseClass)}>
								{icons[a.icon]()}
								{a.label}
							</Button>
						</A>
					)}
				</For>
				<Show when={Object.values(props.actions).length === 0}>Acciones</Show>
			</div>
		</TableCell>
	);
}

export default ActionsCell;
