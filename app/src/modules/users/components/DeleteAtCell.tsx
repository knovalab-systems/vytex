import { getLocalTimeZone, now } from '@internationalized/date';
import { Show, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Switch } from '~/components/ui/Switch';
import { TableCell } from '~/components/ui/Table';
import type { User } from '~/schemas/coreSchema';
import { updateUserRequest } from '../requests/userUpdateRequests';

function DeleteAtCell(props: { userId: string; delete_at: string | null }) {
	const [status, setStatus] = createSignal(!props.delete_at);
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = (newStatus: boolean) => {
		setStatus(newStatus);
		setLoading(true);
		const user: User = { delete_at: null };
		if (!newStatus) {
			const date = now(getLocalTimeZone()).toAbsoluteString();
			user.delete_at = date;
		}
		updateUserRequest(props.userId, user)
			.then(() => {
				toast.success('El estado ha sido actualizado');
			})
			.catch(() => {
				setStatus(!newStatus);
				toast.error('Error al actualizar el estado');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<TableCell>
			<div class='flex h-full gap-2 group-hover:*:block'>
				<Show
					when={status()}
					fallback={
						<div class='inline-flex items-center px-3 py-1 rounded-full text-red-500 gap-x-2 bg-red-100/60'>
							Inactivo
						</div>
					}
				>
					<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 gap-x- bg-emerald-100/60'>
						Activo
					</div>
				</Show>
				<div class='my-auto relative lg:hidden' title='Actualizar estado'>
					<Switch checked={status()} onChange={handleSubmit} disabled={loading()} />
				</div>
			</div>
		</TableCell>
	);
}

export default DeleteAtCell;
