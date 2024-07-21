import { useNavigate } from '@solidjs/router';
import { Button } from '~/components/ui/Button';
import { Timeline } from '~/components/ui/Timeline';
import { USERS_PATH, USER_UPDATE_PATH } from '~/constants/paths';
import { roles } from '~/constants/roles';
import { NO_ROLE } from '~/envs/roles';
import type { GetUserType } from '../requests/userGet';
import { parseDateTimeHuman } from '~/lib/parseTime';

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
						<ValuesWithTitles support='ID' title={user()?.id} />
						<ValuesWithTitles support='Nombre' title={user()?.name} />
						<ValuesWithTitles support='Nombre de usuario' title={user()?.username} />
						<ValuesWithTitles support='Estado' title={!user()?.deleted_at ? 'Activo' : 'Inactivo'} />
						<ValuesWithTitles support='Rol' title={roles[user()?.role || NO_ROLE].label} />
					</div>
					<div class='mx-auto'>
						<Timeline bulletSize={20} items={timelineArr()} activeItem={2} />
					</div>
				</div>
			</div>
			<div class='flex m-4 justify-between'>
				<Button type='button' onclick={handleCancel} class='bg-orange-400 hover:bg-orange-600'>
					Volver
				</Button>
				<Button type='button' onclick={handleEdit} class='bg-practice_date hover:bg-blue-800'>
					Editar
				</Button>
			</div>
		</div>
	);
}

function ValuesWithTitles(props: { support: string; title: string }) {
	return (
		<>
			<div class='flex-1 space-y-1'>
				<p class='font-medium leading-none'>{props.title}</p>
				<p class='text-sm text-muted-foreground'>{props.support}</p>
			</div>
		</>
	);
}

export default UserCard;
