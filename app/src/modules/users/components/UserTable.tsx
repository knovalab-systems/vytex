import { For } from 'solid-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetUsersType } from '../requests/userRequests';

function UserTable(props: { users: GetUsersType }) {
	return (
		<Table class='table-auto border border-white-200 rounded-lg shadow-md'>
			<TableHeader class=' sticky top-0'>
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
				<For each={props.users}>
					{user => (
						<TableRow class='bg-white'>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.rol}</TableCell>
							<TableCell>
								{user.delete_at ? (
									<div class='inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 '>
										Inactivo
									</div>
								) : (
									<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 bg-emerald-100/60 '>
										Activo
									</div>
								)}
							</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					)}
				</For>
			</TableBody>
		</Table>
	);
}

export default UserTable;
