import { Show } from 'solid-js';

/**
 * @param {object} props
 * @param {boolean} props.status true: active false: inactive
 * @returns
 */
function StatusLabel(props: { status: boolean }) {
	return (
		<Show
			when={props.status}
			fallback={
				<div class='inline-flex items-center px-3 py-1 rounded-full text-red-500 gap-x-2 bg-red-100/60'>Inactivo</div>
			}
		>
			<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 gap-x- bg-emerald-100/60'>
				Activo
			</div>
		</Show>
	);
}

export default StatusLabel;
