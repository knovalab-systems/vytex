import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetUsersType } from '../requests/userGetRequests';
import ActionsCell from './ActionsCell';
import DeletedAtCell from './DeletedAtCell';
import RoleCell from './RoleCell';

function UserTable(props: { users?: GetUsersType }) {
	return (
		<TableContainer>
			<Table class='table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-trailway *:text-white hover:bg-trailway'>
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
							<TableCell colspan={6}>No se han encontraron usuarios.</TableCell>
						</TableRow>
					</Show>
					<For each={props.users}>
						{user => (
							<TableRow class='bg-white group'>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.name}</TableCell>
								<RoleCell userId={user.id} roleValue={user.role} />
								<DeletedAtCell deleted_at={user.deleted_at} userId={user.id} />
								<ActionsCell userId={user.id} />
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default UserTable;
