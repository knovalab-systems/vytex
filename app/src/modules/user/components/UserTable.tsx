import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { USERS_PATH, USER_UPDATE_PATH } from '~/constants/paths';
import type { GetUsersType } from '../requests/userGet';
import DeletedAtCell from './DeletedAtCell';
import RoleCell from './RoleCell';

function UserTable(props: { users?: GetUsersType }) {
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Usuario</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.users?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={6}>No se han encontrado usuarios.</TableCell>
						</TableRow>
					</Show>
					<For each={props.users}>
						{user => (
							<TableRow class='bg-white group'>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.name}</TableCell>
								<RoleCell userId={user.id} roleValue={user.role as string} />
								<DeletedAtCell deleted_at={user.deleted_at} userId={user.id} />
								<ActionsCell
									actions={[
										{
											path: `${USER_UPDATE_PATH}/${user.id}`,
											title: 'Actualizar usuario',
											label: 'Actualizar',
											icon: 'update',
										},
										{
											path: `${USERS_PATH}/${user.id}`,
											title: 'Detalles del usuario',
											label: 'Detalles',
											icon: 'details',
										},
									]}
								/>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default UserTable;
