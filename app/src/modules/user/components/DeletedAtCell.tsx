import { getLocalTimeZone, now } from '@internationalized/date';
import { Show, createSignal } from 'solid-js';
import toast from 'solid-toast';
import StatusLabel from '~/components/StatusLabel';
import { Switch } from '~/components/ui/Switch';
import { TableCell } from '~/components/ui/Table';
import { usePolicies } from '~/hooks/usePolicies';
import type { User } from '~/types/core';
import { updateUserRequest } from '../requests/userUpdate';

function DeletedAtCell(props: { userId: string; deleted_at: string | null }) {
	const [status, setStatus] = createSignal(!props.deleted_at);
	const [loading, setLoading] = createSignal(false);
	const { hasPolicy } = usePolicies();

	const handleSubmit = (newStatus: boolean) => {
		setStatus(newStatus);
		setLoading(true);
		const user: User = { deleted_at: null };
		if (!newStatus) {
			const date = now(getLocalTimeZone()).toAbsoluteString();
			user.deleted_at = date;
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
			<div class='flex h-full gap-2 group-hover:*:visible'>
				<StatusLabel status={status()} />
				<Show when={hasPolicy('UpdateUsers')}>
					<div class='my-auto relative lg:invisible' title='Actualizar estado'>
						<Switch checked={status()} onChange={handleSubmit} disabled={loading()} />
					</div>
				</Show>
			</div>
		</TableCell>
	);
}

export default DeletedAtCell;
