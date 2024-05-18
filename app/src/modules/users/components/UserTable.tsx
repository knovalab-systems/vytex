import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetUsersType } from '../requests/getUserRequests';
import DeleteAtCell from './DeleteAtCell';
import RoleCell from './RoleCell';

function UserTable(props: { users: GetUsersType }) {
	return (
		<TableContainer>
			<Table class='table-auto'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-trailway *:text-white hover:bg-trailway/90'>
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
							<TableCell colspan={6}>No se han encontraron resultados.</TableCell>
						</TableRow>
					</Show>
					<For each={props.users}>
						{user => (
							<TableRow class='bg-white *:w-1/6 group'>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.name}</TableCell>
								<RoleCell userId={user.id} roleValue={user.role} />
								<DeleteAtCell delete_at={user.delete_at} userId={user.id} />
								<TableCell>Acciones</TableCell>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default UserTable;
