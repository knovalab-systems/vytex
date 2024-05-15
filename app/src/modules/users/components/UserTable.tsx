import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { USER_ROLE } from '~/utils/constants';
import type { GetUsersType } from '../requests/userRequests';

function UserTable(props: { users: GetUsersType }) {
	return (
		<div class='overflow-hidden h-auto border border-white-200 rounded-lg shadow-md'>
			<Table class='table-auto'>
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
					<Show when={(props.users?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={6}>Datos no encontrados, por favor verifique la busqueda!</TableCell>
						</TableRow>
					</Show>
					<For each={props.users}>
						{user => (
							<TableRow class='bg-white'>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{
									USER_ROLE[user.role as keyof typeof USER_ROLE]
								}</TableCell>
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
		</div>
	);
}

export default UserTable;
