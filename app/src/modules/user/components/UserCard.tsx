import { useNavigate } from '@solidjs/router';
import LitsTile from '~/components/LitsTile';
import { Button } from '~/components/ui/Button';
import { Timeline } from '~/components/ui/Timeline';
import { USERS_PATH, USER_UPDATE_PATH } from '~/constants/paths';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetUserType } from '../requests/userGet';

function UserCard(props: { user?: GetUserType }) {
	const navigate = useNavigate();
	const user = () => props.user;
	const timelineArr = () => {
		const arr = [
			{
				title: 'Fecha de creación',
				description: parseDateTimeHuman(user()?.created_at),
			},
			{
				title: 'Fecha de actualización',
				description: parseDateTimeHuman(user()?.updated_at),
			},
		];
		if (user()?.deleted_at) {
			arr.push({
				title: 'Fecha de inactivación',
				description: parseDateTimeHuman(user()?.deleted_at),
			});
		}
		return arr;
	};

	const handleCancel = () => navigate(USERS_PATH);
	const handleEdit = () => navigate(`${USER_UPDATE_PATH}/${user()?.id}`);

	return (
		<div class='w-full md:w-4/6 xl:w-2/5'>
			<div class='p-8 m-4 gap-4 bg-white border-gray-100 shadow-md rounded-md border'>
				<h1 class='text-2xl font-bold text-center mb-8'>Detalles del usuario</h1>
				<div class='flex gap-4'>
					<div class='flex flex-col gap-4 flex-1'>
						<LitsTile support='ID' title={user()?.id} />
						<LitsTile support='Nombre' title={user()?.name} />
						<LitsTile support='Nombre de usuario' title={user()?.username} />
						<LitsTile support='Estado' title={!user()?.deleted_at ? 'Activo' : 'Inactivo'} />
						<LitsTile support='Rol' title={user()?.role?.name} />
					</div>
					<div class='mx-auto'>
						<Timeline bulletSize={20} items={timelineArr()} activeItem={2} />
					</div>
				</div>
			</div>
			<div class='flex m-4 justify-between'>
				<Button type='button' onclick={handleCancel} variant='secondary'>
					Volver
				</Button>
				<Button type='button' onclick={handleEdit} variant='action'>
					Actualizar
				</Button>
			</div>
		</div>
	);
}

export default UserCard;
