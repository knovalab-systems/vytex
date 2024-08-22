import { Show } from 'solid-js';
import { cn } from '~/lib/utils';

const baseClass = 'inline-flex min-w-20 justify-center px-3 py-1 rounded-full';

/**
 * @param {object} props
 * @param {boolean} props.status true: active false: inactive
 * @returns
 */
function StatusLabel(props: { status: boolean }) {
	return (
		<Show
			when={props.status}
			fallback={<div class={cn(baseClass, 'text-red-500 gap-x-2 bg-red-100/60')}>Inactivo</div>}
		>
			<div class={cn(baseClass, 'text-emerald-500 gap-x-2 bg-emerald-100/60')}>Activo</div>
		</Show>
	);
}

export default StatusLabel;
