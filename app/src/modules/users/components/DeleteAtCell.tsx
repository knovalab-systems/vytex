import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Switch } from '~/components/ui/Switch';
import { TableCell } from '~/components/ui/Table';
import { updateUserRequest } from '../requests/updateUserRequests';

function DeleteAtCell(props: { userId: string; delete_at: string | null }) {
	const [status, setStatus] = createSignal(!props.delete_at);
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = (newStatus: boolean) => {
		setStatus(newStatus);
		setLoading(true);
		const user = { delete_at: newStatus ? null : '' };
		updateUserRequest(props.userId, user)
			.then(() => {
				toast.success('El rol ha sido actualizado');
			})
			.catch(() => {
				setStatus(!newStatus);
				toast.error('Error al actualizar rol');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<TableCell>
			<div class='flex h-full gap-2 group-hover:*:block'>
				{status() ? (
					<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 gap-x- bg-emerald-100/60 '>
						Activo
					</div>
				) : (
					<div class='inline-flex items-center px-3 py-1 rounded-full text-red-500 gap-x-2 bg-red-100/60 '>
						Inactivo
					</div>
				)}
				<div class='my-auto relative hidden'>
					<Switch checked={status()} onChange={handleSubmit} disabled={loading()} />
				</div>
			</div>
		</TableCell>
	);
}

export default DeleteAtCell;
