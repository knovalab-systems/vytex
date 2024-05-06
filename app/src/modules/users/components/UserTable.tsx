import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetUsersType } from '../requests/userRequests';
import { For, Show } from 'solid-js';

function UserTable(props: { users: GetUsersType }) {
	return (
		<div class='overflow-hidden border border-white-200 rounded-lg shadow-md'>
			<Table>
				<TableHeader>
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
					<Show when={props.users && props.users.length > 0}>
						<For each={props.users}>
							{user => (
								<TableRow class=' bg-white'>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.rol}</TableCell>
									<TableCell>{user.delete_at ? 'Inactivo' : 'Activo'}</TableCell>
									<TableCell>Acciones</TableCell>
								</TableRow>
							)}
						</For>
					</Show>
				</TableBody>
			</Table>
		</div>
	);
}

export default UserTable;
