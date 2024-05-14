import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetUsersType } from '../requests/userRequests';
import RoleCell from './RoleCell';

function UserTable(props: { users: GetUsersType }) {
	return (
		<TableContainer>
			<Table class='border border-white-200'>
				<TableHeader class='sticky top-0'>
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
							<TableCell colspan={6}>
								No se encontraron resultados. Por favor, ajuste los filtros de búsqueda.
							</TableCell>
						</TableRow>
					</Show>
					<For each={props.users}>
						{user => (
							<TableRow class='bg-white *:w-1/6 group'>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.name}</TableCell>
								<RoleCell id={user.id} role={user.role} />
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
		</TableContainer>
	);
}

export default UserTable;
